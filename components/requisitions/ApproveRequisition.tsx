import React from 'react';

const ApproveRequisition = () => {
  return (
    <div className="text-center">
      <p className="my-6 text-2xl font-semibold">
        Approve Material Requisition
      </p>
      <p className="md:w-2/3 w-11/12 mx-auto text-base">
        You&apos;re about to approve the material requisition with Indent No
        MAT_548958. This action cannot be undone.
      </p>
      <div className="flex justify-center my-5">
        <div className="flex gap-4">
          <button className="rounded-md bg-blue-700 text-white py-2 px-4">
            Approve
          </button>
          <button className="rounded-md border border-blue-700 text-blue-700 py-2 px-4">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequisition;
