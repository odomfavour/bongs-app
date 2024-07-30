import React, { useState } from 'react';

const ApproveRequisition = () => {
  const [formData, setFormData] = useState({
    reason: '',
  });
  return (
    <div className="text-center">
      <p className="my-6 text-2xl font-semibold">
        Decline Material Requisition
      </p>
      <p className="md:w-2/3 w-11/12 mx-auto text-base">
        You&apos;re about to approve the material requisition with Indent No
        MAT_548958. This action cannot be undone.
      </p>
      <textarea
        id="remark"
        rows={4}
        placeholder="Input remarks"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
      ></textarea>
      <div className="flex justify-center my-5">
        <div className="flex gap-4">
          <button className="rounded-md bg-red-700 text-white py-2 px-4">
            Decline
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
