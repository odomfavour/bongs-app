'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import {
  toggleAddPermissionModal,
  toggleAddRoleModal,
  toggleAddUserModal,
  toggleUomModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSubscriberIdFromUrl } from '@/utils/utils';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
  subscriber_id: number;
}

interface AddRoleModalProps {
  subscribers: Subscriber[];
  user: User;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ subscribers, user }) => {
  const dispatch = useDispatch();

  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    name: '',
    subscriber_id: user?.subscriber_id || ('' as string | number),
  });
  const [loading, setLoading] = useState(false);
  const [userTypes, setuserTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        name: bargeValues.name,
        subscriber_id: bargeValues.subscriberId,
      });
    }
  }, [bargeValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/uom/${bargeValues.id}`
          : `${process.env.BASEURL}/roles`;
      const method = Object.keys(bargeValues).length > 0 ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: {
          ...formData,
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('Response:', response);

      toast.success(`${response?.data?.message}`);

      setFormData({
        name: '',
        subscriber_id: user?.subscriber_id,
      });
      dispatch(toggleAddRoleModal());
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
    <div className="z-50 top-0 min-h-screen bg-[#101010c8] fixed w-full flex justify-center items-center text-veriDark">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="lg:w-3/5 w-11/12 bg-white rounded-[5px] shadow-authModal p-8"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-2xl">Add Role</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleAddRoleModal())}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {!user.subscriber_id && (
            <div className="mb-4">
              <label
                htmlFor="subscriber"
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
                {subscribers.map((subscriber: any) => (
                  <option value={subscriber.id} key={subscriber.id}>
                    {subscriber.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Role Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Input Role name"
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
                ? 'Update Role'
                : 'Add Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
