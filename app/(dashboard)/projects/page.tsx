'use client';

import Loader from '@/components/Loader';
import Modal from '@/components/dashboard/Modal';
import AddProjectModal from '@/components/projects/AddProjectModal';
import ProjectsListTable from '@/components/projects/ProjectsTableList';
import {
  displayBargeValue,
  toggleAddProjectModal,
  toggleLoading,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ProjectManager {
  id: number;
  first_name: string;
  last_name: string;
}

interface Projects {
  id: number;
  project_name: string;
  project_title: string;
  project_duration: string;
  project_start_date: string;
  project_end_date: string;
  project_manager: ProjectManager;
  created_at: string;
}

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const isProjectModalOpen = useSelector(
    (state: any) => state.modal.isProjectModalOpen
  );
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Projects[]>([]);

  const hasPermission = (permissionName: string) =>
    user?.permissions?.some(
      (permission: any) => permission.name === permissionName
    );

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(`${process.env.BASEURL}/getProjects`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('resp', response);
      setProjects(response?.data?.data?.data);
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, router, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isProjectModalOpen]);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Projects</p>
        <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute  flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
                <FaSearch className="text-veriDark" />
              </div>
            </div>
          </div>

          <button className="bg-grey-400 border text-sm p-3 rounded-md">
            Add Filter
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-end mb-6">
          {hasPermission('can create projects') && (
            <button
              className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
              onClick={() => {
                dispatch(displayBargeValue({}));
                setOpenModal(true);
              }}
            >
              Add Projects
            </button>
          )}
        </div>

        <ProjectsListTable
          data={projects}
          fetchdata={fetchData}
          setOpenModal={setOpenModal}
        />
      </div>
      <Modal
        title="Add New Project"
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="60%"
      >
        <AddProjectModal fetchData={fetchData} handleClose={handleClose} />
      </Modal>
    </section>
  );
};

export default ProjectsPage;
