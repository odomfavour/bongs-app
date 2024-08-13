'use client';
import UOMTable from '@/components/AppComp/UOMTable';
import Loader from '@/components/Loader';
import Modal from '@/components/dashboard/Modal';
import AddUomModal from '@/components/uom/AddUomModal';
import UoMListTable from '@/components/uom/UomListTable';
import {
  displayBargeValue,
  toggleLoading,
  toggleUomModal,
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

interface Uom {
  id: number;
  name: string;
  unit: string;
  description: string;
  addedBy: string;
  status: string;
  created_at: string;
  user: User;
}

const UomPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [uom, setUom] = useState<Uom[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.user.user);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);

  const isUomModalOpen = useSelector(
    (state: any) => state.modal.isUomModalOpen
  );

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
      if (hasPermission('can view unit of measurement')) {
        const response = await axios.get(`${process.env.BASEURL}/uom`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log('resp', response);
        setUom(response?.data?.data?.data);
      }
      // You can similarly setStoreItems if needed
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
  }, [fetchData, isUomModalOpen]);
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Unit of Measurement</p>
        {hasPermission('can create unit of measurement') && (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              setOpenModal(true);
            }}
          >
            Add UoM
          </button>
        )}
      </div>
      <div>
        <UoMListTable
          data={uom}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
        />
      </div>
      <Modal
        title={Object.keys(bargeValues).length > 0 ? 'Edit UoM' : 'Add New UoM'}
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="40%"
      >
        <AddUomModal fetchData={fetchData} handleClose={handleClose} />
      </Modal>
    </section>
  );
};

export default UomPage;
