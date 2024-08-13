'use client';
import Loader from '@/components/Loader';
import Modal from '@/components/dashboard/Modal';
import AddSafetyCategoryModal from '@/components/safety-category/AddSafetyCategoryModal';
import SafetyCategoryListTable from '@/components/safety-category/SafetyCategoryListTable';
import {
  displayBargeValue,
  toggleLoading,
  toggleSafetyCategoryModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface User {
  first_name: string;
  last_name: string;
}

interface SafetyCategory {
  id: number;
  name: string;
  safety_number: string;
  description: string;
  addedBy: string;
  status: string;
  user: User;
  created_at: string;
}

const SafetyCategoryPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [safetyCat, setSafetyCat] = useState<SafetyCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.user.user);
  const isSafetyCategoryModalOpen = useSelector(
    (state: any) => state.modal.isSafetyCategoryModalOpen
  );
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);

  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );
  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view safety category')) {
        const response = await axios.get(
          `${process.env.BASEURL}/safety-category`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('resp', response);
        setSafetyCat(response?.data?.data?.data);
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
  }, [fetchData, isSafetyCategoryModalOpen]);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Safety Category</p>
        {hasPermission('can create safety category') && (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              setOpenModal(true);
            }}
          >
            Add Safety Category
          </button>
        )}
      </div>
      <div>
        <SafetyCategoryListTable
          data={safetyCat}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
        />
      </div>
      <Modal
        title={
          Object.keys(bargeValues).length > 0
            ? 'Edit Safety Category'
            : 'Add New Safety Category'
        }
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="50%"
      >
        <AddSafetyCategoryModal
          fetchData={fetchData}
          handleClose={handleClose}
        />
      </Modal>
    </section>
  );
};

export default SafetyCategoryPage;
