import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface CreateMemoProps {
  handleMemoClose: () => void;
  fetchMemoData: () => void;
}

const CreateNewMemo: React.FC<CreateMemoProps> = ({
  fetchMemoData,
  handleMemoClose,
}) => {
  const dispatch = useDispatch();
  const [bidIDS, setBidIDS] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user.user);

  const fetchBids = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement/bid?awarded=true`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setBidIDS(response?.data?.data?.data);
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
  }, [dispatch, user]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const [formData, setFormData] = useState({
    subscriber_id: user?.subscriber_id,
    bid_id: '',
  });

  const createMemo = async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/memo`,
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
      fetchMemoData();
      handleMemoClose();
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
      <p className="text-center font-semibold mb-5">Create New Memo</p>
      <p className="text-center">
        Please select the Bid ID for which you want to create this new memo.
      </p>
      <div className="text-center mt-4">
        <input
          list="bid-id-list"
          placeholder="Start typing Bid ID..."
          className="border rounded p-2"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bid_id: e.target.value }))
          }
        />
        <datalist id="bid-id-list">
          {bidIDS.map((bid: any) => (
            <option key={bid.id} value={bid.id} />
          ))}
        </datalist>
      </div>

      <div className="mt-5">
        <div className="flex">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={createMemo}
          >
            Create
          </button>
          <button
            className="text-red-500 px-4 py-2 rounded-md"
            onClick={handleMemoClose}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewMemo;
