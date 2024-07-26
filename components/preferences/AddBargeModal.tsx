'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import { toggleAddBargeModal } from '@/provider/redux/modalSlice';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
  subscriber_id: number;
}

interface AddBargeModalProps {
  handleClose: () => void;
  fetchData: () => void;
}

const AddBargeModal: React.FC<AddBargeModalProps> = ({
  handleClose,
  fetchData,
}) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);
  const initialState = {
    subscriber_id: user?.subscriber_id || ('' as string | number),
    name: '',
    store_location: '',
    rooms: 1,
    deck_level: 0,
    status: false,
    remark: '',
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        subscriber_id: bargeValues.subscriber_id,
        name: bargeValues.name,
        store_location: bargeValues.store_location,
        rooms: bargeValues.rooms,
        deck_level: bargeValues.deck_level,
        status: bargeValues.status,
        remark: bargeValues.remark,
      });
    }
  }, [bargeValues]);

  const increaseRooms = () =>
    setFormData((prev) => ({ ...prev, rooms: prev.rooms + 1 }));
  const decreaseRooms = () =>
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms > 1 ? prev.rooms - 1 : 0,
    }));

  const increaseDeckLevel = () =>
    setFormData((prev) => ({ ...prev, deck_level: prev.deck_level + 1 }));
  const decreaseDeckLevel = () =>
    setFormData((prev) => ({
      ...prev,
      deck_level: prev.deck_level > 0 ? prev.deck_level - 1 : 0,
    }));

  const isFormValid = formData.name && formData.store_location;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSubmit = {
      ...formData,
      status: formData.status ? 'active' : 'inactive',
    };

    const url =
      Object.keys(bargeValues).length > 0
        ? `${process.env.BASEURL}/barge/${bargeValues.id}`
        : `${process.env.BASEURL}/barge`;

    const method = Object.keys(bargeValues).length > 0 ? 'put' : 'post';

    try {
      const response = await axios({
        method,
        url,
        data: formDataToSubmit,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response?.status == 200) {
        toast.success(
          `Barge ${bargeValues ? 'updated' : 'created'} successfully`
        );
      }
      setFormData(initialState);
      // dispatch(toggleAddBargeModal());
      fetchData();
      handleClose();
      // Handle success (e.g., redirect to another page)
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
      // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
          <div>
            {!user?.subscriber_id && (
              <div className="mb-4">
                <label
                  htmlFor="subscriber"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Subscriber
                </label>
                <select
                  id="subscriber"
                  name="subscriber_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.subscriber_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscriber_id: parseInt(e.target.value),
                    })
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
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Input barge name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="store_location"
                className="block mb-2 text-sm font-medium"
              >
                Stores
              </label>
              <input
                type="number"
                id="store_location"
                placeholder="Input store number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.store_location}
                onChange={(e) =>
                  setFormData({ ...formData, store_location: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="rooms"
                    className="block mb-2 text-sm font-medium"
                  >
                    Rooms
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    placeholder="Input project name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.rooms}
                    min="0"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rooms: parseInt(e.target.value),
                      })
                    }
                  />
                  {/* <div className="flex gap-3 items-center">
                      <button
                        type="button"
                        className="border rounded-md flex justify-center items-center h-[48px] w-[48px]"
                        onClick={decreaseRooms}
                      >
                        <FaMinus />
                      </button>
                      <p>{formData.rooms}</p>
                      <button
                        type="button"
                        className="border rounded-md flex justify-center items-center h-[48px] w-[48px]"
                        onClick={increaseRooms}
                      >
                        <FaPlus />
                      </button>
                    </div> */}
                </div>
                <div>
                  <label
                    htmlFor="deckLevel"
                    className="block mb-2 text-sm font-medium"
                  >
                    Deck Level
                  </label>
                  {/* <div className="flex gap-3 items-center">
                      <button
                        type="button"
                        className="border rounded-md flex justify-center items-center h-[48px] w-[48px]"
                        onClick={decreaseDeckLevel}
                      >
                        <FaMinus />
                      </button>
                      <p>{formData.deck_level}</p>
                      <button
                        type="button"
                        className="border rounded-md flex justify-center items-center h-[48px] w-[48px]"
                        onClick={increaseDeckLevel}
                      >
                        <FaPlus />
                      </button>
                    </div> */}
                  <input
                    type="number"
                    id="part_number"
                    name="part_number"
                    placeholder="Input project name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.deck_level}
                    min="0"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deck_level: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium"
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
              {/* <div className="flex gap-3 items-center h-[50px]">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label htmlFor="status" className="text-sm font-medium">
                    {formData.status ? 'Active' : 'Inactive'}
                  </label>
                </div> */}
            </div>
            <div className="mb-4">
              <label
                htmlFor="remark"
                className="block mb-2 text-sm font-medium"
              >
                Remark
              </label>
              <textarea
                id="remark"
                rows={4}
                placeholder="Input remarks"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.remark}
                onChange={(e) =>
                  setFormData({ ...formData, remark: e.target.value })
                }
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`${
              !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
            } text-white py-3 px-6 rounded-lg text-sm flex items-center justify-center`}
            disabled={!isFormValid || loading}
          >
            {loading
              ? 'Submitting...'
              : Object.keys(bargeValues).length > 0
              ? 'Update Barge'
              : 'Create Barge'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBargeModal;
