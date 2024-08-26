import { Deck } from '@/utils/types';
import React, { useMemo } from 'react';
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
interface Requisition {
  id: number;
  inventoryable_type: string;
  quantity: number;
  created_at: string;
}

interface RequestedBy {
  id: number;
  first_name: string;
  last_name: string;
}
interface RequisitionList {
  id: number;
  indent_number: string;
  batch_code: string;
  hod_status: string;
  company_rep_status: string;
  barge_master_status: string;
  status: string;
  requisition: Requisition;
  requested_by: RequestedBy;
}

function RequisitionTable({
  MOCK_DATA,
  COLUMNS,
  fetchedData,
  pathname,
  viewItem,
  user,
  approveReq,
  declineReq,
  releaseItem,
  printItem,
}: {
  approveReq: (item: any) => void;
  declineReq: (item: any) => void;
  releaseItem: (item: any) => void;
  printItem: (item: any) => void;
  user: any;
  viewItem: (id: number) => void;
  pathname: string;
  MOCK_DATA: any[];
  COLUMNS: any[];
  loadingStates: {
    [key: number]: boolean;
  };
  fetchedData: RequisitionList[];
}) {
  const columns = useMemo(() => COLUMNS, [COLUMNS]);
  const data = useMemo(() => MOCK_DATA, [MOCK_DATA]);

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

  return (
    <>
      <div className="flex  items-center gap-2 md:w-2/5 w-full ml-auto my-4">
        <div className="md:w-4/5 w-3/5">
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
              {headerGroup.headers.map((column, index) => (
                <th
                  className="py-2 text-center"
                  {...column.getHeaderProps()}
                  key={index}
                >
                  {column.render('Header')}
                </th>
              ))}

              {pathname === '/requisitions' && (
                <th className=" text-center py-3">Actions</th>
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length == 0 ? (
            <tr className="text-center text-primary bg-white">
              <td className="py-2 text-center" colSpan={10}>
                <div className="flex justify-center items-center  my-8">
                  <div>
                    <div className="flex justify-center items-center">
                      <FaRegFolderClosed className="text-4xl" />
                    </div>
                    <div className="mt-5">
                      <p className="font-medium text-[#475467]">
                        No Requisition found
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
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        className="text-center text-sm"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                  {pathname === '/requisitions' && (
                    <td className="py-2 text-center flex justify-left text-sm items-center">
                      <div className="flex gap-3">
                        <button
                          onClick={() => viewItem(row.original.id)}
                          className="bg-blue-700 text-white p-2 text-sm rounded-md"
                        >
                          View
                        </button>
                        {/* {!user?.is_authorized_for_release ? (
                            <div className="flex gap-3">
                              <button
                                className="bg-green-700 text-white p-2 text-sm rounded-md"
                               
                                onClick={() => {
                                  const selectedRow = fetchedData.find(
                                    (item) => item.id == row.original.id
                                  );
                                  if (selectedRow) {
                                    return approveReq(selectedRow);
                                  }
                                }}
                              >
                                {user?.is_hod && row.original.hod_status == 'pending'
                                  ? 'Check'
                                  : user?.is_barge_master &&
                                    row.original.barge_master_status == 'pending'
                                  ? 'Acknowledge'
                                  : user?.is_company_rep &&
                                    row.original.company_rep_status == 'pending'
                                  ? 'Approve'
                                  : ''}
                              </button>
                              <button
                                className="bg-red-700 text-white p-2 text-sm rounded-md"
                              
                                onClick={() => {
                                  const selectedRow = fetchedData.find(
                                    (item) => item.id == row.original.id
                                  );
                                  if (selectedRow) {
                                    return declineReq(selectedRow);
                                  }
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : row.original.status !== 'Released By Store Keeper' ? (
                            <button
                              className="bg-green-700 text-white p-2 text-sm rounded-md"
                              onClick={() => {
                                const selectedRow = fetchedData.find(
                                  (item) => item.id == row.original.id
                                );
                                if (selectedRow) {
                                  return releaseItem(selectedRow);
                                }
                              }}
                            
                            >
                              Release
                            </button>
                          ) : (
                            <button
                              className="bg-yellow-300 p-2 text-sm rounded-md"
                              onClick={() => printItem(row.original.id)}

                            >
                              Print Item
                            </button>
                          )} */}
                      </div>
                    </td>
                  )}
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

export default RequisitionTable;
