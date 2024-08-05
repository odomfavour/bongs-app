'use client';

import {
  displayBargeValue,
  toggleLocationModal,
} from '@/provider/redux/modalSlice';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
// import { EmptyProductIcon } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface Requisition {
  id: number;
  inventoryable_type: string;
  quantity: number;
  created_at: string;
}

interface RequestedBy {
  id: number;
  first_name: string;
  last_name: string;
}
interface RequisitionList {
  id: number;
  indent_number: string;
  batch_code: string;
  requisition: Requisition;
  requested_by: RequestedBy;
}

interface RequisitionListTableProps {
  data: RequisitionList[];
  fetchData: () => void;
  setOpenModal: (isOpen: boolean) => void;
  setOpenDeclineModal: (isOpen: boolean) => void;
  setRequisitionItem: (item: RequisitionList) => void;
}

const RequisitionListTable: React.FC<RequisitionListTableProps> = ({
  data,
  fetchData,
  setOpenModal,
  setOpenDeclineModal,
  setRequisitionItem,
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  console.log('current', currentItems);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (item: Location) => {
    dispatch(displayBargeValue(item));
    setOpenModal(true);
    // dispatch(toggleLocationModal());
  };

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this location?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLocation(id);
      }
    });
  };

  const deleteLocation = async (id: number) => {
    try {
      // Send a DELETE request to your API
      const response = await axios.delete(
        `${process.env.BASEURL}/location/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('Delete Response:', response);
      fetchData();

      // Assuming your API returns success or error
      if (response.status === 200) {
        toast.success(`${response?.data?.message}`);
        // Update your local data state or refetch data from the server
        // For example, if data is stored in Redux, dispatch an action to remove the location from the store
        // Or refetch data from the server to update the table
      } else {
        // Handle error, show error message or alert
      }
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
      // Handle error, show error message or alert
    }
  };

  const approveReq = (item: any) => {
    setOpenModal(true);
    setRequisitionItem(item);
  };
  const declineReq = (item: any) => {
    setOpenDeclineModal(true);
    setRequisitionItem(item);
  };

  const removePrefix = (str: string, prefix = 'App\\Models\\') => {
    return str.replace(prefix, '');
  };
  const pathname = usePathname();

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-left py-3">Indent No</th>
              <th className="text-sm text-left py-3">inventory Type</th>
              <th className="text-sm text-left py-3">Requested By</th>

              <th className="text-sm text-left py-3">Requisition Data/Time</th>
              {pathname === '/requisitions' && (
                <th className="text-sm text-left py-3">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems?.length > 0 &&
              currentItems?.map((item, index) => {
                const { id, batch_code, requisition, requested_by } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-left text-sm">{batch_code}</td>
                    <td className="py-2 text-left text-sm">
                      {removePrefix(requisition?.inventoryable_type)}
                    </td>
                    <td className="py-2 text-left text-sm">
                      {requested_by?.first_name} {requested_by?.last_name}
                    </td>

                    <td className="py-2 text-left text-sm">
                      {formatDate(requisition?.created_at)}
                    </td>
                    {pathname === '/requisitions' && (
                      <td className="py-2 text-center flex justify-left text-sm items-center">
                        <div className="flex gap-3">
                          <Link
                            href={`/requisitions/${id}`}
                            className="bg-blue-700 text-white p-2 text-sm rounded-md"
                          >
                            View
                          </Link>
                          <button
                            className="bg-blue-700 text-white p-2 text-sm rounded-md"
                            onClick={() => approveReq(item)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-blue-700 text-white p-2 text-sm rounded-md"
                            onClick={() => declineReq(item)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            {currentItems?.length == 0 && (
              <tr className="text-center text-primary bg-white">
                <td className="py-2 text-center" colSpan={10}>
                  <div className="flex justify-center items-center  min-h-[60vh]">
                    <div>
                      <div className="flex justify-center items-center">
                        <FaRegFolderClosed className="text-4xl" />
                      </div>
                      <div className="mt-5">
                        <p className="font-medium text-[#475467]">
                          No Requisition found
                        </p>
                        {/* <p className="font-normal text-sm mt-3">
                          Click “add location” button to get started in doing
                          your
                          <br /> first transaction on the platform
                        </p> */}
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
              className={`text-[#9F9F9F] text-base cursor-pointer ${
                currentPage === Math.ceil(data.length / itemsPerPage)
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary'
              }`}
              onClick={() => {
                if (
                  currentPage !== Math.ceil(data.length / itemsPerPage)
                ) {
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

export default RequisitionListTable;
