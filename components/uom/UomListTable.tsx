'use client';

import { displayBargeValue, toggleUomModal } from '@/provider/redux/modalSlice';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface User {
  first_name: string;
  last_name: string;
}

interface Uom {
  id: number;
  name: string;
  unit: string;
  description: string;
  addedBy: string;
  status: string;
  created_at: string;
  user: User;
}

interface UoMListTableProps {
  data: Uom[];
  fetchData: () => void;
}

const UoMListTable: React.FC<UoMListTableProps> = ({ data, fetchData }) => {
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
  const itemsPerPage = 10;

  const reversedData = [...data].reverse();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reversedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const deleteUom = async (id: number) => {
    setLoadingStates((prevState) => ({ ...prevState, [id]: true }));
    try {
      const response = await axios.delete(`${process.env.BASEURL}/uom/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('Delete Response:', response);
      fetchData();

      if (response.status === 200) {
        // Handle success
      } else {
        // Handle error
      }
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
      // Handle error
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  const handleEdit = (item: Uom) => {
    dispatch(displayBargeValue(item));
    dispatch(toggleUomModal());
  };

  return (
    <div className="bg-white">
      <table className="table-auto w-full text-primary rounded-2xl mb-5">
        <thead>
          <tr className="border-b bg-[#E9EDF4]">
            <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
            <th className="text-sm text-center py-3">UoM Name</th>
            <th className="text-sm text-center py-3">Unit No</th>
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
                unit,
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
                  <td className="py-2 text-center">{name}</td>
                  <td className="py-2 text-center">{unit}</td>
                  <td className="py-2 text-center">{description}</td>
                  <td className="py-2 text-center">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-2 text-center">{status}</td>
                  <td className="py-2 text-center">{formatDate(created_at)}</td>
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
                        onClick={() => deleteUom(id)}
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
                        No Unit of Measurement found
                      </p>
                      <p className="font-normal text-sm mt-3">
                        Click “add deck” button to get started in doing your
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
  );
};

export default UoMListTable;
