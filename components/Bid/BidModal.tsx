import { toggleLoading } from '@/provider/redux/modalSlice';
import { awardBidRfqDataApi } from '@/utils/apiServices/procurementApi';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

function BidModal({
  bidList,
  rfq,
  isRfqAwarded,
}: {
  bidList: {
    BID: number;
    dateReceived: string;
    vendor: string;
    pricing: number;
    paymentTerms: number;
    subtotal: number;
    deliveryPeriod: string;
    currency: string;
    isAwarded: number;
    quoteValidity: string;
    budget_alignment_point: string;
    cost_competitive_point: string;
    evaluation_point: string;
    payment_flexibilty_point: string;
    quote_validity_point: string;
    warranty_point: string;
    delivery_date_point: string;
    wht: number;
    ncf: number;
    vat: number;
    grandTotal: number;
    rating: string;
  }[];
  rfq: string;
  isRfqAwarded: boolean;
}) {
  const dispatch = useDispatch();

  const [isBidAwarded, setIsBidAwarded] = useState(false);

  const [disableButton, setDisablebutton] = useState(false);

  useEffect(() => {
    setDisablebutton(isRfqAwarded);
  }, []);
  console.log('bid response inner', bidList);
  return (
    <div>
      <h2 className="font-bold text-2xl text-center my-8 mx-auto">
        Bids on RFQ {rfq}- Request for Technical Equipments
      </h2>

      <div className="overflow overflow-y-scroll pb-2">
        <table>
          <thead>
            <tr>
              <th className="text-center text-sm">SN</th>
              <th className="text-center text-sm">Date Received</th>
              <th className="text-center text-sm">Vendor</th>
              <th className="text-center text-sm"> Payment Terms(%)</th>
              <th className="text-center text-sm">Quote validity</th>
              <th className="text-center text-sm">Delivery Period</th>
              <th className="text-center text-sm">Sub Total</th>
              <th className="text-center text-sm">WHT(%)</th>
              <th className="text-center text-sm">NCDF(%)</th>
              <th className="text-center text-sm">VAT(%)</th>
              <th className="text-center text-sm">BAP(%)</th>
              <th className="text-center text-sm">CCP(%)</th>
              <th className="text-center text-sm">DDP(%)</th>
              <th className="text-center text-sm">QVP(%)</th>
              <th className="text-center text-sm">PFP(%)</th>
              <th className="text-center text-sm">WP(%)</th>
              <th className="text-center text-sm">WP(%)</th>
              {/* budget_alignment_point (20%) - cost_competitive_point (25%) -
              delivery_date_point (20%) - quote_validity_point (10%) -
              payment_flexibilty_point (15%) - warranty_point (10%) */}
              <th className="text-center text-sm">Evaluation point</th>
              <th className="text-center text-sm">Rating</th>
              <th className="text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bidList.length > 0 ? (
              bidList.map((bid, index) => (
                <tr key={index}>
                  <td className="text-sm text-center">{index + 1}</td>
                  <td className="text-sm text-center">{bid.dateReceived}</td>
                  <td className="text-sm text-center">{bid.vendor}</td>
                  <td className="text-sm text-center">{bid.paymentTerms}</td>
                  <td className="text-sm text-center">{bid.quoteValidity}</td>
                  <td className="text-sm text-center">{bid.deliveryPeriod}</td>
                  <td className="text-sm text-center">
                    {bid.currency}
                    {bid.subtotal}
                  </td>
                  <td className="text-sm text-center">{bid.wht}</td>
                  <td className="text-sm text-center">{bid.ncf}</td>
                  <td className="text-sm text-center">{bid.vat}</td>
                  <td className="text-sm text-center">{bid.grandTotal}</td>
                  <td className="text-sm text-center">
                    {bid?.budget_alignment_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">
                    {bid?.cost_competitive_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">
                    {bid?.delivery_date_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">
                    {bid?.quote_validity_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">
                    {bid?.payment_flexibilty_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">
                    {bid?.warranty_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">
                    {bid?.evaluation_point || 'N/A'}
                  </td>
                  <td className="text-sm text-center">{bid.rating || 1}</td>
                  <td className=" ">
                    <button
                      disabled={disableButton}
                      onClick={() => {
                        const getAlBidForRfq = async () => {
                          try {
                            dispatch(toggleLoading(true));
                            const response = await awardBidRfqDataApi(
                              bid.BID,
                              bid.isAwarded
                            );
                            const { message } = response;
                            toast.success(message);
                            setIsBidAwarded(true);

                            dispatch(toggleLoading(false));
                          } catch (error: any) {
                            dispatch(toggleLoading(false));
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
                      className={`${
                        disableButton
                          ? bid.isAwarded
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                          : 'bg-gray-500 cursor-pointer '
                      } text-center text-sm text-white flex-row flex items-center  justify-center rounded-xl px-2 py-1  `}
                    >
                      <span className={` text-center text-sm text-white `}>
                        {disableButton
                          ? bid.isAwarded
                            ? 'awarded'
                            : 'rejected'
                          : 'award'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr aria-colspan={13}>
                <span>No Bid found</span>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BidModal;
