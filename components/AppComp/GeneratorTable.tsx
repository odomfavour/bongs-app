import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaRegFolderClosed } from 'react-icons/fa6';
import Link from 'next/link';
import {
  useTable,
  usePagination,
  useGlobalFilter,
  TableInstance,
  TableOptions,
  UseGlobalFiltersInstanceProps,
  UsePaginationState,
  UsePaginationInstanceProps,
} from 'react-table';
import { calculateCountdown } from '@/utils/utils';
import Countdown from 'react-countdown';
import { usePathname } from 'next/navigation';
import { toggleLoading } from '@/provider/redux/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

interface Deck {
  name: string;
  deck_number: string;
  deck_type: string;
}

interface Location {
  id: number;
  name: string;
  location_number: string;
  address: string;
  deck_id: string;
  status: string;
  created_at: string;
}

interface BargeComponent {
  id: number;
  storeNo: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}
interface User {
  first_name: string;
  last_name: string;
}

interface ProjectManager {
  id: number;
  first_name: string;
  last_name: string;
}

interface Project {
  id: number;
  project_name: string;
  project_title: string;
  project_duration: string;
  project_start_date: string;
  project_end_date: string;
  project_manager: ProjectManager;
  created_at: string;
}

interface SparePart {
  id: number;
  project: Project;
  description: string;
  quantity: number;
  part_number: string;
  model_number: string;
  threshold: number;
  location: Location;
  warranty_days: string;
  subscriber_id: number;
  project_id: number;
  deck_id: number;
  keystore_id: number;
  uom_id: number;
  location_id: number;
  vendor_id: number;
  safety_category_id: 0;
  barge_equipment_id: 0;
  stock_quantity: number;
  critical_level: string;
  date_acquired: string;
  waranty_period: string;
  status: string;
  remark: string;
  user: User;
}

