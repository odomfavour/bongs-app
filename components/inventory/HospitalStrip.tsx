'use client';
import {
  displayBargeValue,
  toggleAddEngineModal,
  toggleStoreOnBoardModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const HospitalStrip: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const toggleActionsDropdown = () => {
    setIsActionsOpen(!isActionsOpen);
    setIsExportOpen(false); // Close the export dropdown if it is open
  };

  const toggleExportDropdown = () => {
    setIsExportOpen(!isExportOpen);
    setIsActionsOpen(false); // Close the actions dropdown if it is open
  };

  const handleBulkUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log('here');
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          'https://bongsapi.dpanalyticsolution.com/api/v1/sparepart/hospital/import',
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
      }
    }
  };

  const handleExport = async (format: string) => {
    setIsExportOpen(false);
    try {
      const response = await axios.get(
        'https://bongsapi.dpanalyticsolution.com/api/v1/sparepart/engine/export',
        {
          params: { format },
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error: any) {
      console.error('Export failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    }
  };
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex">
        <div className="relative inline-block text-left mr-4">
          {/* Actions Dropdown button */}
          <button
            className="text-[#1455D3] px-4 py-2 border border-[#1455D3] rounded-[30px] inline-flex items-center"
            onClick={toggleActionsDropdown}
          >
            Actions
          </button>

          {/* Actions Dropdown content */}
          {isActionsOpen && (
            <div className="origin-top-right rounded-[16px] absolute left-0 -mt-2 w-[150px] py-2 px-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-gray-100 z-30">
              <button className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start">
                Material Requisition
              </button>
              <button className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start">
                Bulk Delete
              </button>
            </div>
          )}
        </div>

        <div className="relative inline-block text-left">
          {/* Export Dropdown button */}
          <button
            className="text-[#1455D3] px-4 py-2 border border-[#1455D3] rounded-[30px] inline-flex items-center"
            onClick={toggleExportDropdown}
          >
            Export
          </button>

          {/* Export Dropdown content */}
          {isExportOpen && (
            <div className="origin-top-right rounded-[16px] absolute left-0 -mt-2 w-[150px] py-2 px-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-gray-100 z-30">
              {/* <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('pdf')}
              >
                PDF
              </button> */}
              <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('xlsx')}
              >
                Excel
              </button>
              {/* <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('csv')}
              >
                CSV
              </button> */}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
          onClick={() => {
            dispatch(displayBargeValue({}));
            dispatch(toggleAddEngineModal('Hospital'));
          }}
        >
          Add Hospital
        </button>
        <label className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3] cursor-pointer">
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

export default HospitalStrip;
