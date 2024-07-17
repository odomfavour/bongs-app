'use client';

import {
  displayBargeValue,
  toggleAddDepartmentModal,
  toggleUomModal,
} from '@/provider/redux/modalSlice';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Role {
  id: number;
  name: string;
  // last_name: string;
  // email: string;
  // role: string;
}
interface Department {
  id: number;
  department_name: string;
  user: User;
  role: Role;
  created_at: string;
}

interface DepartmentListTableProps {
  data: Department[];
  fetchData: () => void;
}

const DepartmentListTable: React.FC<DepartmentListTableProps> = ({
  data,
  fetchData,
}) => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleDropdown = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id: number) => {
    // Display SweetAlert confirmation dialog
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    // If user confirms deletion
    if (confirmResult.isConfirmed) {
      setLoadingStates((prevState) => ({ ...prevState, [id]: true }));
      try {
        const response = await axios.delete(
          `${process.env.BASEURL}/department/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('Delete Response:', response);
        fetchData();

        if (response.status === 200) {
          // Handle success
          Swal.fire('Deleted!', 'Your department has been deleted.', 'success');
        } else {
          // Handle error
          Swal.fire(
            'Failed to delete!',
            'An error occurred while deleting the department.',
            'error'
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
        setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
      }
    }
  };

  const handleEdit = (item: Department) => {
    dispatch(displayBargeValue(item));
    dispatch(toggleAddDepartmentModal());
  };

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-center py-3">Name</th>
              <th className="text-sm text-center py-3">Role</th>
              <th className="text-sm text-center py-3">Created On</th>
              <th className="text-sm text-center py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 &&
              currentItems.map((item, index) => {
                const { id, user, role, department_name, created_at } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-center">{department_name}</td>
                    <td className="py-2 text-center">{role.name}</td>
                    <td className="py-2 text-center">
                      {formatDate(created_at)}
                    </td>

                    <td className="py-2 text-center flex justify-center items-center">
                      <div className="flex gap-3">
                        <button
                          className="bg-blue-700 text-white p-2 rounded-md"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-700 text-white p-2 rounded-md flex items-center justify-center"
                          onClick={() => handleDelete(id)}
                          disabled={loadingStates[id]}
                        >
                          {loadingStates[id] ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            {currentItems.length == 0 && (
              <tr className="text-center text-primary bg-white">
                <td className="py-2 text-center" colSpan={10}>
                  <div className="flex justify-center items-center min-h-[60vh]">
                    <div>
                      <div className="flex justify-center items-center">
                        <FaRegFolderClosed className="text-4xl" />
                      </div>
                      <div className="mt-5">
                        <p className="font-medium text-[#475467]">
                          No Department found
                        </p>
                        <p className="font-normal text-sm mt-3">
                          Click “add Department” button to get started in doing
                          your
                          <br /> first transaction on the platform
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentListTable;
