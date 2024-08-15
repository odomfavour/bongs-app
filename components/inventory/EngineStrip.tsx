'use client';
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  displayBargeValue,
  toggleAddEngineModal,
  toggleLoading,
} from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
interface EngineStripProps {
  toggleRequisition: () => void;
  setOpenModal: (isOpen: boolean) => void;
}

const EngineStrip: React.FC<EngineStripProps> = ({
  toggleRequisition,
  setOpenModal,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const handleBulkUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        dispatch(toggleLoading(true));
        const response = await axios.post(
          `${process.env.BASEURL}/sparepart/engine/import`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        console.log('Bulk upload successful:', response.data);
      } catch (error: any) {
        console.error('Bulk upload failed:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          error?.message ||
          'Unknown error';
        toast.error(`${errorMessage}`);
      } finally {
        dispatch(toggleLoading(false));
      }
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <button
          className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-2 px-6 rounded-[30px] text-white bg-[#1455D3]"
          onClick={() => {
            dispatch(displayBargeValue({}));
            setOpenModal(true);
            // dispatch(toggleAddEngineModal('Engine'));
          }}
        >
          Add Engine
        </button>
        <label className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-2 px-6 rounded-[30px] text-white bg-[#1455D3] cursor-pointer">
          Bulk Upload
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleBulkUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default EngineStrip;
