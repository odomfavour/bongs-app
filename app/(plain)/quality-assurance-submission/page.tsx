'use client';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const user = useSelector((state: any) => state.user.user);

  const handleVerification = async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/quality-assurance/verify-access`,
        { access_code: accessToken },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      localStorage.setItem(
        'qaVendoeDetail',
        JSON.stringify(response.data.data)
      );
      if (response.status === 200) {
        router.push('/qa-qc-submission-form');
      }
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  return (
    <div>
      <div className="mx-auto">
        <div className=" ">
          <h2 className="text-2xl text-center text-black  font-bold">QA/QC</h2>

          <p className="text-xl my-6 text-center text-gray-500 ">
            Please enter the unique ID sent to your email to start QA/QC
            submission
          </p>

          <input
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter Unique ID"
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/5 p-3 mx-auto"
          />

          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={handleVerification}
              className="text-white bg-blue-700  w-24 py-2 rounded-xl"
              disabled={!accessToken}
            >
              Continue
            </button>
            {/* <button
           className="bg-white text-blue-700  border border-blue-700 rounded-xl w-24 py-2"
        >Back</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
