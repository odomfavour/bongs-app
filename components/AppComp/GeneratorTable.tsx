import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaRegFolderClosed } from "react-icons/fa6";
import Link from "next/link";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  TableInstance,
  TableOptions,
  UseGlobalFiltersInstanceProps,
  UsePaginationState,
  UsePaginationInstanceProps,
} from "react-table";
import { calculateCountdown } from "@/utils/utils";
import Countdown from "react-countdown";
import { usePathname } from "next/navigation";

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
  
}: {
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
}) {

  const pathname = usePathname();
  const columns = useMemo(() => {
    if(pathname !== "/inventories"){
   return COLUMNS.filter(item  => item.Header !== "Projects")
    }
    return COLUMNS
  }
    
    , [COLUMNS, pathname]);
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
  console.log("generatorData", generatorData, "columns", COLUMNS);
  

  return (
    <>
      <div className="flex  items-center gap-2 md:w-2/5 w-full ml-auto my-4">
        <div className="md:w-4/5 w-3/5">
          <div className="w-full relative">
            <input
              type="search"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search here... now"
              className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            />
            <div className="absolute flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
              <FaSearch className="text-veriDark" />
            </div>
          </div>
        </div>

        <button className="bg-grey-400 border text-sm p-3 rounded-md">
          Add Filter
        </button>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={index}
              className="border-b bg-[#E9EDF4]"
            >
              <th className="py-2 text-center">Check Item</th>
              {
              headerGroup.headers.map((column, index) => (
                <th
                  className="py-2 text-center"
                  {...column.getHeaderProps()}
                  key={index}
                >
                  {column.render("Header")}
                </th>
              ))}

              <th className="py-2 text-center">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length == 0 ? (
            <tr className="text-center text-primary bg-white">
              <td className="py-2 text-center" colSpan={11}>
                <div className="flex justify-center items-center  my-6">
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
                  <td className="text-center py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(row.original.id)}
                      onChange={() => handleSelect(row.original.id)}
                    />
                  </td>

                  {row.cells.map((cell, index) => {
                   
                    if (cell.column.Header === "Warranty Days") {
                      console.log("this is the cell", cell)
                      const newDate = new Date(cell.value)
                    return  <Countdown
                        key={index}
                      date={newDate}
                      intervalDelay={0}
                      precision={3}
                      renderer={props => <td   className="text-center">
                                {props.days}d {props.hours}h {props.minutes}m {props.seconds}s
                      </td>}
                    />
                     
                    }

                    return (
                      <td
                        className="text-center"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                  <td className="text-left text-sm py-3">
                    <div className="flex justify-left text-sm space-x-2">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-md"
                        onClick={() => {
                          const selectedRow = fetchedData.find(
                            (item) => item.id == row.original.id
                          );
                          if (selectedRow) {
                            return handleEdit(selectedRow);
                          }
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-700 p-2 rounded-md text-white cursor-pointer flex items-center justify-center
                    "
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
                          "Delete"
                        )}
                      </button>
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
            Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}{" "}
          </span>

          <button
            className="mx-3"
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
          >
            {" "}
            Previous{" "}
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
