'use client';
import QA_QCTable from '@/components/AppComp/QA_QCTable';
import { fetchAllQualityAssuranceDataApi } from '@/utils/apiServices/procurementApi';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { toggleLoading } from '@/provider/redux/modalSlice';

import { useDispatch, useSelector } from 'react-redux';

function Page() {
  const [openModal, setOpenModal] = useState(false);

  const route = useRouter();

  const [isUIReady, setIsUIReady] = useState(false);

  const [allQualityAssuranceData, setAllQualityAssuranceData] = useState<any[]>(
    []
  );

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
  const [selectedQA, setSelectedQA] = useState(0);
  const [openQAApproveModal, setOpenQAApproveModal] = useState(false);
  const handleQAApproveClose = () => {
    setOpenQAApproveModal(false);
  };

  const viewQA = (id: number) => {
    setSelectedQA(id);
    setOpenQAApproveModal(true);
  };

  //memoclose

  const fetchProcurementsData = useCallback(async () => {
    setIsUIReady(false);
    try {
      const [allQualityAssurance] = await Promise.all([
        fetchAllQualityAssuranceDataApi(),
      ]);

      setAllQualityAssuranceData(allQualityAssurance.data.data);

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
  }, [route, fetchProcurementsData]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const user = useSelector((state: any) => state.user.user);

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

  if (!isUIReady) {
    return (
      <div className="h-screen flex  justify-center items-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className=" bg-[#f8f8f8]">
      <div className="flex flex-row items-center justify-between py-2 mt-8 ">
        <span className="text-black text-bold text-[32px] font-medium font-['Inter']">
          Quality Assurance and Control({allQualityAssuranceData.length})
        </span>
      </div>

      {/* search field ends */}

      <QA_QCTable
        fetchedData={allQualityAssuranceData}
        viewQA={viewQA}
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
    </div>
  );
}

export default Page;
