'use client';
import BIDTable from '@/components/AppComp/BIDTable';
import RFQTable from '@/components/AppComp/RFQTable';
import GRNTable from '@/components/AppComp/GRNTable';
import MemoTable from '@/components/AppComp/MemoTable';
import PurchaseOrderTable from '@/components/AppComp/PurchaseOrderTable';
import QA_QCTable from '@/components/AppComp/QA_QCTable';
import ProcurementCharts from '@/components/dashboard/charts/ProcurementCharts';
import Modal from '@/components/dashboard/Modal';
import ProcurementAddRequestModal from '@/components/procurement/ProcurementAddRequestModal';
import {
  fetchAllBidDataApi,
  fetchAllMemoDataApi,
  fetchAllPurchaseOrderDataApi,
  fetchAllQualityAssuranceDataApi,
  fetchAllRfqDataApi,
  fetchBidForRfqDataApi,
  fetchProcurementChartDataApi,
} from '@/utils/apiServices/procurementApi';
import { procurementMenuList } from '@/utils/data';
import { currencyFormatter } from '@/utils/usefulFunc';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BidModal from '@/components/Bid/BidModal';
import CreateNewMemo from '@/components/procurement/CreateNewMemo';
import { formatDate } from '@/utils/utils';
import ApproveMemo from '@/components/procurement/ApproveMemo';

