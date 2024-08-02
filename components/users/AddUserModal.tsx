'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
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

interface AddUserModalProps {
  handleUserClose: () => void;
  fetchData: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  fetchData,
  handleUserClose,
}) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);
  const [formData, setFormData] = useState({
    subscriber_id: user?.subscriber_id || ('' as string | number),
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    is_hod: false,
    is_barge_master: false,
    is_company_rep: false,
    is_authorized_for_release: false,
    role_id: '' as string | number,
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      console.log(bargeValues);
      setFormData({
        subscriber_id: bargeValues?.subscriber_id,
        first_name: bargeValues.first_name,
        last_name: bargeValues.last_name,
        email: bargeValues.email,
        password: bargeValues.password,
        phone_number: bargeValues.phone_number,
        address: bargeValues.address,
        is_hod: bargeValues.is_hod || false,
        is_barge_master: bargeValues.is_barge_master || false,
        is_company_rep: bargeValues.is_company_rep || false,
        is_authorized_for_release:
          bargeValues.is_authorized_for_release || false,
        role_id: bargeValues.roles[0].id,
      });
    }
  }, [bargeValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/user/${bargeValues.id}`
          : `${process.env.BASEURL}/create-user`;
      const method = Object.keys(bargeValues).length > 0 ? 'PATCH' : 'POST';

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
        subscriber_id: user?.subscriber_id,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        address: '',
        is_hod: false,
        is_barge_master: false,
        is_company_rep: false,
        is_authorized_for_release: false,
        role_id: '' as string | number,
      });

      // dispatch(toggleAddUserModal());
      fetchData();
      handleUserClose();
      // Handle success (e.g., close modal, show success message)
    } catch (error: any) {
      console.error('Error:', error);
      console.error('Error data:', error?.response?.data);

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
  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );
  const fetchRolesData = useCallback(async () => {
    console.log('Fetching roles data');
    setLoading(true);
    try {
      const url =
        user?.subscriber_id || formData.subscriber_id
          ? `${process.env.BASEURL}/subscriber-roles/${formData.subscriber_id}`
          : `${process.env.BASEURL}/roles`;
      if (hasPermission('can read user')) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setRoles(
          user?.subscriber_id || formData.subscriber_id
            ? response?.data?.data
            : response?.data?.data?.data
        );
      }
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

  const fetchDepartmentsData = useCallback(async () => {
    console.log('Fetching departments data');
    setLoading(true);
    try {
      if (hasPermission('can read department')) {
        const response = await axios.get(
          `${process.env.BASEURL}/getDepartments`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setDepartments(response?.data?.data?.data);
      }
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
  }, [user?.token, hasPermission]);

  useEffect(() => {
    if (user?.token) {
      fetchRolesData();
      fetchDepartmentsData();
    }
  }, [fetchRolesData, fetchDepartmentsData, user?.token]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          <div>
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
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Input First name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    first_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Input Last name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    last_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="name"
                placeholder="Input Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                id="tel"
                placeholder="Input phone number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    phone_number: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Address
              </label>
              <textarea
                id="address"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-5000"
                placeholder="Input address"
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
                htmlFor="user_type"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Roles
              </label>
              <select
                id="user_type"
                name="user_type"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Role</option>
                {roles?.map((role: any) => (
                  <option value={role.id} key={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="mb-4">
                <label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                >
                  <option value="">Select Department</option>
                  {departments?.map((dept: any) => (
                    <option value={dept.id} key={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div> */}
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="permissions"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Permission
              </label>
              <div className="mb-4 flex items-center">
                <input
                  id="is_hod"
                  type="checkbox"
                  name="is_hod"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={formData.is_hod}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      is_hod: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="is_hod"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Is HOD
                </label>
              </div>

              <div className="mb-4 flex items-center">
                <input
                  id="is_barge_master"
                  type="checkbox"
                  name="is_barge_master"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={formData.is_barge_master}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      is_barge_master: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="is_barge_master"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Is Barge Master
                </label>
              </div>

              <div className="mb-4 flex items-center">
                <input
                  id="is_company_rep"
                  type="checkbox"
                  name="is_company_rep"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={formData.is_company_rep}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      is_company_rep: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="is_company_rep"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Is Company Rep
                </label>
              </div>

              <div className="mb-4 flex items-center">
                <input
                  id="is_authorized_for_release"
                  type="checkbox"
                  name="is_authorized_for_release"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={formData.is_authorized_for_release}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      is_authorized_for_release: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="is_authorized_for_release"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Is Authorized For Release
                </label>
              </div>
            </div>
            {Object.keys(bargeValues).length <= 0 && (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Input password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            )}
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
              ? 'Update User'
              : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserModal;
