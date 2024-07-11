'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import {
  toggleAddDepartmentModal,
  toggleAddUserModal,
  toggleUomModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddDeptModal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.user);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    dept_head: '',
    dept_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [userTypes, setuserTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        dept_head: bargeValues.dept_head,
        dept_name: bargeValues.dept_name,
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
        dept_head: '',
        dept_name: '',
        description: '',
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
          <p className="font-bold text-2xl">Add Department</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleAddDepartmentModal())}
          />
        </div>

        <form onSubmit={handleSubmit}>
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
              value={formData.dept_head}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dept_head: e.target.value,
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
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Department Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Input department name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={formData.dept_name}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  dept_name: e.target.value,
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
              value={formData.description}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  description: e.target.value,
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
