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
      if (hasPermission('can view barge category')) {
        const response = await axios.get(
          `${process.env.BASEURL}/getBargeComponentCategories`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('ree', response);
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
        <p className="text-[32px] font-medium">Barge Equipment</p>
        <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute  flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
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
        <div className="flex justify-end mb-6">
          {hasPermission('can create barge category') && (
            <button
              className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
              onClick={() => setOpenModal(true)}
            >
              Add Barge Equipment
            </button>
          )}
        </div>

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
