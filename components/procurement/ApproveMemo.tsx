import { toggleLoading } from '@/provider/redux/modalSlice';
import { currencyFormatter } from '@/utils/usefulFunc';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ApproveMemoProps {
  selectedMemo: number;
  setOpenModal: (isOpen: boolean) => void;
  fetchData: () => void;
}

const ApproveMemo: React.FC<ApproveMemoProps> = ({
  selectedMemo,
  setOpenModal,
  fetchData,
}) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const user = useSelector((state: any) => state.user.user);
  const [memo, setMemo] = useState<any>({});
  const [reason, setReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false); // New state for tracking rejection
  const [isSignatory, setIsSignatory] = useState(false); // Check if the user is a signatory
  const [hasSigned, setHasSigned] = useState(false); // Check if the user has already signed

  const fetchMemo = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement/memo/${selectedMemo}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('Approve Response:', response);
      const memoData = response?.data?.data;
      setMemo(memoData);
      setTableData(memoData?.signatories);

      // Check if the user is a signatory and if they have signed
      const userSignatory = memoData?.signatories.find(
        (signatory: any) => signatory?.email === user?.email
      );

      if (userSignatory) {
        setIsSignatory(true);
        setHasSigned(userSignatory?.hasSigned);
      }
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [user?.token, user?.email, selectedMemo, dispatch]);

  useEffect(() => {
    fetchMemo();
  }, [fetchMemo]);

  const handleApproveOrReject = async (status: 'approve' | 'reject') => {
    if (status === 'reject' && !reason) {
      toast.error('Please provide a reason for rejection.');
      return;
    }

    dispatch(toggleLoading(true));
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/memo/signatory-approval/${selectedMemo}`,
        {
          id: selectedMemo,
          status,
          rejection_reason: reason || null, // The comment can be null if not provided
        },
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
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p>Request Equipment - Bid - 001A</p>
        <p>23/10/2024</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-5">
        <div>
          <div className="mb-4 flex gap-3">
            <p>Vessel:</p>
            <p>DLB KENNENA</p>
          </div>
          <div className="mb-4 flex gap-3">
            <p>VAT:</p>
            <p>{memo?.bid?.vat}</p>
          </div>
          <div className="mb-4 flex gap-3">
            <p>NCDT:</p>
            <p>{memo?.bid?.ncdf}</p>
          </div>
          <div className="mb-4 flex gap-3">
            <p>WHT:</p>
            <p>{memo?.bid?.wht}</p>
          </div>
        </div>
        <div>
          <div className="mb-4 flex gap-3">
            <p>Project:</p>
            <p>
              {memo?.request_for_quotations?.project?.project_name || 'N/A'}
            </p>
          </div>
          <div className="mb-4 flex gap-3">
            <p>Author:</p>
            <p>
              {memo?.author_by?.first_name} {memo?.author_by?.last_name}
            </p>
          </div>
          <div className="mb-4 flex gap-3">
            <p>Vendor:</p>
            <p>{memo?.bid?.vendor}</p>
          </div>
          <div className="mb-4 flex gap-3">
            <p>Total Sum:</p>
            <p>{currencyFormatter(memo?.bid?.grandTotal)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  S/N
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Signatory
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 &&
                tableData.map((item: any, index) => (
                  <tr key={index}>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item?.name}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item?.role}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item?.hasSigned ? 'Signed' : 'Not Signed'}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {formatDate(item?.updated_at)}
                    </td>
                  </tr>
                ))}
              {tableData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-3 text-center text-gray-500"
                  >
                    No signatories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conditional rendering for the rejection reason */}
      {isRejecting && (
        <div className="my-5">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Please provide a reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}

      {/* Conditionally render Approve and Reject buttons based on signatory status */}
      {isSignatory && !hasSigned && (
        <div className="flex justify-end my-5">
          <div className="flex gap-4">
            <button
              className="rounded-md bg-blue-700 text-white py-2 px-4"
              onClick={() => handleApproveOrReject('approve')}
            >
              Approve
            </button>
            <button
              className="rounded-md bg-red-700 text-white py-2 px-4"
              onClick={() => {
                setIsRejecting(true);
                handleApproveOrReject('reject');
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveMemo;
