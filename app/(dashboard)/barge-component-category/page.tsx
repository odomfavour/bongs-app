'use client';
import Loader from '@/components/Loader';
import AddBargeComponentCategoryModal from '@/components/barge-safety/AddBargeComponentCategoryModal';
import BargeComponentCategoryListTable from '@/components/barge-safety/BargeComponentCategoryListTable';
import Modal from '@/components/dashboard/Modal';
import UoMListTable from '@/components/uom/UomListTable';
import {
  toggleBargeComponentModal,
  toggleLoading,
  toggleUomModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface BargeComponent {
  id: number;
  storeNo: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

const BargeComponentPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.user);
  const [loading, setLoading] = useState(false);
  const isBargeComponentModalOpen = useSelector(
    (state: any) => state.modal.isBargeComponentModalOpen
  );
  const [bargeComponents, setBargeComponent] = useState<BargeComponent[]>([]);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);

  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );

  const fetchData = useCallback(async () => {
    try {
      dispatch(toggleLoading(true));
      if (hasPermission('can view barge component category')) {
        const response = await axios.get(
          `${process.env.BASEURL}/getBargeComponentCategories`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setBargeComponent(response?.data?.data?.data);
      }
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, hasPermission, router, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isBargeComponentModalOpen]);
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Barge Equipment Category</p>
        {hasPermission('can create barge component category') && (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => setOpenModal(true)}
          >
            Add Barge Equipment
          </button>
        )}
      </div>
      <div>
        <BargeComponentCategoryListTable
          data={bargeComponents}
          fetchdata={fetchData}
          setOpenModal={setOpenModal}
        />
      </div>

      <Modal
        title={
          Object.keys(bargeValues).length > 0
            ? 'Edit Barge Equipment'
            : 'Add New Barge Equipment'
        }
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="40%"
      >
        <AddBargeComponentCategoryModal
          fetchData={fetchData}
          handleClose={handleClose}
        />
      </Modal>
    </section>
  );
};

export default BargeComponentPage;
