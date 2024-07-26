'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import {
  toggleLoading,
  toggleLocationModal,
} from '@/provider/redux/modalSlice';
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

interface AddLocationModalProps {
  handleClose: () => void;
  fetchData: () => void;
}

interface Deck {
  id: string;
  name: string;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  handleClose,
  fetchData,
}) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);
  const [formData, setFormData] = useState({
    subscriber_id: user?.subscriber_id as string | number,
    name: '',
    deck_id: '' as string | number,
    address: '',
    status: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        subscriber_id: bargeValues.subscriber_id,
        name: bargeValues.name,
        status: bargeValues.status === 'active',
        deck_id: bargeValues.deck_id,
        address: bargeValues.address,
      });
    }
  }, [bargeValues]);

  const [decks, setDecks] = useState<Deck[]>([]);
  // const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const fetchDecks = async () => {
      setIsLoading(true);
      try {
        const [bargesResponse, decksResponse] = await Promise.all([
          axios.get(`${process.env.BASEURL}/barge`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }),
          axios.get(`${process.env.BASEURL}/deck`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }),
        ]);

        setDecks(decksResponse?.data?.data?.data);
        // You can similarly setStoreItems if needed
      } catch (error: any) {
        console.error('Error:', error);

        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          error?.message ||
          'Unknown error';
        toast.error(`${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDecks();
  }, [user?.token]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/location/${bargeValues.id}`
          : `${process.env.BASEURL}/location`;
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
      // if (response?.status == 200) {
      toast.success(`${response?.data?.message}`);
      // }
      fetchData();
      handleClose();
      // dispatch(toggleLocationModal());
      // Handle success (e.g., close modal, show success message)
      // dispatch(toggleLocationModal());
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);

      // Handle error (e.g., show error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            Location Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Input location name"
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
        <div className="mb-4">
          <label
            htmlFor="subscriber"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Deck
          </label>
          <select
            id="subscriber"
            name="subscriber_id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={formData.deck_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                deck_id: parseInt(e.target.value),
              })
            }
          >
            <option value="">Select Deck</option>
            {decks?.map((deck: any) => (
              <option value={deck.id} key={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="mb-4">
            <label htmlFor="address" className="block mb-2 text-sm font-medium">
              Address (optional)
            </label>
            <input
              type="text"
              id="address"
              placeholder="Input address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formData.address}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
            />
          </div> */}

        <div className="mb-4">
          <label htmlFor="remark" className="block mb-2 text-sm font-medium">
            Stored Items
          </label>
          <textarea
            id="stored_items"
            rows={4}
            placeholder="Input Stored items"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={formData.address}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                address: e.target.value,
              }))
            }
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-gray-900"
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
            <span className="ms-3 text-sm font-medium text-gray-900">
              {formData.status ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-blue-600 text-white p-3 rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading
              ? 'Submitting...'
              : Object.keys(bargeValues).length > 0
              ? 'Update Location'
              : 'Add Location'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLocationModal;
