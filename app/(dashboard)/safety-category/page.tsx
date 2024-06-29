'use client';
import Loader from '@/components/Loader';
import SafetyCategoryListTable from '@/components/safety-category/SafetyCategoryListTable';
import {
  displayBargeValue,
  toggleSafetyCategoryModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
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
  const [safetyCat, setSafetyCat] = useState<SafetyCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: any) => state.user.user);
  const isSafetyCategoryModalOpen = useSelector(
    (state: any) => state.modal.isSafetyCategoryModalOpen
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
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
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isSafetyCategoryModalOpen]);

  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Safety Category</p>
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
        <div className="flex justify-end mb-6">
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleSafetyCategoryModal());
            }}
          >
            Add Safety Category
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <SafetyCategoryListTable data={safetyCat} fetchdata={fetchData} />
        )}
      </div>
    </section>
  );
};

export default SafetyCategoryPage;
