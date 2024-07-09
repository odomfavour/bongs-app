'use client';

import { formatDate } from '@/utils/utils';
import Image from 'next/image';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  displayBargeValue,
  toggleSafetyCategoryModal,
} from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface User {
  first_name: string;
  last_name: string;
}

interface SafetyCategory {
  id: number;
  name: string;
  safety_number: string;
  description: string;
  addedBy: string;
  status: string;
  user: User;
  created_at: string;
}

interface SafetyCategoryListTableProps {
  data: SafetyCategory[];
  fetchdata: () => void; // Add a function to refresh the data
}

const SafetyCategoryListTable: React.FC<SafetyCategoryListTableProps> = ({
  data,
  fetchdata,
}) => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
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

  const handleDelete = async (id: number) => {
    // Display SweetAlert confirmation dialog
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this safety category!',
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
          `${process.env.BASEURL}/safety-category/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('Delete Response:', response);
        fetchdata();

        if (response.status === 200) {
          // Handle success
          Swal.fire(
            'Deleted!',
            'Your safety category has been deleted.',
            'success'
          );
        } else {
          // Handle error
          Swal.fire(
            'Failed to delete!',
            'An error occurred while deleting the safety category.',
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (item: SafetyCategory) => {
    dispatch(displayBargeValue(item));
    dispatch(toggleSafetyCategoryModal());
  };
  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-center py-3">Safety No.</th>
              <th className="text-sm text-center py-3">Category Name</th>
              <th className="text-sm text-center py-3">Description</th>
              <th className="text-sm text-center py-3">Added By</th>
              <th className="text-sm text-center py-3">Status</th>
              <th className="text-sm text-center py-3">Created On</th>
              <th className="text-sm text-center py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 &&
              currentItems.map((item, index) => {
                const {
                  id,
                  name,
                  safety_number,
                  description,
                  status,
                  addedBy,
                  created_at,
                  user,
                } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-center">
                      {safety_number}
                      {id}
                    </td>
                    <td className="py-2 text-center">{name}</td>
                    <td className="py-2 text-center">{description}</td>
                    <td className="py-2 text-center">
                      {user?.first_name} {user?.last_name}
                    </td>
                    <td className="py-2 text-center">{status}</td>
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
                  <div className="flex justify-center items-center  min-h-[60vh]">
                    <div>
                      <div className="flex justify-center items-center">
                        <FaRegFolderClosed className="text-4xl" />
                      </div>
                      <div className="mt-5">
                        <p className="font-medium text-[#475467]">
                          No Safety Category found
                        </p>
                        <p className="font-normal text-sm mt-3">
                          Click &apos;add safety category&apos; button to get
                          started in doing your
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
        {data.length > itemsPerPage && (
          <div className="pagination px-5">
            <div className="flex items-center gap-6 text-primary">
              <p
                className={`text-[#9F9F9F] text-base cursor-pointer ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary'
                }`}
                onClick={() => {
                  if (currentPage !== 1) {
                    paginate(currentPage - 1);
                  }
                }}
              >
                Previous page
              </p>
              {Array.from(
                { length: Math.ceil(data.length / itemsPerPage) },
                (_, i) => i + 1
              ).map((pageNumber) => (
                <div
                  key={pageNumber}
                  className={`h-[24px] w-[24px] rounded-full  flex justify-center items-center cursor-pointer ${
                    pageNumber == currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-400'
                  }`}
                  onClick={() => paginate(pageNumber)}
                >
                  <p>{pageNumber}</p>
                </div>
              ))}
              <p
                className={`text-[#4C4C4C] text-base cursor-pointer ${
                  currentPage === Math.ceil(data.length / itemsPerPage)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary'
                }`}
                onClick={() => {
                  if (currentPage !== Math.ceil(data.length / itemsPerPage)) {
                    paginate(currentPage + 1);
                  }
                }}
              >
                Next page
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyCategoryListTable;
