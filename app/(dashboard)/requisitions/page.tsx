'use client';
import Modal from '@/components/dashboard/Modal';
import ApproveRequisition from '@/components/requisitions/ApproveRequisition';
import DeclineRequisition from '@/components/requisitions/DeclineRequisition';
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
      console.log('resp', response.data);
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
  }, [dispatch, router, user?.token]);

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

  const [requisitionItem, setRequisitionItem] = useState<any>({});

  return (
    <div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Requisitions</p>
        <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
                <FaSearch className="text-veriDark" />
              </div>
            </div>
          </div>
          <button className="bg-grey-400 border text-sm p-3 rounded-md">
            Add Filter
          </button>
        </div>
      </div>
      <div>
        <div className="mb-5 flex justify-end">
          <Link
            href="/requisition-history"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            View Requisition History
          </Link>
        </div>
        <RequisitionListTable
          data={requisitions}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
          setOpenDeclineModal={setOpenDeclineModal}
          setRequisitionItem={setRequisitionItem}
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
    </div>
  );
};

export default Page;
