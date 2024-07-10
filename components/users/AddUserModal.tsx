'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import {
  toggleAddUserModal,
  toggleUomModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddUserModal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.user);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    permissions: [],
    address: '',
    user_type: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [userTypes, setuserTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        first_name: bargeValues.first_name,
        last_name: bargeValues.last_name,
        email: bargeValues.email,
        password: bargeValues.password,
        phone_number: bargeValues.phone_number,
        permissions: bargeValues.permissions,
        address: bargeValues.address,
        user_type: bargeValues.userType,
        department: bargeValues.department,
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
          : `${process.env.BASEURL}/uom`;
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
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        user_type: '',
        department: '',
        permissions: [],
        address: '',
      });
      dispatch(toggleUomModal());
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
          <p className="font-bold text-2xl">Add User</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleAddUserModal())}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
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
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
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
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
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
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="tel"
                  placeholder="Input deck name"
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
                  htmlFor="user_type"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  User Type
                </label>
                <select
                  id="user_type"
                  name="user_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.user_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user_type: e.target.value,
                    })
                  }
                >
                  <option value="">Select Vendor Category</option>
                  {userTypes.map((userType: any) => (
                    <option value={userType.id} key={userType.id}>
                      {userType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
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
                  <option value="">Select Vendor Category</option>
                  {departments.map((dept: any) => (
                    <option value={dept.id} key={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
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
                  placeholder="Input Project description"
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
                  htmlFor="permissions"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Permission
                </label>
                <div className="flex flex-wrap">
                  <div className="flex items-center me-4">
                    <input
                      id="inline-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-checkbox"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      is HOD
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      id="inline-2-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-2-checkbox"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Is BargeMaster
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      checked
                      id="inline-checked-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-checked-checkbox"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Is Company Rep
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      disabled
                      id="inline-disabled-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-disabled-checkbox"
                      className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                    >
                      Is Authorized to release
                    </label>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default AddUserModal;