function GeneratorTable({
  MOCK_DATA,
  COLUMNS,
  handleDelete,
  loadingStates,
  fetchedData,
  handleEdit,
  parent,
  selectedItems,
  handleSelect,
  generatorData,
  requisition,
  bulkDelete,
  quantities,
  handleQuantityChange,
  toggleRequisition,
  toggleBulkDelete,
  hasPermission,
}: {
  requisition: boolean;
  bulkDelete: boolean;
  generatorData: SparePart[];
  parent: string;
  MOCK_DATA: any[];
  COLUMNS: any[];
  handleDelete: (ids: number[]) => void;
  handleEdit: (data: SparePart) => void;
  loadingStates: {
    [key: number]: boolean;
  };
  fetchedData: SparePart[];
  setSelectedItems: any;
  selectedItems: any;
  handleSelect: (id: number) => void;
  quantities: { [key: number]: number };
  handleQuantityChange: (id: number, quatity: number) => void;
  hasPermission: (permision: string) => boolean;
  toggleRequisition: () => void;
  toggleBulkDelete: () => void;
}) {
  const pathname = usePathname();
  const columns = useMemo(() => {
    if (pathname !== '/inventories') {
      return COLUMNS.filter((item) => item.Header !== 'Projects');
    }
    if (!(requisition && selectedItems.length > 0)) {
      return COLUMNS.filter((item) => item.Header !== 'Qty Req');
    }
    return COLUMNS;
  }, [COLUMNS, pathname, requisition, selectedItems]);
  const data = useMemo(() => MOCK_DATA, [MOCK_DATA]);

  const [countdowns, setCountdowns] = useState<
    { days: number; hours: number; minutes: number; seconds: number }[]
  >(generatorData.map((item) => calculateCountdown(item.waranty_period)));

  type CustomTableInstance<T extends object> = TableInstance<T> &
    UseGlobalFiltersInstanceProps<T> &
    UsePaginationInstanceProps<T> & {
      state: UsePaginationState<T> & { globalFilter: string };
    };

  /* create am  instance of the table */
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    state,
    setGlobalFilter,
    nextPage,
    setPageSize,
    previousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    } as TableOptions<any>,

    useGlobalFilter,
    usePagination
  ) as CustomTableInstance<any>;

  const { globalFilter, pageIndex } = state;
  console.log('generatorData', generatorData, 'columns', COLUMNS);
  const dispatch = useDispatch();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const toggleActionsDropdown = () => {
    setIsActionsOpen(!isActionsOpen);
    setIsExportOpen(false); // Close the export dropdown if it is open
  };

  const toggleExportDropdown = () => {
    setIsExportOpen(!isExportOpen);
    setIsActionsOpen(false); // Close the actions dropdown if it is open
  };

  const actionsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionsRef.current &&
      !actionsRef.current.contains(event.target as Node)
    ) {
      setIsActionsOpen(false);
    }
    if (
      exportRef.current &&
      !exportRef.current.contains(event.target as Node)
    ) {
      setIsExportOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = async (format: string) => {
    setIsExportOpen(false);
    try {
      dispatch(toggleLoading(true));
      const response = await axios.get(
        `${process.env.BASEURL}/sparepart/${
          parent === 'Engine'
            ? 'engine'
            : parent === 'Deck'
            ? 'deck'
            : parent === 'Safety'
            ? 'safety'
            : 'hospital'
        }/export`,
        {
          params: { format },
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  return (
    <>
      <div className="flex items-center justify-between my-4 px-2">
        <div className="w-3/5">
          <div className="flex">
            <div
              ref={actionsRef}
              className="relative inline-block text-left mr-4"
            >
              {/* Actions Dropdown button */}
              <button
                className="text-[#1455D3] px-4 py-2 border border-[#1455D3] rounded-[30px] inline-flex items-center"
                onClick={toggleActionsDropdown}
              >
                Actions
              </button>

              {/* Actions Dropdown content */}
              {isActionsOpen && (
                <div className="origin-top-right rounded-[16px] absolute left-0 -mt-2 w-[150px] py-2 px-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-gray-100 z-30">
                  <button
                    className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                    onClick={() => {
                      toggleRequisition();
                      setIsActionsOpen(false);
                    }}
                  >
                    Material Release
                  </button>
                  <button
                    className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                    onClick={() => {
                      toggleBulkDelete();
                      setIsActionsOpen(false);
                    }}
                  >
                    Bulk Delete
                  </button>
                </div>
              )}
            </div>

            <div ref={exportRef} className="relative inline-block text-left">
              {/* Export Dropdown button */}
              <button
                className="text-[#1455D3] px-4 py-2 border border-[#1455D3] rounded-[30px] inline-flex items-center"
                onClick={toggleExportDropdown}
              >
                Export
              </button>

              {/* Export Dropdown content */}
              {isExportOpen && (
                <div className="origin-top-right rounded-[16px] absolute left-0 -mt-2 w-[150px] py-2 px-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-gray-100 z-30">
                  {/* <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('pdf')}
              >
                PDF
              </button> */}
                  <button
                    className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                    onClick={() => handleExport('xlsx')}
                  >
                    Excel
                  </button>
                  {/* <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('csv')}
              >
                CSV
              </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-2/5">
          <div className="w-full relative">
            <input
              type="search"
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            />
            <div className="absolute flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
              <FaSearch className="text-veriDark" />
            </div>
          </div>
        </div>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={index}
              className="border-b bg-[#E9EDF4]"
            >
              {(requisition || bulkDelete) && (
                <th className="py-2 text-center">Check Item</th>
              )}
              {headerGroup.headers.map((column, index) => (
                <th
                  className="py-2 text-center"
                  {...column.getHeaderProps()}
                  key={index}
                >
                  {column.render('Header')}
                </th>
              ))}

              <th className="py-2 text-center">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length == 0 ? (
            <tr className="text-center text-primary bg-white">
              <td className="py-2 text-center" colSpan={14}>
                <div className="flex justify-center items-center  my-8">
                  <div>
                    <div className="flex justify-center items-center">
                      <FaRegFolderClosed className="text-4xl" />
                    </div>
                    <div className="mt-5">
                      <p className="font-medium text-[#475467]">
                        No {parent} found
                      </p>
                      <p className="font-normal text-sm mt-3">
                        Click “add {parent}” button to get started in doing your
                        <br /> first transaction on the platform
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            page.map((row, _index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={_index}>
                  {(requisition || bulkDelete) && (
                    <td className="text-center py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(row.original.id)}
                        onChange={() => handleSelect(row.original.id)}
                      />
                    </td>
                  )}

                  {row.cells.map((cell, index) => {
                    if (cell.column.Header === 'Warranty Days') {
                      const newDate = new Date(cell.value);
                      return (
                        <Countdown
                          key={index}
                          date={newDate}
                          intervalDelay={0}
                          precision={3}
                          renderer={(props) => (
                            <td className="text-center">
                              {props.days}d {props.hours}h {props.minutes}m{' '}
                              {props.seconds}s
                            </td>
                          )}
                        />
                      );
                    }

                    if (cell.column.Header === 'Qty Req') {
                      return (
                        <div key={index}>
                          {selectedItems.includes(row.original.id) &&
                            requisition && (
                              <td>
                                <input
                                  type="number"
                                  className="p-3 border rounded-md w-[100px]"
                                  value={quantities[row.original.id] || ''}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      row.original.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </td>
                            )}
                        </div>
                      );
                    }

                    return (
                      <td
                        className="text-center"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                  <td className="text-left text-sm py-3">
                    <div className="flex justify-left text-sm space-x-2">
                      {((parent === 'Engine' &&
                        hasPermission('can update project engine spartpart')) ||
                        (parent === 'Engine' &&
                          hasPermission('can update MIV engine sparepart')) ||
                        (parent === 'Deck' &&
                          hasPermission('can update project deck sparepart')) ||
                        (parent === 'Deck' &&
                          hasPermission('can update MIV deck sparepart')) ||
                        (parent === 'Hospital' &&
                          hasPermission(
                            'can update project hospital sparepart'
                          )) ||
                        (parent === 'Hospital' &&
                          hasPermission('can update MIV hospital sparepart')) ||
                        (parent === 'Hospital' &&
                          hasPermission('can update MIV hospital sparepart')) ||
                        (parent === 'Safety' &&
                          hasPermission('can update MIV safety sparepart')) ||
                        (parent === 'Safety' &&
                          hasPermission(
                            'can update project safety sparepart'
                          ))) && (
                        <button
                          className="bg-blue-500 text-white p-2 rounded-md"
                          onClick={() => {
                            const selectedRow = fetchedData.find(
                              (item) => item.id === row.original.id
                            );
                            if (selectedRow) {
                              handleEdit(selectedRow);
                            }
                          }}
                        >
                          Edit
                        </button>
                      )}

                      {((parent === 'Engine' &&
                        hasPermission('can delete project engine spartpart')) ||
                        (parent === 'Engine' &&
                          hasPermission('can delete MIV engine sparepart')) ||
                        (parent === 'Deck' &&
                          hasPermission('can delete project deck sparepart')) ||
                        (parent === 'Deck' &&
                          hasPermission('can delete MIV deck sparepart')) ||
                        (parent === 'Hospital' &&
                          hasPermission(
                            'can delete project hospital sparepart'
                          )) ||
                        (parent === 'Hospital' &&
                          hasPermission('can delete MIV hospital sparepart')) ||
                        (parent === 'Hospital' &&
                          hasPermission('can delete MIV hospital sparepart')) ||
                        (parent === 'Safety' &&
                          hasPermission('can delete MIV safety sparepart')) ||
                        (parent === 'Safety' &&
                          hasPermission(
                            'can delete project safety sparepart'
                          ))) && (
                        <button
                          className="bg-red-700 p-2 rounded-md text-white cursor-pointer flex items-center justify-center"
                          onClick={() => handleDelete([row.original.id])}
                          disabled={loadingStates[row.original.id]} // Optional: Disable button while loading
                        >
                          {loadingStates[row.original.id] ? (
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {page.length !== 0 && (
        <div className="flex flex-row justify-end mt-3">
          <span>
            Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}{' '}
          </span>

          <button
            className="mx-3"
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
          >
            {' '}
            Previous{' '}
          </button>
          <button disabled={!canNextPage} onClick={() => nextPage()}>
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default GeneratorTable;
