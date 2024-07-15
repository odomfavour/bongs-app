'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import { toggleAddProjectModal } from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
}

interface AddProjectModalProps {
  subscribers: Subscriber[];
  user: User;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  subscribers,
  user,
}) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [formData, setFormData] = useState({
    project_name: '',
    project_title: '',
    project_description: '',
    project_duration: '',
    project_start_date: '',
    project_end_date: '',
    subscriber_id: '' as string | number,
    project_manager_id: '' as string | number,
  });

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        project_name: bargeValues.project_name,
        project_title: bargeValues.project_title,
        project_description: bargeValues.project_description,
        project_duration: bargeValues.project_duration,
        project_start_date: bargeValues.project_start_date,
        project_end_date: bargeValues.project_end_date,
        subscriber_id: bargeValues.subscriber_id,
        project_manager_id: bargeValues.project_manager_id,
      });
    }
  }, [bargeValues]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    try {
      setLoading(true);
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/project/update/${bargeValues.id}`
          : `${process.env.BASEURL}/project/create`;
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
        project_name: '',
        project_title: '',
        project_description: '',
        project_duration: '',
        project_start_date: '',
        project_end_date: '',
        subscriber_id: '',
        project_manager_id: '',
      });
      dispatch(toggleAddProjectModal());
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
          <p className="font-bold text-2xl">Add New Project</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleAddProjectModal())}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <div>
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
              <div className="mb-4">
                <label
                  htmlFor="project_name"
                  className="block mb-2 text-sm font-medium"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  placeholder="Input project name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.project_name}
                  onChange={(e) =>
                    setFormData({ ...formData, project_name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project_title"
                  className="block mb-2 text-sm font-medium"
                >
                  Project Title
                </label>
                <input
                  type="text"
                  id="project_title"
                  name="project_title"
                  placeholder="Input project title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.project_title}
                  onChange={(e) =>
                    setFormData({ ...formData, project_title: e.target.value })
                  }
                />
              </div>
              {/* <div className="mb-4">
                <label
                  htmlFor="project_duration"
                  className="block mb-2 text-sm font-medium"
                >
                  Project Duration
                </label>
                <input
                  type="text"
                  id="project_duration"
                  name="project_duration"
                  placeholder="Input project duration"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.project_duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_duration: e.target.value,
                    })
                  }
                />
              </div> */}
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-4">
                  <label
                    htmlFor="project_start_date"
                    className="block mb-2 text-sm font-medium"
                  >
                    Project Start Date
                  </label>
                  <input
                    type="date"
                    id="project_start_date"
                    name="project_start_date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.project_start_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project_start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="project_end_date"
                    className="block mb-2 text-sm font-medium"
                  >
                    Project End Date
                  </label>
                  <input
                    type="date"
                    id="project_end_date"
                    name="project_end_date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.project_end_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project_end_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project_manager_id"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Project Manager
                </label>
                <select
                  id="project_manager_id"
                  name="project_manager_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.project_manager_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_manager_id: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Select project manager</option>
                  <option value="1">Manager 1</option>
                  <option value="2">Manager 2</option>
                  <option value="3">Manager 3</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="project_description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Project Description
                </label>
                <textarea
                  id="project_description"
                  name="project_description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Input project description"
                  value={formData.project_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_description: e.target.value,
                    })
                  }
                ></textarea>
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
                ? 'Update Project'
                : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
