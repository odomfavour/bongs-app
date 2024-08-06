import axios from 'axios';
import React from 'react';
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

const ApproveRequisition: React.FC<ApproveRequisitionProps> = ({
  requisitionItem,
  setOpenModal,
  fetchData,
}) => {
  const user = useSelector((state: any) => state.user.user);

  const onApprove = async () => {
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/requisitions/${requisitionItem?.id}/approve`,
        {},
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

  return (
    <div className="text-center">
      <p className="my-6 text-2xl font-semibold">
        Approve Material Requisition
      </p>
      <p className="md:w-2/3 w-11/12 mx-auto text-base">
        You&apos;re about to approve the material requisition with Indent No{' '}
        {requisitionItem?.batch_code}. This action cannot be undone.
      </p>
      <div className="flex justify-center my-5">
        <div className="flex gap-4">
          <button
            className="rounded-md bg-blue-700 text-white py-2 px-4"
            onClick={onApprove}
          >
            Approve
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

export default ApproveRequisition;
