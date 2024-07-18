'use client';
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  displayBargeValue,
  toggleAddEngineModal,
} from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const EngineStrip: React.FC = () => {
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

  const actionsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionsRef.current &&
      !actionsRef.current.contains(event.target as Node)
    ) {
      setIsActionsOpen(false);
    }
    if (
      exportRef.current &&
      !exportRef.current.contains(event.target as Node)
    ) {
      setIsExportOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBulkUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('file', file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(
          'https://bongsapi.dpanalyticsolution.com/api/v1/sparepart/engine/import',
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
      const response = await fetch(
        `https://bongsapi.dpanalyticsolution.com/api/v1/sparepart/engine/export?format=${format}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
            // Add any other required headers here
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
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
        <div ref={actionsRef} className="relative inline-block text-left mr-4">
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

        <div ref={exportRef} className="relative inline-block text-left">
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
            dispatch(toggleAddEngineModal('Engine'));
          }}
        >
          Add Engine
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

export default EngineStrip;
