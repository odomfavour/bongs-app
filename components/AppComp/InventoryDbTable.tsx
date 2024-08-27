import { formatDate } from '@/utils/utils';
import React, { useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaRegFolderClosed } from 'react-icons/fa6';
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

interface Inventory {
  id: number;
  description: string;
  quantity: number;
  threshold: string;
  part_number: string;
  model_number: string;
  location: string;
}

function InventoryDbTable({
  MOCK_DATA,
  COLUMNS,
  fetchedData,
  hasPermission,
}: {
  MOCK_DATA: any[];
  COLUMNS: any[];
  hasPermission: (permision: string) => boolean;
  fetchedData: Inventory[];
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
      <div className="flex my-4 items-center gap-2 md:w-2/5 w-full ml-auto">
        <div className="md:w-4/5 w-3/5">
          <div className="w-full relative">
            <input
              type="search"
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search here"
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
              <th className="py-2 text-center">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length == 0 ? (
            <tr className="text-center text-primary bg-white">
              <td className="py-2 text-center" colSpan={10}>
                <div className="flex justify-center items-center my-8 ">
                  <div>
                    <div className="flex justify-center items-center">
                      <FaRegFolderClosed className="text-4xl" />
                    </div>
                    <div className="mt-5">
                      <p className="font-medium text-[#475467]">
                        No Inventories found
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
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
                </tr>
              );
            })
          )}
        </tbody>
      </table>
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
    </>
  );
}

export default InventoryDbTable;
