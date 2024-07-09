'use client';

// import { EmptyProductIcon } from '@/utils/utils';
import Image from 'next/image';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { formatDate } from '@/utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  displayBargeValue,
  toggleAddBargeModal,
} from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface User {
  first_name: string;
  last_name: string;
}

interface Barge {
  id: number;
  barge_number: string;
  name: string;
  rooms: number;
  store_location: number;
  deck_level: number;
  addedBy: string;
  created_at: string;
  status: string;
  user: User;
}

interface BargeListTableProps {
  data: Barge[];
  fetchdata: () => void;
}

const BargeListTable: React.FC<BargeListTableProps> = ({ data, fetchdata }) => {
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
  const itemsPerPage = 5;

  // Reverse the data array
  // const reversedData = [...data].reverse();

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setLoadingStates((prevState) => ({ ...prevState, [id]: true }));
      try {
        const response = await axios.delete(
          `${process.env.BASEURL}/barge/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('Delete Response:', response);
        // toast.success(`${response?.data?.message}`);
        fetchdata();

        if (response.status === 200) {
          // Handle success
          Swal.fire('Deleted!', 'Your barge has been deleted.', 'success');
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Delete Error:', error);
        // Handle error
        Swal.fire('Error!', 'There was a problem deleting the barge.', 'error');
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
      }
    }
  };

  const handleEdit = (item: Barge) => {
    dispatch(displayBargeValue(item));
    dispatch(toggleAddBargeModal());
  };

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-center py-3">Barge No</th>
              <th className="text-sm text-center py-3">Name</th>
              <th className="text-sm text-center py-3">Rooms</th>
              <th className="text-sm text-center py-3">Stores</th>
              <th className="text-sm text-center py-3">Deck Level</th>
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
                  barge_number,
                  name,
                  rooms,
                  store_location,
                  deck_level,
                  status,
                  created_at,
                  user,
                } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center text-[#344054]">
                      {index + 1}
                    </td>

                    <td className="py-2 text-center">
                      {barge_number}
                      {id}
                    </td>
                    <td className="py-2 text-center">{name}</td>
                    <td className="py-2 text-center">{rooms}</td>
                    <td className="py-2 text-center">{store_location}</td>
                    <td className="py-2 text-center">{deck_level}</td>
                    <td className="py-2 text-center">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-2 text-center">{status}</td>
                    <td className="py-2 text-center">
                      {formatDate(created_at)}
                    </td>

                    <td className="py-2 text-center flex justify-center items-center">
                      <div className="flex gap-3">
                        {/* <FaExternalLinkAlt title="view" role="button" />
                      <FaPenAlt title="edit" role="button" />
                      <FaTrashAlt
                        title="delete"
                        role="button"
                        className="text-red-600"
                      /> */}
                        <button
                          className="bg-blue-300 text-white p-2 rounded-md"
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
                          No Barge found
                        </p>
                        <p className="font-normal text-sm mt-3">
                          Click “add barge” button to get started in doing your
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

      {/* {data.length > itemsPerPage && (
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
      )} */}
    </div>
  );
};

export default BargeListTable;
