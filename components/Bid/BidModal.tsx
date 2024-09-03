import { toggleLoading } from "@/provider/redux/modalSlice";
import { awardBidRfqDataApi } from "@/utils/apiServices/procurementApi";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function BidModal({
  bidList,
  rfq,
  isRfqAwarded
}: {
  bidList: {
    BID: number;
    dateReceived: string;
    vendor: string;
    pricing: number;
    paymentTerms: number;
    subtotal: number,
    deliveryPeriod: string;
    currency: string;
    isAwarded: number;
    quoteValidity: string,
    wht: number,
    ncf: number,
    vat: number,
    grandTotal: number,
    rating: string,
    
  }[];
    rfq: string;
    isRfqAwarded: boolean
}) {
  const dispatch = useDispatch();


  const [isBidAwarded, setIsBidAwarded] = useState(false)

  const [disableButton, setDisablebutton] = useState(false)


  useEffect(() => { 
    setDisablebutton(isRfqAwarded)
  
  },[])
  console.log("bid response inner", bidList)
  return (
    <div>
      <h2 className="font-bold text-2xl text-center my-8 mx-auto">
        Bids on RFQ {rfq}- Request for Technical Equipments
      </h2>

      <div>
        <table>
          <thead>
            <tr>
              <th className="text-center">SN</th>
              <th  className="text-center">Date Received</th>
              <th className="text-center">Vendor</th>
              <th className="text-center"> Payment Terms(%)</th>
              <th className="text-center">Quote validity</th>
              <th className="text-center">Delivery Period</th>
              <th   className="text-center">Sub Total</th>
              <th className="text-center">WHT(%)</th>
              <th className="text-center">NCDF(%)</th>
              <th className="text-center">VAT(%)</th>
            
              <th className="text-center">Grand Total</th>
              <th className="text-center">Rating</th>
              <th className="text-center">Actions</th>
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
                  <td className="text-sm text-center">{bid.currency}{bid.subtotal}</td>
                  <td className="text-sm text-center">{bid.wht}</td>
                  <td className="text-sm text-center">{bid.ncf}</td>
                  <td className="text-sm text-center">{bid.vat}</td>
                  <td className="text-sm text-center">{bid.grandTotal}</td> 
                  <td className="text-sm text-center">{bid.rating}</td>  
                  <td className=" ">
                    <button
                      disabled={ disableButton }
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
                            setIsBidAwarded(true)
                         
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

                  className = { `${disableButton  ? bid.isAwarded ? "bg-green-500" : "bg-blue-500": "bg-gray-500 cursor-pointer "} text-center text-sm text-white flex-row flex items-center  justify-center rounded-xl px-2 py-1  `}
                   
                    >
                      <span className={ ` text-center text-sm text-white `}>
                        { 
                          disableButton ? bid.isAwarded ? "awarded" : "rejected" :  "award"
                        }
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
