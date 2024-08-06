'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import {
  toggleAddInventoryTypeModal,
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
}

interface AddInventoryTypesProps {
  handleClose: () => void;
  fetchData: () => void;
  activeTab: string;
  activeCategory: string;
}

interface Deck {
  id: string;
  name: string;
}

const AddInventoryTypeModal: React.FC<AddInventoryTypesProps> = ({
  handleClose,
  fetchData,
  activeTab,
  activeCategory,
}) => {
  const dispatch = useDispatch();
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  // const inventoryData = useSelector((state: any) => state.modal.inventoryData);
  const [formData, setFormData] = useState({
    name: '',
    status: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        name: bargeValues.name,
        status: bargeValues.status === 'active',
      });
    }
  }, [bargeValues]);

  const [decks, setDecks] = useState<Deck[]>([]);
  // const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const fetchDecks = async () => {
      dispatch(toggleLoading(true));
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
        dispatch(toggleLoading(false));
      }
    };
    fetchDecks();
  }, [dispatch, user?.token]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let baseUrl;
      let createUrlSuffix = '';

      if (activeTab === 'Spare Parts') {
        if (activeCategory === 'engine') {
          baseUrl = `${process.env.BASEURL}/sparepart-engine-category`;
        } else if (activeCategory === 'deck') {
          baseUrl = `${process.env.BASEURL}/sparepart-deck-category`;
        } else if (activeCategory === 'safety') {
          baseUrl = `${process.env.BASEURL}/safety-category`;
        } else {
          baseUrl = `${process.env.BASEURL}/sparepart-hospital-category`;
        }
      } else {
        if (activeCategory === 'engine') {
          baseUrl = `${process.env.BASEURL}/consumable/engineCategory`;
        } else if (activeCategory === 'deck') {
          baseUrl = `${process.env.BASEURL}/consumable/deckCategory`;
        } else if (activeCategory === 'safety') {
          baseUrl = `${process.env.BASEURL}/consumable/safetyCategory`;
        } else if (activeCategory === 'galleylaundry') {
          baseUrl = `${process.env.BASEURL}/consumable/galleylaundryCategory`;
        } else {
          baseUrl = `${process.env.BASEURL}/consumable/hospitalCategory`;
        }
        createUrlSuffix = '/create';
      }

      const method = Object.keys(bargeValues).length > 0 ? 'PUT' : 'POST';
      const url =
        method === 'PUT'
          ? `${baseUrl}/${bargeValues.id}`
          : `${baseUrl}${createUrlSuffix}`;

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
      fetchData();
      handleClose();
      // }
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
      setLoading(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Category Name
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
              ? 'Update Category'
              : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryTypeModal;
