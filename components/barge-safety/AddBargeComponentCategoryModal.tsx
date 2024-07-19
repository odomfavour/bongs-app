'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useState, FormEvent, useEffect } from 'react';
import { toggleBargeComponentModal } from '@/provider/redux/modalSlice';
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

interface AddBargeComponentCategoryModalProps {
  subscribers: Subscriber[];
  user: User;
}

const AddBargeComponentCategoryModal: React.FC<
  AddBargeComponentCategoryModalProps
> = ({ subscribers, user }) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    subscriber_id: user?.subscriber_id || ('' as string | number),
    name: '',
    description: '',
    status: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        subscriber_id: bargeValues.subscriber_id,
        name: bargeValues.name,
        status: bargeValues.status === 'active',
        description: bargeValues.description,
      });
    }
  }, [bargeValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/BargeComponentCategory/update/${bargeValues.id}`
          : `${process.env.BASEURL}/BargeComponentCategory/create`;
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
      dispatch(toggleBargeComponentModal());
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
    <div className="z-50 top-0 min-h-screen bg-[#101010c8] fixed w-full flex justify-center items-center text-veriDark">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="lg:w-3/5 w-11/12 bg-white rounded-[5px] shadow-authModal p-8"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-2xl">Add New Barge Equipment</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleBargeComponentModal())}
          />
        </div>

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
                {subscribers?.map((subscriber) => (
                  <option value={subscriber.id} key={subscriber.id}>
                    {subscriber.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Input category name"
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
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Input category description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  description: e.target.value,
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
                name="status"
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
                ? `Update Barge Equipment`
                : `Add Barge Equipment`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBargeComponentCategoryModal;