function Page() {
  const [openModal, setOpenModal] = useState(false);

  const route = useRouter();

  const [selectedMenu, setselectedMenu] = useState('RFQS');

  const [isUIReady, setIsUIReady] = useState(false);

  const [showBidForRfqModal, setShowBidForRfqModal] = useState(false);

  const [allBidsForSingleRfq, setAllBidsForSingleRfq] = useState<
    {
      BID: number;
      dateReceived: string;
      vendor: string;
      pricing: number;
      paymentTerms: number;
      rate: number;
      deliveryPeriod: string;
      currency: string;
      isAwarded: string;
    }[]
  >([]);

  const [rfqForGiveneBid, setRfqForGivenBid] = useState('');

  const [rfqStatus, setRfqStatus] = useState<{
    expired: number;
    sent: number;
    responded: number;
  }>({
    expired: 0,
    sent: 0,
    responded: 0,
  });

  const [totalBudget, setTotalsBudget] = useState<number>(0);

  const [allBidData, setAllBidData] = useState<any[]>([]);

  const [allMemoData, setAllMemoData] = useState<any[]>([]);
  const [allPurhaseOrderData, setAllPurhaseOrderData] = useState<any[]>([]);
  const [allQualityAssuranceData, setAllQualityAssuranceData] = useState<any[]>(
    []
  );

  const [allRfq, setAllRfq] = useState<any[]>([]);

  const [year, setYear] = useState('');

  const [yearFormServer, setYearFromServer] = useState<string>('');

  // type of procurement daraf items
  const [openMemoModal, setOpenMemoModal] = useState(false);
  const handleMemoClose = () => {
    setOpenMemoModal(false);
  };

  const handleClose = () => setOpenModal(!openModal);

  //memo
  const [openApproveModal, setOpenApproveModal] = useState(false);

  const handleCloseApprove = () => {
    setOpenApproveModal(false);
  };
  const [selectedMemo, setSelectedMemo] = useState(0);
  const viewItem = (id: number) => {
    setSelectedMemo(id);
    setOpenApproveModal(true);
  };

  //memoclose

  const handleGetAllBidForSingleRfqFunc = (rfqbid: any, rfqId: any) => {
    setAllBidsForSingleRfq(rfqbid);
    setRfqForGivenBid(rfqId);
  };

  const fetchProcurementsData = useCallback(async () => {
    setIsUIReady(false);
    try {
      const [
        procurementDashboardResponse,
        allRfqData,
        allBidData,
        allMemo,
        allPurchaseOrder,
        allQualityAssurance,
      ] = await Promise.all([
        fetchProcurementChartDataApi({ year }),
        fetchAllRfqDataApi(),
        fetchAllBidDataApi(),
        fetchAllMemoDataApi(),
        fetchAllPurchaseOrderDataApi(),
        fetchAllQualityAssuranceDataApi(),
      ]);
  console.log("fetched all rfq", allRfqData)
      setAllBidData(allBidData.data.data);
      setAllRfq(allRfqData.data.data);
      setAllMemoData(allMemo.data.data);
      setAllPurhaseOrderData(allPurchaseOrder.data.data);
      setAllQualityAssuranceData(allQualityAssurance.data.data);
      const { data, status } = procurementDashboardResponse;
      if (status) {
        const { rfq_status, total_budget, year } = data;
        setRfqStatus({
          expired: rfq_status.expired,
          sent: rfq_status.sent,
          responded: rfq_status.responded,
        });
        setTotalsBudget(total_budget);
        setYearFromServer(year);
      }
      setIsUIReady(true);

      // You can similarly setStoreItems if needed
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
    }
  }, [year]);

  useEffect(() => {
    fetchProcurementsData();
  }, [year, route, fetchProcurementsData]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleOpenBidModal = () => {
    setShowBidForRfqModal(!showBidForRfqModal);
  };

  const itemListRFQ = allRfq.map((item, i) => {
    return {
      ...item,
      'S/N': i + 1,
      rfqId: `RFQ ${item.id}`,
      title: item.title,
      type: item.procurement_type,
      status: item.status,
      budget: `${item?.currency}${
        item.budget !== null ? currencyFormatter(item.budget) : ''
      }`,
      date: item.bidding_deadline,
    };
  });

  const itemListBid = allBidData.map((item, i) => {
    return {
      ...item,
      'S/N': i + 1,
      rfqId: `RFQ ${item.id}`,
      title: item.request_for_quotations.title,
      noOfBid: item.request_for_quotations.bid_count,
      status: item.status,
      awardedBids: item.request_for_quotations.awarded_bid
        ? `BID -  ${item.request_for_quotations.awarded_bid}`
        : 'Nil',
      performaInvoice: item.request_for_quotations.proforma_invoice
        ? `Invoive - ${item.request_for_quotations.proforma_invoice}`
        : 'Nil',
      deadline: item.request_for_quotations.bidding_deadline,
    };
  });

  const itemListPurchaseOrders = allPurhaseOrderData.map((item, i) => {
    return {
      ...item,
      'S/N': i + 1,
      poId: `PO ${item.id}`,
      title: item.request_for_quotations.title,
      type: item.request_for_quotations.procurement_type,
      status: item.status,
      date: item.request_for_quotations.bidding_deadline,
      cost: `${item.bid.currency}${currencyFormatter(item.bid.cost)}`,
      timeline: item.request_for_quotations.delivery_date,
      signatory: item.memo.signatory_count,
      vendor: item.bid.vendor,
    };
  });

  const itemlistAllQualityAssuranceData = allQualityAssuranceData.map(
    (item, i) => {
      return {
        ...item,
        'S/N': i + 1,
        rfqId: `RFQ ${item.id}`,
        title: item.title,
        noOfBid: item.bid_count,
        status: item.status,
        awardedBids: 0,
        performaInvoice: 0,
        deadline: item.bidding_deadline,
      };
    }
  );

  const itemListMemo = allMemoData.map((item, i) => {
    console.log('data', item);
    return {
      ...item,
      'S/N': i + 1,
      bidId: `BID ${item.bid_id}`,
      title: item?.request_for_quotations?.title,
      type: item?.request_for_quotations?.procurement_type,
      status: item.status,
      signatory: 0,
      author: `${item.author_by?.first_name} ${item.author_by?.last_name}`,
      // date: formatDate(item?.request_for_quotations?.delivery_date || 0),
      date: formatDate(item?.created_at || 0),
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
      {/* chart sction starts */}
      <ProcurementCharts
        rfq_status={rfqStatus}
        total_budget={totalBudget}
        year={yearFormServer}
        allBidData={allBidData}
      />
      {/* chart section nds */}
      {/* search field */}
      <div className="flex flex-row items-center justify-between py-2 mt-8 ">
        <span className="text-black text-bold text-[32px] font-medium font-['Inter']">
          {selectedMenu === 'RFQS' && `Request For Quotations(RFQs)`}
          {selectedMenu === 'Bids' && `Bids Evaluation `}
          {selectedMenu === 'Memo' && `Memo`}
          {selectedMenu === 'Purchase Orders' && `Purchase Orders`}
          {selectedMenu === 'QA/QC' && `Quality Assurance and Control`}
          {selectedMenu === 'GRN' && `Goods Received`}
        </span>

        {selectedMenu === 'RFQS' && (
          <div
            onClick={() => setOpenModal(!openModal)}
            className=" border border-[#1354d2]  rounded-xl  justify-center items-center  flex flex-row px-2  cursor-pointer "
          >
            <span className="text-[#1354d2] text-xl font-normal font-['Inter']">
              New Request
            </span>
          </div>
        )}

        {selectedMenu === 'Memo' && (
          <div
            onClick={() => setOpenMemoModal(true)}
            className=" border border-[#1354d2]  rounded-xl  justify-center items-center  flex flex-row px-2  cursor-pointer "
          >
            <span className="text-[#1354d2] text-xl font-normal font-['Inter']">
              New Memo
            </span>
          </div>
        )}
      </div>

      {/* search field ends */}

      {/* menu list */}
      <div className="flex flex-row w-full justify-between items-center mt-8 mb-4 space-x-4">
        {procurementMenuList.map((menu) => (
          <div
            key={menu.key}
            onClick={() => setselectedMenu(menu.menuHeading)}
            className={`${
              selectedMenu === menu.menuHeading
                ? 'bg-[#1E1E1E]'
                : 'bg-[#d9d9d9]'
            } cursor-pointer  flex items-center justify-center flex-1 rounded-t-md min-h-[50px]`}
          >
            <span className="text-center text-white text-2xl font-medium font-['Inter']">
              {menu.menuHeading}
              {menu.menuHeading === 'RFQS' && `(${allRfq.length})`}
              {menu.menuHeading === 'Bids' && `(${allBidData.length})`}
              {menu.menuHeading === 'Memo' && `(${allMemoData.length})`}
              {menu.menuHeading === 'Purchase Orders' &&
                `(${allPurhaseOrderData.length})`}
              {menu.menuHeading === 'QA/QC' &&
                `(${allQualityAssuranceData.length})`}
              {menu.menuHeading === 'GRN' &&
                `(${allQualityAssuranceData.length})`}
            </span>
          </div>
        ))}
      </div>
      {/* menu list ends */}

      {/* table section starts */}

      {/* table section ends */}

      {selectedMenu === 'RFQS' && (
        <RFQTable
          fetchedData={allRfq}
          handleOpenModal={handleOpenModal}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },
            {
              Header: 'RFQ ID',
              accessor: 'rfqId',
            },
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
            {
              Header: 'Budget',
              accessor: 'budget',
            },
            {
              Header: 'Status',
              accessor: 'status',
            },
            {
              Header: 'Date',
              accessor: 'date',
            },
          ]}
          MOCK_DATA={itemListRFQ}
        />
      )}
      {selectedMenu === 'Bids' && (
        <BIDTable
          fetchedData={allBidData}
          handleGetAllBidForSingleRfqFunc={handleGetAllBidForSingleRfqFunc}
          handleOpenModal={handleOpenBidModal}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },
            {
              Header: 'RFQ ID',
              accessor: 'rfqId',
            },
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'No. Of Bids',
              accessor: 'noOfBid',
            },
            {
              Header: 'Status',
              accessor: 'status',
            },
            {
              Header: 'Awarded Bids',
              accessor: 'awardedBids',
            },
            {
              Header: 'Proforma Invoice',
              accessor: 'performaInvoice',
            },
            {
              Header: 'Deadline',
              accessor: 'deadline',
            },
          ]}
          MOCK_DATA={itemListBid}
        />
      )}

      {selectedMenu === 'Memo' && (
        <MemoTable
          fetchedData={allMemoData}
          handleOpenModal={handleOpenModal}
          viewItem={viewItem}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },
            {
              Header: 'BID ID',
              accessor: 'bidId',
            },
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
            {
              Header: 'Signatory',
              accessor: 'signatory',
            },
            {
              Header: 'Author',
              accessor: 'author',
            },
            {
              Header: 'Status',
              accessor: 'status',
            },

            {
              Header: 'Date',
              accessor: 'date',
            },
          ]}
          MOCK_DATA={itemListMemo}
        />
      )}

      {selectedMenu === 'Purchase Orders' && (
        <PurchaseOrderTable
          fetchedData={allPurhaseOrderData}
          handleOpenModal={handleOpenModal}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },
            {
              Header: 'PO ID',
              accessor: 'poId',
            },
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
            {
              Header: 'Vendor',
              accessor: 'vendor',
            },
            {
              Header: 'Cost',
              accessor: 'cost',
            },
            {
              Header: 'Signatory',
              accessor: 'signatory',
            },
            {
              Header: 'Timeline',
              accessor: 'timeline',
            },
            {
              Header: 'Status',
              accessor: 'status',
            },

            {
              Header: 'Date',
              accessor: 'date',
            },
          ]}
          MOCK_DATA={itemListPurchaseOrders}
        />
      )}

      {selectedMenu === 'QA/QC' && (
        <QA_QCTable
          fetchedData={allQualityAssuranceData}
          handleOpenModal={handleOpenModal}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },
            {
              Header: 'PO ID',
              accessor: 'poId',
            },
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
            {
              Header: 'Inventory',
              accessor: 'inventory',
            },
            {
              Header: 'Attachment',
              accessor: 'attachment',
            },
            {
              Header: 'Status',
              accessor: 'status',
            },

            {
              Header: 'Date',
              accessor: 'date',
            },
          ]}
          MOCK_DATA={itemlistAllQualityAssuranceData}
        />
      )}

      {selectedMenu === 'GRN' && (
        <GRNTable
          fetchedData={allMemoData}
          handleOpenModal={handleOpenModal}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },
            {
              Header: 'PO ID',
              accessor: 'poId',
            },
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'Type',
              accessor: 'type',
            },
            {
              Header: 'Inventory',
              accessor: 'inventory',
            },
            {
              Header: 'Vendor',
              accessor: 'vendor',
            },
            {
              Header: 'Payment',
              accessor: 'payment',
            },

            {
              Header: 'Date',
              accessor: 'date',
            },
          ]}
          MOCK_DATA={itemListBid}
        />
      )}

      {/* modal section starts */}

      <Modal
        isOpen={openModal}
        title={'Request For Quotations'}
        onClose={handleClose}
        maxWidth="1050px"
      >
        <ProcurementAddRequestModal />
      </Modal>

      <Modal
        isOpen={showBidForRfqModal}
        title={''}
        onClose={handleOpenBidModal}
        maxWidth="1050px"
      >
        <BidModal bidList={allBidsForSingleRfq} rfq={rfqForGiveneBid} />
      </Modal>

      <Modal
        title=""
        isOpen={openMemoModal}
        onClose={handleMemoClose}
        maxWidth="40%"
      >
        <CreateNewMemo
          fetchMemoData={fetchProcurementsData}
          handleMemoClose={handleMemoClose}
        />
      </Modal>

      <Modal
        title=""
        isOpen={openApproveModal}
        onClose={handleCloseApprove}
        maxWidth="60%"
      >
        <ApproveMemo
          selectedMemo={selectedMemo}
          fetchData={fetchProcurementsData}
          setOpenModal={setOpenApproveModal}
        />
      </Modal>

      {/* modal section ends */}
    </div>
  );
}

export default Page;
