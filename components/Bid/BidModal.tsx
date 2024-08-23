import { toggleLoading } from "@/provider/redux/modalSlice";
import { awardBidRfqDataApi } from "@/utils/apiServices/procurementApi";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function BidModal({
  bidList,
  rfq,
}: {
  bidList: {
    BID: number;
    dateReceived: string;
    vendor: string;
    pricing: number;
    paymentTerms: number;
    rate: number;
    deliveryPeriod: string;
    currency: string;
    isAwarded: string;
  }[];
  rfq: string;
}) {
  const dispatch = useDispatch();
  return (
    <div>
      <h2 className="font-bold text-2xl text-center my-8 mx-auto">
        Bids on RFQ {rfq}- Request for Technical Equipments
      </h2>

      <div>
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Bid</th>
              <th>Date Received</th>
              <th>Vendor</th>
              <th>Pricing</th>
              <th>Delivery Period</th>
              <th>Payment Terms</th>
              <th>Rating</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bidList.length > 0 ? (
              bidList.map((bid, index) => (
                <tr key={index}>
                  <td className="text-sm text-center">{index + 1}</td>
                  <td>
                    <div className="flex flex-row items-center">
                      <span className="text-sm text-center">BID-</span>
                      <span className="text-sm text-center">{bid.BID}</span>
                    </div>
                  </td>
                  <td className="text-sm text-center">{bid.dateReceived}</td>
                  <td className="text-sm text-center">{bid.vendor}</td>
                  <td className="text-sm text-center">
                    {bid.currency}
                    {bid.pricing}
                  </td>
                  <td className="text-sm text-center">{bid.deliveryPeriod}</td>
                  <td className="text-sm text-center">{bid.paymentTerms}</td>
                  <td className="text-sm text-center">{bid.rate}</td>
                  <td className="flex justify-center items-center space-x-4">
                    <div
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
                            dispatch(toggleLoading(false));
                          } catch (error: any) {
                            dispatch(toggleLoading(false));
                            const errorMessage =
                              error?.response?.data?.message ||
                              error?.response?.data?.errors ||
                              error?.message ||
                              "Unknown error";
                            toast.error(`${errorMessage}`);
                          }
                        };
                        getAlBidForRfq();
                      }}
                      className="flex-row flex items-center w-max justify-center rounded-xl px-2 py-1 bg-blue-700 cursor-pointer "
                    >
                      <span className="text-center text-sm text-white">
                        Accept
                      </span>
                    </div>
                    <div className="flex-row flex items-center w-max justify-center rounded-xl px-2 py-1 bg-[#a16207] cursor-pointer ">
                      <span className="text-center text-sm text-white ">
                        View More
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr aria-colspan={9}>
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
