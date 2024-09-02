"use client";
import BIDTable from "@/components/AppComp/BIDTable";

import Modal from "@/components/dashboard/Modal";

import { fetchAllBidDataApi } from "@/utils/apiServices/procurementApi";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import BidModal from "@/components/Bid/BidModal";

import ApproveMemo from "@/components/procurement/ApproveMemo";

function Page() {
  const [openModal, setOpenModal] = useState(false);

  const route = useRouter();

  const [isUIReady, setIsUIReady] = useState(false);

  const [showBidForRfqModal, setShowBidForRfqModal] = useState(false);

  const [allBidsForSingleRfq, setAllBidsForSingleRfq] = useState<
    {
      BID: number;
      dateReceived: string;
      vendor: string;
      pricing: number;
      paymentTerms: number;
      subtotal: number;
      deliveryPeriod: string;
      currency: string;
      isAwarded: string;
      quoteValidity: string;
      wht: number;
      ncf: number;
      vat: number;
      grandTotal: number;
    }[]
  >([]);

  const [rfqForGiveneBid, setRfqForGivenBid] = useState("");

  const [allBidData, setAllBidData] = useState<any[]>([]);

  const handleGetAllBidForSingleRfqFunc = (rfqbid: any, rfqId: any) => {
    setAllBidsForSingleRfq(rfqbid);
    setRfqForGivenBid(rfqId);
  };

  const fetchBidsData = useCallback(async () => {
    setIsUIReady(false);
    try {
      const [allBidData] = await Promise.all([fetchAllBidDataApi()]);
      setAllBidData(allBidData.data.data);
      setIsUIReady(true);
    } catch (error: any) {
      console.error("Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchBidsData();
  }, [route, fetchBidsData]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleOpenBidModal = () => {
    setShowBidForRfqModal(!showBidForRfqModal);
  };


  console.log("allBidData", allBidData)
  const itemListBid = allBidData.map((item, i) => {
    return {
      ...item,
      "S/N": i + 1,
      rfqId: `RFQ ${item.id}`,
      title: item.request_for_quotations.title,
      noOfBid: item.request_for_quotations.bid_count,
      status: item.status,
      awardedBids: item.request_for_quotations.awarded_bid
        ? `BID -  ${item.request_for_quotations.awarded_bid}`
        : "Nil",
      performaInvoice: item.request_for_quotations.proforma_invoice
        ? `Invoive - ${item.request_for_quotations.proforma_invoice}`
        : "Nil",
      deadline: item.request_for_quotations.bidding_deadline,
    };
  });

  if (!isUIReady) {
    return (
      <div className="h-screen flex  justify-center items-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className=" bg-[#f8f8f8]">
      {/* search field */}
      <div className="flex flex-row items-center justify-between py-2">
        <span className="text-black text-bold text-[32px] font-medium font-['Inter']">
          Bids Evaluation   {`(${allBidData.length})`}
        </span>
      
      </div>

      <BIDTable
        fetchedData={allBidData}
        handleGetAllBidForSingleRfqFunc={handleGetAllBidForSingleRfqFunc}
        handleOpenModal={handleOpenBidModal}
        COLUMNS={[
          {
            Header: "S/N",
            accessor: "S/N",
          },
          {
            Header: "RFQ ID",
            accessor: "rfqId",
          },
          {
            Header: "Title",
            accessor: "title",
          },
          {
            Header: "No. Of Bids",
            accessor: "noOfBid",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Awarded Bids",
            accessor: "awardedBids",
          },
          {
            Header: "Proforma Invoice",
            accessor: "performaInvoice",
          },
          {
            Header: "Deadline",
            accessor: "deadline",
          },
        ]}
        MOCK_DATA={itemListBid}
      />

      {/* modal section starts */}

      <Modal
        isOpen={showBidForRfqModal}
        title={""}
        onClose={handleOpenBidModal}
        maxWidth="1050px"
      >
        <BidModal bidList={allBidsForSingleRfq} rfq={rfqForGiveneBid} />
      </Modal>
    </div>
  );
}

export default Page;
