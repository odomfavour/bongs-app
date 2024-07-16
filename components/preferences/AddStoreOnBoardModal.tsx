'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import { toggleStoreOnBoardModal } from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
}

interface Deck {
  id: string;
  name: string;
}

interface AddStoreOnBoardModalProps {
  subscribers: Subscriber[];
  user: User;
}

interface ProjectManager {
  id: number;
  first_name: string;
  last_name: string;
}

interface Project {
  id: number;
  project_name: string;
  project_title: string;
  project_duration: string;
  project_start_date: string;
  project_end_date: string;
  project_manager: ProjectManager;
  created_at: string;
}

const AddStoreOnBoardModal: React.FC<AddStoreOnBoardModalProps> = ({
  subscribers,
  user,
}) => {
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subscriber_id: '' as string | number,
    project_id: '' as string | number,
    description: '',
    deck_id: '' as string | number,
    key: '',
    room_number: '',
    status: false,
    remark: '',
  });

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      console.log('barge', bargeValues);
      setFormData({
        subscriber_id: bargeValues.subscriber_id,
        status: bargeValues.status === 'active',
        project_id: bargeValues.project_id,
        description: bargeValues.description,
        deck_id: bargeValues.deck_id,
        key: bargeValues.key,
        room_number: bargeValues.room_number,

        remark: bargeValues.remark,
      });
    }
  }, [bargeValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
    try {
      setLoading(true);
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/keystore/${bargeValues.id}`
          : `${process.env.BASEURL}/keystore`;
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
      if (response?.status == 201) {
        toast.success(`${response?.data?.message}`);
      }
      setFormData({
        subscriber_id: '' as string | number,
        project_id: '' as string | number,
        description: '',
        deck_id: '' as string | number,
        key: '',
        room_number: '',
        status: false,
        remark: '',
      });
      dispatch(toggleStoreOnBoardModal());
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
  const [decks, setDecks] = useState<Deck[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const fetchDecks = async () => {
      setIsLoading(true);
      try {
        const [projectsResponse, decksResponse] = await Promise.all([
          axios.get(`${process.env.BASEURL}/getProjects`, {
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
        console.log('decks', decksResponse);
        setProjects(projectsResponse?.data?.data?.data);
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

  return (
    <div className="z-50 top-0 min-h-screen bg-[#101010c8] fixed w-full flex justify-center items-center text-veriDark">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="lg:w-3/5 w-11/12 bg-white rounded-[5px] shadow-authModal p-8"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-2xl">Add New Store - on - Board</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleStoreOnBoardModal())}
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
                  htmlFor="project_id"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Project
                </label>
                <select
                  id="project_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.project_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_id: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={0}>Select project</option>
                  {projects?.map((project) => (
                    <option value={project.id} key={project.id}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-5000"
                  placeholder="Write your thoughts here..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="deck_id"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Deck
                </label>
                <select
                  id="deck_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.deck_id}
                  onChange={(e) =>
                    setFormData({ ...formData, deck_id: e.target.value })
                  }
                >
                  <option value="">Select deck</option>
                  {decks?.map((deck) => (
                    <option value={deck.id} key={deck.id}>
                      {deck.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-x-4">
                <div className="mb-4">
                  <label
                    htmlFor="key"
                    className="block mb-2 text-sm font-medium"
                  >
                    Key
                  </label>
                  <input
                    type="text"
                    id="key"
                    placeholder="Input key"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData({ ...formData, key: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="room_number"
                    className="block mb-2 text-sm font-medium"
                  >
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="room_number"
                    placeholder="Input room number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.room_number}
                    onChange={(e) =>
                      setFormData({ ...formData, room_number: e.target.value })
                    }
                  />
                </div>
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
              <div className="mb-4">
                <label
                  htmlFor="remark"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Remarks (optional)
                </label>
                <textarea
                  id="remark"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-5000"
                  placeholder="Input key store description"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
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
                ? 'Update Store'
                : 'Add Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreOnBoardModal;
