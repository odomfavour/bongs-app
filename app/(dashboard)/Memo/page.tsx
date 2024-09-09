'use client';

import MemoTable from '@/components/AppComp/MemoTable';
import Modal from '@/components/dashboard/Modal';
import ProcurementAddRequestModal from '@/components/procurement/ProcurementAddRequestModal';
import { fetchAllMemoDataApi } from '@/utils/apiServices/procurementApi';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BidModal from '@/components/Bid/BidModal';
import CreateNewMemo from '@/components/procurement/CreateNewMemo';
import { formatDate } from '@/utils/utils';
import ApproveMemo from '@/components/procurement/ApproveMemo';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

function Page() {
  const [openModal, setOpenModal] = useState(false);

  const route = useRouter();

  const [selectedMenu, setselectedMenu] = useState('Memo');

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
  const [selectedPO, setSelectedPO] = useState(0);
  const viewItem = (id: number) => {
    setSelectedMemo(id);
    setOpenApproveModal(true);
  };

  const [openPOModal, setOpenPOModal] = useState(false);

  //memoclose

  const handleGetAllBidForSingleRfqFunc = (rfqbid: any, rfqId: any) => {
    setAllBidsForSingleRfq(rfqbid);
    setRfqForGivenBid(rfqId);
  };

  const fetchProcurementsData = useCallback(async () => {
    setIsUIReady(false);
    try {
      const [allMemo] = await Promise.all([fetchAllMemoDataApi()]);
      setAllMemoData(allMemo.data.data);

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

  const handleOpenBidModal = () => {
    setShowBidForRfqModal(!showBidForRfqModal);
  };
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const printItem = async (id: number) => {
    try {
      dispatch(toggleLoading(true));
      const response = await axios.get(
        `${process.env.BASEURL}/procurement/memo/print/${id}`,
        {
          params: { format: 'pdf' },
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(response?.data?.message);
    } catch (error: any) {
      console.error('Export failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  const initiateMemo = async (id: number) => {
    try {
      dispatch(toggleLoading(true));
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/memo/${id}`,
        {}, // You can pass a data payload here if needed
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success(response?.data?.message);
      fetchProcurementsData();
    } catch (error: any) {
      console.error('Export failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  const itemListMemo = allMemoData.map((item, i) => {
    console.log('data', item);
    return {
      ...item,
      'S/N': i + 1,
      bidId: `BID ${item.bid_id}`,
      title: item?.request_for_quotations?.title,
      type: item?.request_for_quotations?.procurement_type,
      status: item.status,
      signatory: `${item.has_signed_count}     ${item.signatory_count}`,
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
      {/* search field */}
      <div className="flex flex-row items-center justify-between py-2 ">
        <span className="text-black text-bold text-[32px] font-medium font-['Inter']">
          Memo ({allMemoData.length})
        </span>

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

      <MemoTable
        fetchedData={allMemoData}
        handleOpenModal={handleOpenModal}
        viewItem={viewItem}
        initiateMemo={initiateMemo}
        printItem={printItem}
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

      {/* modal section starts */}

      <Modal
        isOpen={openModal}
        title={'Request For Quotations'}
        onClose={handleClose}
        maxWidth="1050px"
      >
        <ProcurementAddRequestModal handleClose={handleClose} />
      </Modal>

      {/*  <Modal
        isOpen={showBidForRfqModal}
        title={''}
        onClose={handleOpenBidModal}
        maxWidth="1050px"
      >
        <BidModal bidList={allBidsForSingleRfq} rfq={rfqForGiveneBid} />
      </Modal> */}

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
