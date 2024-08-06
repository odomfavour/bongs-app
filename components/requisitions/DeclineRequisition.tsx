import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
interface Requisition {
  id: number;
  inventoryable_type: string;
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
}

interface ApproveRequisitionProps {
  requisitionItem: RequisitionItem;
  setOpenModal: (isOpen: boolean) => void;
  fetchData: () => void;
}

const DeclineRequisition: React.FC<ApproveRequisitionProps> = ({
  requisitionItem,
  setOpenModal,
  fetchData,
}) => {
  const user = useSelector((state: any) => state.user.user);

  const onDecline = async () => {
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/requisitions/${requisitionItem?.id}/reject`,
        { reason: formData.reason },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('Approve Response:', response);
      if (response.status === 200) {
        toast.success(`${response?.data?.message}`);
      }
      fetchData();
      setOpenModal(false);
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    }
  };
  const [formData, setFormData] = useState({
    reason: '',
  });
  return (
    <div className="text-center">
      <p className="my-6 text-2xl font-semibold">
        Decline Material Requisition
      </p>
      <div className="md:w-2/3 w-11/12 mx-auto ">
        <p className="text-base">
          You&apos;re about to approve the material requisition with Indent No
          MAT_548958. This action cannot be undone.
        </p>
        <textarea
          id="remark"
          rows={4}
          placeholder="Any Reason For Declining? (Optional)"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        ></textarea>
      </div>
      <div className="flex justify-center my-5">
        <div className="flex gap-4">
          <button
            className="rounded-md bg-red-700 text-white py-2 px-4"
            onClick={onDecline}
          >
            Decline
          </button>
          <button
            className="rounded-md border border-blue-700 text-blue-700 py-2 px-4"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineRequisition;
