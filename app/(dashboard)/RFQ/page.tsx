"use client";
import RFQTable from "@/components/AppComp/RFQTable";
import Modal from "@/components/dashboard/Modal";
import ProcurementAddRequestModal from "@/components/procurement/ProcurementAddRequestModal";
import { fetchAllRfqDataApi } from "@/utils/apiServices/procurementApi";
import { procurementMenuList } from "@/utils/data";
import { currencyFormatter } from "@/utils/usefulFunc";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

function Page() {
  const [openModal, setOpenModal] = useState(false);

  const route = useRouter();

  const [selectedMenu, setselectedMenu] = useState("RFQS");

  const [isUIReady, setIsUIReady] = useState(false);

  const [allRfq, setAllRfq] = useState<any[]>([]);

  const handleClose = () => setOpenModal(!openModal);

  const fetchProcurementsData = useCallback(async () => {
    setIsUIReady(false);
    try {
      const [allRfqData] = await Promise.all([fetchAllRfqDataApi()]);
      // console.log("fetched all rfq", allRfqData);

      setAllRfq(allRfqData.data.data);
      setIsUIReady(true);

      // You can similarly setStoreItems if needed
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
    fetchProcurementsData();
  }, [fetchProcurementsData, route]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const itemListRFQ = allRfq.map((item, i) => {
    return {
      ...item,
      "S/N": i + 1,
      rfqId: `RFQ ${item.id}`,
      title: item.title,
      type: item.procurement_type,
      status: item.status,
      budget: `${item?.currency}${
        item.budget !== null ? currencyFormatter(item.budget) : ""
      }`,
      date: item.bidding_deadline,
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
          Request For Quotations(RFQs) {`(${allRfq.length})`}
        </span>

        <div
          onClick={() => setOpenModal(!openModal)}
          className=" border border-[#1354d2]  rounded-xl  justify-center items-center  flex flex-row px-2  cursor-pointer "
        >
          <span className="text-[#1354d2] text-xl font-normal font-['Inter']">
            New Request
          </span>
        </div>
      </div>

      {/* search field ends */}

   
    

      <RFQTable
        fetchedData={allRfq}
        handleOpenModal={handleOpenModal}
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
            Header: "Type",
            accessor: "type",
          },
          {
            Header: "Budget",
            accessor: "budget",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Date",
            accessor: "date",
          },
        ]}
        MOCK_DATA={itemListRFQ}
      />

      {/* modal section starts */}

      <Modal
        isOpen={openModal}
        title={"Request For Quotations"}
        onClose={handleClose}
        maxWidth="1050px"
      >
        <ProcurementAddRequestModal handleClose={handleClose} />
      </Modal>

      {/* modal section ends */}
    </div>
  );
}

export default Page;
