import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface CreatePurchaseOrderProps {
  handlePOClose: () => void;
  fetchPOData: () => void;
  poId: number;
}

const CreatePurchaseOrder: React.FC<CreatePurchaseOrderProps> = ({
  fetchPOData,
  handlePOClose,
  poId,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  // const fetchBids = useCallback(async () => {
  //   dispatch(toggleLoading(true));
  //   try {
  //     const response = await axios.get(
  //       `${process.env.BASEURL}/procurement/bid?awarded=true`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user?.token}`,
  //         },
  //       }
  //     );
  //     setBidIDS(response?.data?.data?.data);
  //   } catch (error: any) {
  //     console.error('Error:', error);

  //     const errorMessage =
  //       error?.response?.data?.message ||
  //       error?.response?.data?.errors ||
  //       error?.message ||
  //       'Unknown error';

  //     toast.error(`${errorMessage}`);
  //   } finally {
  //     dispatch(toggleLoading(false));
  //   }
  // }, [dispatch, user]);

  // useEffect(() => {
  //   fetchBids();
  // }, [fetchBids]);

  const [formData, setFormData] = useState({
    subscriber_id: user?.subscriber_id,
    delivery_address: '',
  });

  const createPurchaseOrder = async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.put(
        `${process.env.BASEURL}/procurement/purchase-order/${poId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(`${response?.data?.message}`);
      }
      fetchPOData();
      handlePOClose();
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
      <p className="text-center font-semibold mb-5">
        Create New Purchase Order
      </p>
      <p className="text-center">
        Please select the Purchase ID for which you want to create this new
        purchase order.
      </p>
      <div className="w-1/2 mx-auto">
        <div className="text-center my-4">
          <input
            placeholder="Start typing Bid ID..."
            className="border rounded p-2 w-full"
            value={poId}
            readOnly
          />
          {/* <datalist id="bid-id-list">
            {bidIDS.map((bid: any) => (
              <option key={bid.id} value={bid.id} />
            ))}
          </datalist> */}
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Input Delivery Address"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={formData.delivery_address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                delivery_address: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="mt-5 justify-end flex">
        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={!formData.delivery_address || !poId}
            onClick={createPurchaseOrder}
          >
            Create
          </button>
          <button
            className="text-red-500 border border-red-500 px-4 py-2 rounded-md"
            onClick={handlePOClose}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
