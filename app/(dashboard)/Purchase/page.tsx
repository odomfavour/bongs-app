'use client';

import PurchaseOrderTable from '@/components/AppComp/PurchaseOrderTable';
import ProcurementCharts from '@/components/dashboard/charts/ProcurementCharts';
import Modal from '@/components/dashboard/Modal';
import ProcurementAddRequestModal from '@/components/procurement/ProcurementAddRequestModal';
import { fetchAllPurchaseOrderDataApi } from '@/utils/apiServices/procurementApi';
import { currencyFormatter } from '@/utils/usefulFunc';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ApproveMemo from '@/components/procurement/ApproveMemo';
import CreatePurchaseOrder from '@/components/procurement/CreatePurchaseOrder';

import { useDispatch, useSelector } from 'react-redux';
import ApprovePurchaseOrder from '@/components/procurement/ApprovePurchaseOrder';

function Page() {
  const [openModal, setOpenModal] = useState(false);

  const route = useRouter();

  const [isUIReady, setIsUIReady] = useState(false);

  const [showBidForRfqModal, setShowBidForRfqModal] = useState(false);

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

  const [allRfq, setAllRfq] = useState<any[]>([]);

  const [year, setYear] = useState('');

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
  const [selectedPO, setSelectedPO] = useState(0);
  const viewItem = (id: number) => {
    setSelectedMemo(id);
    setOpenApproveModal(true);
  };

  const [openPOModal, setOpenPOModal] = useState(false);

  const [openPOApproveModal, setOpenPOApproveModal] = useState(false);
  const handlePOApproveClose = () => {
    setOpenPOApproveModal(false);
  };
  const handlePOClose = () => {
    setOpenPOModal(false);
  };

  const viewPO = (id: number) => {
    setSelectedPO(id);
    setOpenPOApproveModal(true);
  };
  const createPO = (id: number) => {
    setSelectedPO(id);
    setOpenPOModal(true);
  };

  //memoclose

  const fetchProcurementsData = useCallback(async () => {
    setIsUIReady(false);
    try {
      const [allPurchaseOrder] = await Promise.all([
        fetchAllPurchaseOrderDataApi(),
      ]);

      setAllPurhaseOrderData(allPurchaseOrder.data.data);
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
  }, []);

  useEffect(() => {
    fetchProcurementsData();
  }, [year, route, fetchProcurementsData]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

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
      timeline: item?.request_for_quotations?.delivery_date,
      signatory: item?.memo?.signatory_count,
      vendor: item?.bid?.vendor,
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
          Purchase Orders({allPurhaseOrderData.length})
        </span>

        <div
          onClick={() => setOpenPOModal(true)}
          className=" border border-[#1354d2]  rounded-xl  justify-center items-center  flex flex-row px-2  cursor-pointer "
        >
          <span className="text-[#1354d2] text-xl font-normal font-['Inter']">
            New purchase Order
          </span>
        </div>
      </div>

      <PurchaseOrderTable
        fetchedData={allPurhaseOrderData}
        handleOpenModal={handleOpenModal}
        createPO={createPO}
        viewPO={viewPO}
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

      <Modal
        title=""
        isOpen={openPOModal}
        onClose={handlePOClose}
        maxWidth="40%"
      >
        <CreatePurchaseOrder
          fetchPOData={fetchProcurementsData}
          handlePOClose={handlePOClose}
          poId={selectedPO}
        />
      </Modal>
      <Modal
        title=""
        isOpen={openPOApproveModal}
        onClose={handlePOApproveClose}
        maxWidth="60%"
      >
        <ApprovePurchaseOrder
          selectedPO={selectedPO}
          setOpenApprovePO={setOpenPOApproveModal}
          fetchPOData={fetchProcurementsData}
        />
      </Modal>

      {/* modal section ends */}
    </div>
  );
}

export default Page;
