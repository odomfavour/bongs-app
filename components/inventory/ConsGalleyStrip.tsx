'use client';
import {
  displayBargeValue,
  toggleAddConsumeablesModal,
  toggleAddEngineModal,
  toggleLoading,
  toggleStoreOnBoardModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ConsGalleyStripProps {
  toggleRequisition: () => void;
  setOpenModal: (isOpen: boolean) => void;
}

const ConsGalleyStrip: React.FC<ConsGalleyStripProps> = ({
  toggleRequisition,
  setOpenModal,
}) => {
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
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        dispatch(toggleLoading(true));
        const response = await axios.post(
          `${process.env.BASEURL}/consumable/galleylaundry/import`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

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

  const handleExport = async (format: string) => {
    setIsExportOpen(false);
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/consumable/galleylaundry/export`,
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
    } finally {
      dispatch(toggleLoading(false));
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
            // dispatch(toggleAddConsumeablesModal('Galley'));
          }}
        >
          Add Galley Laundry
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

export default ConsGalleyStrip;
