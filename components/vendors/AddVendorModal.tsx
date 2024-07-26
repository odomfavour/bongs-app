'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  toggleVendorCategoryModal,
  toggleVendorModal,
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

interface VendorCategory {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

interface AddVendorModalProps {
  handleClose: () => void;
  fetchData: () => void;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({
  handleClose,
  fetchData,
}) => {
  const dispatch = useDispatch();
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_website: '',
    vendor_country: '',
    vendor_category_id: '',
    vendor_phone_number: '',
    vendor_founded_at: '',
    vendor_email: '',
    vendor_description: '',
    vendor_address: '',
    subscriber_id: user?.subscriber_id || ('' as string | number),
    status: false,
  });
  const [vendorCats, setVendorCats] = useState<VendorCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchVendorCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/getVendorCategories`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('resp', response);
      setVendorCats(response?.data?.data?.data);
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
  }, [user?.token]);
  useEffect(() => {
    fetchVendorCategories();
  }, [fetchVendorCategories]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        vendor_name: bargeValues.vendor_name,
        vendor_website: bargeValues.vendor_website,
        vendor_country: bargeValues.vendor_country,
        vendor_category_id: bargeValues.vendor_category,
        vendor_phone_number: bargeValues.vendor_phone_number,
        vendor_founded_at: bargeValues.vendor_founded_at,
        vendor_email: bargeValues.vendor_email,
        vendor_description: bargeValues.vendor_description,
        vendor_address: bargeValues.vendor_address,
        subscriber_id: bargeValues.subscriber_id,
        status: bargeValues.status === 'active',
      });
    }
  }, [bargeValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/vendor/update/${bargeValues.id}`
          : `${process.env.BASEURL}/vendor/create`;
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
      if (response?.status == 200) {
        toast.success(`${response?.data?.message}`);
      }
      setFormData({
        vendor_name: '',
        vendor_website: '',
        vendor_country: '',
        vendor_category_id: '',
        vendor_phone_number: '',
        vendor_founded_at: '',
        vendor_email: '',
        vendor_description: '',
        vendor_address: '',
        subscriber_id: user?.subscriber_id as string | number,
        status: false,
      });
      fetchData();
      handleClose();
      // Handle success (e.g., close modal, show success message)
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
        <div className="grid grid-cols-3 gap-5">
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
              <label
                htmlFor="vendor_category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Vendor Category
              </label>
              <select
                id="vendor_category"
                name="vendor_category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vendor_category_id: e.target.value,
                  })
                }
              >
                <option value="">Select Vendor Category</option>
                {vendorCats.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendor_name"
                className="block mb-2 text-sm font-medium"
              >
                Company Name
              </label>
              <input
                type="text"
                id="vendor_name"
                name="vendor_name"
                placeholder="Input company name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_name}
                onChange={(e) =>
                  setFormData({ ...formData, vendor_name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendor_email"
                className="block mb-2 text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="vendor_email"
                name="vendor_email"
                placeholder="Input email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_email}
                onChange={(e) =>
                  setFormData({ ...formData, vendor_email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendor_phone_number"
                className="block mb-2 text-sm font-medium"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="vendor_phone_number"
                name="vendor_phone_number"
                placeholder="Input phone number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_phone_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vendor_phone_number: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="vendor_website"
                className="block mb-2 text-sm font-medium"
              >
                Website (Optional)
              </label>
              <input
                type="url"
                id="vendor_website"
                name="vendor_website"
                placeholder="Input website"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_website}
                onChange={(e) =>
                  setFormData({ ...formData, vendor_website: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendor_country"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Country
              </label>
              <select
                id="vendor_country"
                name="vendor_country"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_country}
                onChange={(e) =>
                  setFormData({ ...formData, vendor_country: e.target.value })
                }
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendor_founded_at"
                className="block mb-2 text-sm font-medium"
              >
                Year Founded (Optional)
              </label>
              <input
                type="date"
                id="vendor_founded_at"
                name="vendor_founded_at"
                placeholder="Input year founded"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_founded_at}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vendor_founded_at: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="vendor_address"
                className="block mb-2 text-sm font-medium"
              >
                Address
              </label>
              <input
                type="text"
                id="vendor_address"
                name="vendor_address"
                placeholder="Input address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_address}
                onChange={(e) =>
                  setFormData({ ...formData, vendor_address: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="vendor_description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                id="vendor_description"
                name="vendor_description"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Input Description"
                value={formData.vendor_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vendor_description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            {/* <div className="mb-4">
                <label
                  htmlFor="vendor_status"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Status
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    name="vendor_status"
                    checked={formData.vendor_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor_status: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Active
                  </span>
                </label>
              </div> */}
          </div>
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
                value=""
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
              ? 'Update Vendor Category'
              : 'Add Vendor Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVendorModal;
