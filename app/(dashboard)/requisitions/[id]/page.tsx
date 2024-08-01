'use client';
import Modal from '@/components/dashboard/Modal';
import ApproveRequisition from '@/components/requisitions/ApproveRequisition';
import RequisitionListTable from '@/components/requisitions/RequisitionListTable';
import RequisitionViewListTable from '@/components/requisitions/RequisitionViewTable';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
interface Requisition {
  id: number;
  indent_number: string;
  inventory_type: string;
  requested_by: string;
  created_at: string;
}
const Page = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([
    {
      id: 1,
      indent_number: 'fjfdj',
      inventory_type: 'Mainstore',
      requested_by: 'Amina',
      created_at: '',
    },
  ]);
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
      // setLocations(response?.data?.data?.data);
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
  }, [dispatch, router, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
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
        <RequisitionViewListTable
          data={requisitions}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
        />
      </div>
    </div>
  );
};

export default Page;
