'use client';
import {
  displayBargeValue,
  toggleAddEngineModal,
  toggleStoreOnBoardModal,
} from '@/provider/redux/modalSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const HospitalStrip: React.FC = () => {
  const dispatch = useDispatch();
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
              <button className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start">
                PDF
              </button>
              <button className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start">
                Excel
              </button>
              <button className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start">
                CSV
              </button>
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
        <button className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]">
          Bulk Upload
        </button>
      </div>
    </div>
  );
};

export default HospitalStrip;
