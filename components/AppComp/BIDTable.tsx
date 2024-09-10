import { toggleLoading } from '@/provider/redux/modalSlice';
import { fetchBidForRfqDataApi } from '@/utils/apiServices/procurementApi';
import { Barge } from '@/utils/types';
import { currencyFormatter, dateFormater } from '@/utils/usefulFunc';
import { formatDate } from '@/utils/utils';
import React, { useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
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
import { toast } from 'react-toastify';

function BidTable({
  MOCK_DATA,
  COLUMNS,
  fetchedData,
  handleOpenModal,
  handleGetAllBidForSingleRfqFunc,
}: {
  MOCK_DATA: any[];
  COLUMNS: any[];
  fetchedData: Barge[];
  handleOpenModal: () => void;
  handleGetAllBidForSingleRfqFunc: (
    rfqbid: any,
    rfqId: any,
    isrfqAward: boolean
  ) => void;
}) {
  const columns = useMemo(() => COLUMNS, [COLUMNS]);
  const data = useMemo(() => MOCK_DATA, [MOCK_DATA]);

  const dispatch = useDispatch();

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

  console.log('the fetched data from bid', fetchedData);

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
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    if (row.cells[index].column.Header === 'Status') {
                      return (
                        <td
                          className="flex items-center justify-center"
                          {...cell.getCellProps()}
                          key={index}
                        >
                          <span
                            className={`text-center ${
                              row.original.status === 'pending'
                                ? 'text-red-600 bg-red-200 rounded-xl text-sm px-2 py-1'
                                : 'text-green-600 bg-green-200 rounded-xl text-sm px-2 py-1'
                            }`}
                          >
                            {row.original.status}
                          </span>
                        </td>
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
                  <td className="flex justify-center items-center">
                    <div className="flex-row flex items-center w-max justify-center rounded-xl px-2 py-1 bg-[#a16207] cursor-pointer ">
                      <span
                        onClick={() => {
                          const getAlBidForRfq = async () => {
                            try {
                              dispatch(toggleLoading(true));
                              const response = await fetchBidForRfqDataApi(
                                row.original.request_for_quotation_id
                              );
                              console.log(
                                'bid data fetched for single rfq',
                                response
                              );

                              dispatch(toggleLoading(false));
                              console.log('show data from server', response);

                              const isRfqAwarded = response.data.data.filter(
                                (bid: any) => bid.is_awarded === 1
                              );

                              const bid = response.data.data.map((bid: any) => {
                                return {
                                  BID: bid.id,
                                  isAwarded: bid.is_awarded,
                                  dateReceived: dateFormater(bid.created_at),
                                  vendor: bid.vendor,
                                  grandTotal: currencyFormatter(bid.grandTotal),
                                  paymentTerms: bid.payment_term,
                                  deliveryPeriod: bid.delivery_date,
                                  currency: bid.currency,
                                  subtotal: currencyFormatter(bid.cost),
                                  quoteValidity: bid.quote_validity_period,
                                  wht: bid.wht,
                                  ncf: bid.ncdf,
                                  vat: bid.vat,
                                  budget_alignment_point:
                                    bid.budget_alignment_point,
                                  cost_competitive_point:
                                    bid.cost_competitive_point,
                                  evaluation_point: bid.evaluation_point,
                                  payment_flexibilty_point:
                                    bid.payment_flexibilty_point,
                                  quote_validity_point:
                                    bid.quote_validity_point,
                                  warranty_point: bid.warranty_point,
                                  delivery_date_point: bid.delivery_date_point,
                                  rating: bid.evaluation_point,
                                };
                              });

                              const rfqId =
                                row.original.request_for_quotation_id;

                              handleGetAllBidForSingleRfqFunc(
                                bid,
                                rfqId,
                                isRfqAwarded.length > 0 ? true : false
                              );
                              handleOpenModal();
                            } catch (error: any) {
                              console.error('Error:', error);
                              const errorMessage =
                                error?.response?.data?.message ||
                                error?.response?.data?.errors ||
                                error?.message ||
                                'Unknown error';
                              toast.error(`${errorMessage}`);
                            }
                          };
                          getAlBidForRfq();
                        }}
                        className="text-center text-sm text-white"
                      >
                        View More
                      </span>
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

export default BidTable;
