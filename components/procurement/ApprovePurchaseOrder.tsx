import { toggleLoading } from '@/provider/redux/modalSlice';
import { currencyFormatter } from '@/utils/usefulFunc';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ApprovePOProps {
  selectedPO: number;
  setOpenApprovePO: (isOpen: boolean) => void;
  fetchPOData: () => void;
}

const ApprovePurchaseOrder: React.FC<ApprovePOProps> = ({
  selectedPO,
  setOpenApprovePO,
  fetchPOData,
}) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const user = useSelector((state: any) => state.user.user);
  const [po, setPO] = useState<any>({});
  const [comment, setComment] = useState('');
  const [isRejecting, setIsRejecting] = useState(false); // New state for tracking rejection
  const [isSignatory, setIsSignatory] = useState(false); // Check if the user is a signatory
  const [hasSigned, setHasSigned] = useState(false); // Check if the user has already signed

  const fetchPO = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement/purchase-order/${selectedPO}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('Approve Response:', response);
      const purchaseOrdeData = response?.data?.data;
      setPO(purchaseOrdeData);
      setTableData(purchaseOrdeData?.bid?.bid_items);

      // Check if the user is a signatory and if they have signed
      //   const userSignatory = memoData?.signatories.find(
      //     (signatory: any) => signatory?.email === user?.email
      //   );

      //   if (userSignatory) {
      //     setIsSignatory(true);
      //     setHasSigned(userSignatory?.hasSigned);
      //   }
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
  }, [user, selectedPO, dispatch]);

  useEffect(() => {
    fetchPO();
  }, [fetchPO]);

  const handleApproveOrReject = async (status: 'approved' | 'pending') => {
    if (status === 'pending' && !comment) {
      toast.error('Please provide a reason for rejection.');
      return;
    }

    dispatch(toggleLoading(true));
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/purchase-order/approval/${selectedPO}`,
        {
          id: selectedPO,
          status,
          comment: comment || null, // The comment can be null if not provided
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
      fetchPOData();
      setOpenApprovePO(false);
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

  const sendPurchaseOrder = async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/purchase-order/${selectedPO}`,
        {
          id: selectedPO,
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
      fetchPOData();
      setOpenApprovePO(false);
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
        <p>Purchase of Equipment - PO - {selectedPO}</p>
        <p>23/10/2024</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-5">
        <div>
          <p>Vendor</p>
          <p>{po?.bid?.vendor}</p>
        </div>
        <div>
          <p>Delivery Address</p>
          <p>{po?.delivery_address || 'N/A'}</p>
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
                  Product Details
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  UOM
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Unit Price (&#8358;)
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (&#8358;)
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
                      {item?.quantity}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item?.unit_of_measurement || 'nil'}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item?.unit_price || 0}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item?.unit_price * item?.quantity || 0}
                    </td>
                  </tr>
                ))}

              {tableData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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

      <div className="mt-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="">
            <div className="flex gap-2">
              <p>Payment Terms: </p>
              <p>{po?.bid?.payment_term}% Advance</p>
            </div>
            <div className="flex gap-2">
              <p>Buyer:</p>
              <p>
                {po?.memo?.author_by?.first_name}{' '}
                {po?.memo?.author_by?.last_name}
              </p>
            </div>
          </div>

          <div className="">
            <div className="flex gap-2">
              <p>Subtotal: </p>
              <p>
                {po?.bid?.currency} {po?.bid?.cost}
              </p>
            </div>
            <div className="flex gap-2">
              <p>VAT:</p>
              <p>{po?.bid?.vat}%</p>
            </div>
            <div className="flex gap-2">
              <p>NCDT:</p>
              <p>{po?.bid?.ncdf}%</p>
            </div>
            <div className="flex gap-2">
              <p>WHT:</p>
              <p>{po?.bid?.wht}%</p>
            </div>
            <div className="flex gap-2">
              <p>Total Amount:</p>
              <p>
                {po?.bid?.currency} {currencyFormatter(po?.bid?.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional rendering for the rejection reason */}
      {isRejecting && (
        <div className="my-5">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Please provide a reason for rejection..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      )}

      {/* Conditionally render Approve and Reject buttons based on signatory status */}
      {/* {isSignatory && !hasSigned && ( */}
      <div className="flex justify-end my-5">
        <div className="flex gap-4">
          <button
            className={`rounded-md ${
              po.is_sent ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
            } py-2 px-4`}
            onClick={sendPurchaseOrder}
          >
            {po?.is_sent ? 'Resend' : 'Send'}
          </button>
          {/* <button
              className="rounded-md bg-red-700 text-white py-2 px-4"
              onClick={() => {
                setIsRejecting(true);
                handleApproveOrReject('pending');
              }}
            >
              Reject
            </button> */}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default ApprovePurchaseOrder;
