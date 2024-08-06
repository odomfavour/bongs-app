import { Deck } from '@/utils/types';
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

function DeckTable({
  MOCK_DATA,
  COLUMNS,
  handleEdit,
  handleDelete,
  loadingStates,
  fetchedData,
}: {
  MOCK_DATA: any[];
  COLUMNS: any[];
  handleEdit: (data: Deck) => void;
  handleDelete: (id: number) => void;
  loadingStates: {
    [key: number]: boolean;
  };
  fetchedData: Deck[];
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

  console.log('the fetched data', fetchedData);

  return (
    <>
      <div className="flex mb-4 items-center gap-2 md:w-2/5 w-full ml-auto">
        <div className="md:w-4/5 w-3/5">
          <div className="w-full relative">
            <input
              type="search"
              value={globalFilter || ''}
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
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
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
                <div className="flex justify-center items-center  min-h-[60vh]">
                  <div>
                    <div className="flex justify-center items-center">
                      <FaRegFolderClosed className="text-4xl" />
                    </div>
                    <div className="mt-5">
                      <p className="font-medium text-[#475467]">
                        No Deck found
                      </p>
                      <p className="font-normal text-sm mt-3">
                        Click “add barge” button to get started in doing your
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
                    <div className="flex-row flex items-center space-x-2">
                      <button
                        className="bg-blue-300 text-white p-2 rounded-md"
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
                        className="bg-red-700 text-white p-2 rounded-md flex items-center justify-center"
                        onClick={() => handleDelete(row.original.id)}
                        disabled={loadingStates[row.original.id]}
                      >
                        {loadingStates[row.original.id] ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          'Delete'
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

export default DeckTable;
