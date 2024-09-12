'use client';
import {
  displayBargeValue,
  toggleAddConsumeablesModal,
  toggleAddEngineModal,
  toggleLoading,
  toggleStoreOnBoardModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ConsEngineStripProps {
  toggleRequisition: () => void;
  setOpenModal: (isOpen: boolean) => void;
}

const ConsEngineStrip: React.FC<ConsEngineStripProps> = ({
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
      const formData = new FormData();
      formData.append('file', file);

      try {
        dispatch(toggleLoading(false));
        const response = await axios.post(
          `${process.env.BASEURL}/v1/consumable/engine/import`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        toast.success(response?.data?.message);
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

  const handleExport = async (format: string) => {
    setIsExportOpen(false);
    try {
      dispatch(toggleLoading(true));
      const response = await axios.get(
        `${process.env.BASEURL}/consumable/engine/export`,
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
      toast.success(response?.data?.message);
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
            // dispatch(toggleAddConsumeablesModal('Engine'));
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

export default ConsEngineStrip;
