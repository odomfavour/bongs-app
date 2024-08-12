'use client';
import Modal from '@/components/dashboard/Modal';
import ApproveRequisition from '@/components/requisitions/ApproveRequisition';
import DeclineRequisition from '@/components/requisitions/DeclineRequisition';
import ReleaseItem from '@/components/requisitions/ReleaseItem';
import RequisitionListTable from '@/components/requisitions/RequisitionListTable';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface Requisition {
  id: number;
  inventoryable_type: string;
  quantity: number;
  created_at: string;
}

interface RequestedBy {
  id: number;
  first_name: string;
  last_name: string;
}
interface RequisitionItem {
  id: number;
  indent_number: string;
  batch_code: string;
  hod_status: string;
  company_rep_status: string;
  barge_master_status: string;
  status: string;
  requisition: Requisition;
  requested_by: RequestedBy;
}

const Page = () => {
  const [requisitions, setRequisitions] = useState<RequisitionItem[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(`${process.env.BASEURL}/requisitions`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('resp', response);
      setRequisitions(response?.data?.data?.data);
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, router, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };
  const [openDeclineModal, setOpenDeclineModal] = useState(false);

  const handleDeclineClose = () => {
    setOpenDeclineModal(false);
  };
  const [openReleaseModal, setOpenReleaseModal] = useState(false);

  const handleReleaseClose = () => {
    setOpenReleaseModal(false);
  };

  const [requisitionItem, setRequisitionItem] = useState<any>({});

  return (
    <div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Material Release</p>
      
      </div>
      <div>
        <div className="mb-5 flex justify-end">
          <Link
            href="/requisition-history"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            View Release History
          </Link>
        </div>
        <RequisitionListTable
          data={requisitions}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
          setOpenDeclineModal={setOpenDeclineModal}
          setRequisitionItem={setRequisitionItem}
          setOpenReleaseModal={setOpenReleaseModal}
        />
      </div>

      <Modal title="" isOpen={openModal} onClose={handleClose} maxWidth="40%">
        <ApproveRequisition
          requisitionItem={requisitionItem}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
        />
      </Modal>
      <Modal
        title=""
        isOpen={openDeclineModal}
        onClose={handleDeclineClose}
        maxWidth="40%"
      >
        <DeclineRequisition
          requisitionItem={requisitionItem}
          setOpenModal={setOpenDeclineModal}
          fetchData={fetchData}
        />
      </Modal>

      <Modal
        title=""
        isOpen={openReleaseModal}
        onClose={handleReleaseClose}
        maxWidth="40%"
      >
        <ReleaseItem
          requisitionItem={requisitionItem}
          setOpenModal={setOpenReleaseModal}
          fetchData={fetchData}
        />
      </Modal>
    </div>
  );
};

export default Page;
