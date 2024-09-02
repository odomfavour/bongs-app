import { Barge } from '@/utils/types';
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

function MemoTable({
  MOCK_DATA,
  COLUMNS,
  fetchedData,
  viewItem,
  printItem,
  handleOpenModal,
}: {
  MOCK_DATA: any[];
  COLUMNS: any[];
  fetchedData: Barge[];
  viewItem: (id: number) => void;
  printItem: (id: number) => void;
  handleOpenModal: () => void;
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

  console.log('the fetched data memo', fetchedData);

  return (
    <>
      <div className="flex mb-4 justify-end gap-2 md:w-2/5 w-full ml-auto">
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
                <div className="flex justify-center items-center  my-8 ">
                  <div>
                    <div className="flex justify-center items-center">
                      <FaRegFolderClosed className="text-4xl" />
                    </div>
                    <div className="mt-5">
                      <p className="font-medium text-[#475467]">No Bid found</p>
                      <p className="font-normal text-sm mt-3">
                        Click “add new bid” button to get started in doing your
                        <br /> first transaction on the platform
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            page.map((row, index) => {
              prepareRow(row);
              const { has_signed_count, signatory_count, id } = row.original;
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
                  <td>
                    <td className="flex justify-center items-center border-none">
                      {/* {JSON.stringify(row.original)} */}
                      {has_signed_count === signatory_count ? (
                        <div className="flex-row flex items-center w-max justify-center rounded-xl px-2 py-1 bg-[#007BFF] cursor-pointer">
                          <span
                            className="text-center text-sm text-white"
                            onClick={() => printItem(id)}
                          >
                            Print
                          </span>
                        </div>
                      ) : (
                        <div
                          className="flex-row flex items-center w-max justify-center rounded-xl px-2 py-1 bg-[#a16207] cursor-pointer"
                          onClick={() => viewItem(id)}
                        >
                          <span className="text-center text-sm text-white">
                            View More
                          </span>
                        </div>
                      )}
                    </td>
                  </td>
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

export default MemoTable;
