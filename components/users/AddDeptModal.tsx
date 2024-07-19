'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  toggleAddDepartmentModal,
  toggleAddUserModal,
  toggleUomModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
  subscriber_id: number | string;
}

interface AddDeptModalProps {
  subscribers: Subscriber[];
  user: User;
}

const AddDeptModal: React.FC<AddDeptModalProps> = ({ subscribers, user }) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    subscriber_id: user?.subscriber_id || ('' as string | number),
    role_id: '',
    department_name: '',
    department_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        subscriber_id: bargeValues.subscriber_id,
        role_id: bargeValues.role_id,
        department_name: bargeValues.department_name,
        department_description: bargeValues.department_description,
      });
    }
  }, [bargeValues]);

  const fetchData = useCallback(async () => {
    console.log('first call');
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/subscriber-roles/${
          !user?.subscriber_id ? formData.subscriber_id : user?.subscriber_id
        }`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('barge', response);
      // setUsers(usersResponse?.data?.data?.data);
      setRoles(response?.data?.data);
      //   setDeckTypes(deckTypesResponse?.data?.data?.data);
      //   setStoreItems(storeOnBoardResponse?.data?.data?.data);
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
      setLoading(false);
    }
  }, [formData.subscriber_id, user?.subscriber_id, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, formData.subscriber_id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/department/update/${bargeValues.id}`
          : `${process.env.BASEURL}/department/create`;
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
        subscriber_id: user?.subscriber_id || ('' as string | number),
        role_id: '',
        department_name: '',
        department_description: '',
      });
      dispatch(toggleAddDepartmentModal());
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
          <p className="font-bold text-2xl">Add Department</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleAddDepartmentModal())}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {!user?.subscriber_id && (
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
          )}
          <div className="mb-4">
            <label
              htmlFor="user_type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Role
            </label>
            <select
              id="user_type"
              name="user_type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formData.role_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role_id: e.target.value,
                })
              }
            >
              <option value="">Select role</option>
              {roles.map((role: any) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Department Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Input department name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formData.department_name}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  department_name: e.target.value,
                }))
              }
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Description
            </label>
            <textarea
              id="address"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-5000"
              placeholder="Input Project description"
              value={formData.department_description}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  department_description: e.target.value,
                }))
              }
            ></textarea>
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
                ? 'Update Department'
                : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeptModal;
