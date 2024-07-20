'use client';
import Loader from '@/components/Loader';
import UoMListTable from '@/components/uom/UomListTable';
import VendorCategoryListTable from '@/components/vendors/VendorCategoryListTable';
import VendorListTable from '@/components/vendors/VendorListTable';
import {
  displayBargeValue,
  toggleVendorCategoryModal,
  toggleVendorModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface VendorCategory {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

const VendorCategoryPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [vendorCat, setVendorCat] = useState<VendorCategory[]>([]);

  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.user.user);
  const isVendorCategoryModalOpen = useSelector(
    (state: any) => state.modal.isVendorCategoryModalOpen
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/getVendorCategories`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('resp', response);
      setVendorCat(response?.data?.data?.data);
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
      setLoading(false);
    }
  }, [router, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isVendorCategoryModalOpen]);
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Vendor Category</p>
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
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleVendorCategoryModal());
            }}
          >
            Add Vendor Category
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <VendorCategoryListTable data={vendorCat} fetchData={fetchData} />
        )}
      </div>
    </section>
  );
};

export default VendorCategoryPage;
