import { formatDate, removePrefix } from '@/utils/utils';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
interface Inventoryable {
  stock_quantity: number;
  threshold: number;
  description: string;
}
interface Requisition {
  id: number;
  inventoryable_type: string;
  inventoryable: Inventoryable;
  quantity: number;
  created_at: string;
}

interface RequestedBy {
  id: number;
  first_name: string;
  last_name: string;
}
interface RequisitionItem {
  id: number;
  indent_number: string;
  batch_code: string;
  requisition: Requisition;
  requested_by: RequestedBy;
  status: string;
  hod_approved_at: string;
  barge_master_approval_at: string;
  company_rep_approved_at: string;
}

interface ViewReleaseItemProps {
  releaseItem: RequisitionItem;
  //   setOpenModal: (isOpen: boolean) => void;
  handleClose: () => void;
}

const ReleaseItemView: React.FC<ViewReleaseItemProps> = ({
  releaseItem,
  handleClose,
}) => {
  console.log('relea', releaseItem);
  return (
    <div className="pb-10">
      <p className="my-6 text-2xl font-semibold text-center">
        Item for Release
      </p>
      <div className="grid grid-cols-3 gap-6">
        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Indent Number
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input category name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={releaseItem?.batch_code}
            readOnly
          />
        </div>
        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Quantity
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input category name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={releaseItem?.requisition.quantity}
            readOnly
          />
        </div>
        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Requisition Date/Time
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input category name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={formatDate(releaseItem?.requisition.created_at)}
            readOnly
          />
        </div>
        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Inventory Type
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input category name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={removePrefix(releaseItem?.requisition.inventoryable_type)}
            readOnly
          />
        </div>

        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Stock Quantity
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input category name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={releaseItem?.requisition?.inventoryable?.stock_quantity}
            readOnly
          />
        </div>
        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Threshold
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input category name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={releaseItem?.requisition?.inventoryable?.threshold}
            readOnly
          />
        </div>
        {releaseItem?.hod_approved_at && (
          <div className="mb-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              HOD Approval Time{' '}
            </label>
            <input
              type="text"
              id="name"
              placeholder="Input category name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formatDate(releaseItem?.hod_approved_at)}
              readOnly
            />
          </div>
        )}
        {releaseItem?.barge_master_approval_at && (
          <div className="mb-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Barge Master Approval Time{' '}
            </label>
            <input
              type="text"
              id="name"
              placeholder="Input category name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formatDate(releaseItem?.barge_master_approval_at)}
              readOnly
            />
          </div>
        )}
        {releaseItem?.company_rep_approved_at && (
          <div className="mb-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Company Rep Approval Time{' '}
            </label>
            <input
              type="text"
              id="name"
              placeholder="Input category name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formatDate(releaseItem?.company_rep_approved_at)}
              readOnly
            />
          </div>
        )}
        <div className="mb-2">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Status
          </label>
          <textarea
            id="description"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Input description"
            value={releaseItem?.status}
            readOnly
          ></textarea>
        </div>
        <div className="mb-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Input description"
            value={releaseItem?.requisition?.inventoryable?.description}
            readOnly
          ></textarea>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex justify-end">
          <button
            className="border border-red-300 text-red-600 py-2 px-5 rounded-md"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>

      {/* <div className=" flex flex-wrap gap-8 items-center text-start">
        <div className="text-center">
          <p className="text-base">Quantity</p>
          <p className="text-sm">{releaseItem?.requisition.quantity}</p>
        </div>
        <div>
          <p className="text-base">Requisition Date/Time</p>
          <p className="text-sm">
            {formatDate(releaseItem?.requisition.created_at)}
          </p>
        </div>
        <div>
          <p className="text-base mb-1">Inventory Type</p>
          <p className="text-sm">
            {removePrefix(releaseItem?.requisition.inventoryable_type)}
          </p>
        </div>
        <div>
          <p className="text-base mb-1">Status</p>
          <button className=" p-2 bg-yellow-300 text-xs rounded-md">
            {releaseItem?.status}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ReleaseItemView;
