'use client';
import Modal from '@/components/dashboard/Modal';
import AddRequisitions from '@/components/requisitions/AddRequisitions';
import ApproveRequisition from '@/components/requisitions/ApproveRequisition';
import DeclineRequisition from '@/components/requisitions/DeclineRequisition';
import ReleaseItem from '@/components/requisitions/ReleaseItem';
import ReqViewForm from '@/components/requisitions/ReqViewForm';
import RequisitionListTable from '@/components/requisitions/RequisitionListTable';
import RequisitionViewListTable from '@/components/requisitions/RequisitionViewTable';
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
  requisition_type: string;
  created_at: string;
  batch_code: string;
  hod_status: string;
  company_rep_status: string;
  barge_master_status: string;
  status: string;
  requisition: Requisition;
  requested_by: RequestedBy;
}

interface FormData {
  uom_id: number;
  stock_quantity: number | string;
  critical_level: string;
  part_number: string;
  model_number: string;
  description: string;
  type: string;
  remark: string;
  barge_category: string;
  barge_asset: string;
  barge_asset_id: string;
  attachements: File[];
  inventoryable_id: number | null;
}

const Page = () => {
  const [requisitions, setRequisitions] = useState<RequisitionItem[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement-requisition`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

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

  const [requisitionItem, setRequisitionItem] = useState<any>({});
  const [tableData, setTableData] = useState<FormData[]>([]);
  const [openReqModal, setOpenReqModal] = useState(false);
  const handleReqClose = () => {
    setOpenReqModal(false);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Material Requisition</p>
      </div>
      <div>
        <div className="mb-5 flex justify-end">
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={() => setOpenModal(true)}
          >
            New Requisition
          </button>
        </div>
        <RequisitionListTable
          data={requisitions || []}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
          setOpenDeclineModal={() => {}}
          setRequisitionItem={setRequisitionItem}
          setOpenReleaseModal={() => {}}
        />
      </div>
      <Modal title="" isOpen={openModal} onClose={handleClose} maxWidth="60%">
        <AddRequisitions
          handleClose={handleClose}
          fetchData={fetchData}
          setOpenReqModal={setOpenReqModal}
          tableData={tableData}
          setTableData={setTableData}
        />
      </Modal>
      <Modal
        title="Review Material Requisitions"
        isOpen={openReqModal}
        onClose={handleReqClose}
        maxWidth="60%"
      >
        <ReqViewForm
          tableData={tableData}
          handleClose={handleReqClose}
          fetchData={fetchData}
        />
      </Modal>
    </div>
  );
};

export default Page;
