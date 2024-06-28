'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useState, FormEvent, useEffect } from 'react';
import { toggleAddDeckModal } from '@/provider/redux/modalSlice';
import axios from 'axios';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
}

interface AddDeckModalProps {
  subscribers: Subscriber[];
  user: User;
}

const AddDeckModal: React.FC<AddDeckModalProps> = ({ subscribers, user }) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);

  const [formData, setFormData] = useState({
    subscriber_id: '' as string | number,
    barge_id: '',
    deck_type: '',
    name: '',
    status: false,
    remark: '',
  });
  const [barges, setBarges] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        subscriber_id: bargeValues.subscriber_id,
        barge_id: bargeValues.barge_id,
        deck_type: bargeValues.deck_type,
        name: bargeValues.name,
        status: bargeValues.status === 'active',
        remark: bargeValues.remark,
      });
    }
  }, [bargeValues]);

  useEffect(() => {
    const getBarges = async () => {
      try {
        const response = await axios.get(`${process.env.BASEURL}/barge`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setBarges(response?.data?.data?.data);
      } catch (error) {
        console.error('Error fetching barges:', error);
      } finally {
        setLoading(false);
      }
    };
    getBarges();
  }, [user?.token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/deck/${bargeValues.id}`
          : `${process.env.BASEURL}/deck`;
      const method = Object.keys(bargeValues).length > 0 ? 'PUT' : 'POST';
      const response = await axios({
        method,
        url,
        data: {
          ...formData,
          status: formData.status ? 'active' : 'inactive',
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log('Response:', response);

      // Handle success (e.g., close modal, show success message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-50 top-0 min-h-screen bg-[#101010c8] fixed w-full flex justify-center items-center text-veriDark">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="lg:w-3/5 w-11/12 bg-white rounded-[5px] shadow-authModal p-8"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-2xl">
            {Object.keys(bargeValues).length > 0 ? 'Edit Deck' : 'Add New Deck'}
          </p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleAddDeckModal())}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="deck_type"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Subscriber
                </label>
                <select
                  id="subscriber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.subscriber_id}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      subscriber_id: parseInt(e.target.value),
                    }))
                  }
                >
                  <option value="">Select Subscriber</option>
                  {subscribers?.map((subscriber: any) => (
                    <option value={subscriber.id} key={subscriber.id}>
                      {subscriber.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="barge"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Barge
                </label>
                <select
                  id="barge"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.barge_id}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      barge_id: e.target.value,
                    }))
                  }
                >
                  <option value="">Select barge</option>
                  {barges?.map((barge: any) => (
                    <option value={barge.id} key={barge.id}>
                      {barge.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Deck Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Input deck name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Status
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.status}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        status: e.target.checked,
                      }))
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 ">
                    {formData.status ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="remarks"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Remarks (optional)
                </label>
                <textarea
                  id="remarks"
                  rows={4}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      remark: e.target.value,
                    }))
                  }
                  placeholder="Input remarks"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 text-white bg-blue-600 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              {loading
                ? 'Submitting...'
                : Object.keys(bargeValues).length > 0
                ? 'Update Deck'
                : 'Add Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeckModal;
