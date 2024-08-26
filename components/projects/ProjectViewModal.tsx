import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ProjectViewModalProps {
  project: any;
  //   setOpenModal: (isOpen: boolean) => void;
  //   fetchData: () => void;
}

const ProjectViewModal: React.FC<ProjectViewModalProps> = ({ project }) => {
  console.log('project', project);
  return (
    <div>
      <p className="text-sm mb-2">
        <span className="font-bold">Project Name:</span>
        {project?.project_name}
      </p>
      <p className="text-sm mb-2">
        <span className="font-bold">Project Title:</span>
        {project?.project_title}
      </p>
      <p className="text-sm">
        <span className="font-bold">Project Duration:</span>
        {project?.project_duration}
      </p>
      <p className="text-sm">
        <span className="font-bold">Project Start Date:</span>
        {project?.project_start_date}
      </p>
      <p className="text-sm">
        <span className="font-bold">Project End Date:</span>
        {project?.project_end_date}
      </p>
      <p className="text-sm">
        <span className="font-bold">Project Status:</span>
        {project?.status}
      </p>
    </div>
  );
};

export default ProjectViewModal;
