'use client';

import {
  displayBargeValue,
  toggleAddConsumeablesModal,
  toggleAddEngineModal,
  toggleBargeComponentModal,
  toggleLoading,
} from '@/provider/redux/modalSlice';
import { calculateCountdown, formatDate } from '@/utils/utils';
import axios from 'axios';
// import { EmptyProductIcon } from '@/utils/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface Deck {
  name: string;
  deck_number: string;
  deck_type: string;
}

interface Location {
  id: number;
  name: string;
  location_number: string;
  address: string;
  deck_id: string;
  status: string;
  created_at: string;
}

interface BargeComponent {
  id: number;
  storeNo: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}
interface User {
  first_name: string;
  last_name: string;
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

interface SparePart {
  id: number;
  project: Project;
  description: string;
  quantity: number;
  part_number: string;
  model_grade: string;
  threshold: number;
  location: Location;
  warranty_days: string;
  subscriber_id: number;
  project_id: number;
  deck_id: number;
  keystore_id: number;
  uom_id: number;
  location_id: number;
  vendor_id: number;
  safety_category_id: 0;
  barge_equipment_id: 0;
  stock_quantity: number;
  critical_level: string;
  date_acquired: string;
  waranty_period: string;
  status: string;
  remark: string;
  user: User;
}

interface ConsumablesListTableProps {
  data: SparePart[];
  fetchdata: () => void;
  parent: string;
  requisition: boolean;
  setOpenModal: (isOpen: boolean) => void;
  toggleRequisition: () => void;
}

const ConsumablesableList: React.FC<ConsumablesListTableProps> = ({
  data,
  fetchdata,
  parent,
  requisition,
  setOpenModal,
  toggleRequisition,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
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
  // const currentItems = [];
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (ids: number[]) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover these items!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!',
    });

    if (confirmResult.isConfirmed) {
      const newLoadingStates = ids.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as { [key: number]: boolean });

      setLoadingStates((prevState) => ({ ...prevState, ...newLoadingStates }));

      try {
        const response = await axios.post(
          `${process.env.BASEURL}/consumable/${
            parent === 'Engine'
              ? 'engine'
              : parent === 'Deck'
              ? 'deck'
              : parent === 'Safety'
              ? 'safety'
              : parent === 'Hospital'
              ? 'hospital'
              : 'galleylaundry'
          }/bulk-delete`,
          { ids }, // Send the IDs in the request body
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        console.log('Delete Response:', response);
        fetchdata();
        setOpenModal(false);
        Swal.fire('Deleted!', 'Your items have been deleted.', 'success');
      } catch (error: any) {
        console.error('Error:', error);

        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          error?.message ||
          'Unknown error';
        toast.error(`${errorMessage}`);
      } finally {
        const resetLoadingStates = ids.reduce((acc, id) => {
          acc[id] = false;
          return acc;
        }, {} as { [key: number]: boolean });

        setLoadingStates((prevState) => ({
          ...prevState,
          ...resetLoadingStates,
        }));
        setSelectedItems([]);
      }
    }
  };

  const handleEdit = (item: SparePart) => {
    dispatch(displayBargeValue(item));
    setOpenModal(true);
    // dispatch(toggleAddConsumeablesModal(parent));
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.id));
    }
  };

  const [countdowns, setCountdowns] = useState<
    { days: number; hours: number; minutes: number; seconds: number }[]
  >(data.map((item) => calculateCountdown(item.waranty_period)));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(
        data.map((item) => calculateCountdown(item.waranty_period))
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [data]);

  const handleRequisition = async (selectedItems: number[]) => {
    const selectedQuantities = selectedItems.map((id) => ({
      id,
      quantity: quantities[id] || 0,
    }));
    console.log('Selected Quantities:', selectedQuantities);
    // Handle the requisition logic here
    try {
      dispatch(toggleLoading(true));
      const response = await axios.post(
        `${process.env.BASEURL}/consumable/${
          parent === 'Engine'
            ? 'engine'
            : parent === 'Deck'
            ? 'deck'
            : parent === 'Safety'
            ? 'safety'
            : parent === 'Hospital'
            ? 'hospital'
            : 'galleylaundry'
        }/requisition`,
        { items: selectedQuantities },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log('Requisition Response:', response);
      setSelectedItems([]);
      toggleRequisition();
      fetchdata();
      toast.success(response.data.message);
      // Swal.fire('Deleted!', 'Your items have been deleted.', 'success');
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: quantity,
    }));
  };

  const hasPermission = (permissionName: string) =>
    user?.permissions?.some(
      (permission: any) => permission.name === permissionName
    );

  return (
    <div className="bg-white pt-2">
      <div className="overflow-x-auto">
        <div className="flex justify-end gap-3 mb-4 mt-2">
          {requisition && (
            <button
              className={`p-2 rounded-md ${
                selectedItems.length === 0
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-700 text-white'
              }`}
              onClick={() => handleRequisition(selectedItems)}
              disabled={selectedItems.length === 0}
            >
              Make requisition
            </button>
          )}
          <button
            className={`p-2 rounded-md ${
              selectedItems.length === 0
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-red-700 text-white'
            }`}
            onClick={() => handleDelete(selectedItems)}
            disabled={selectedItems.length === 0}
          >
            Delete Selected
          </button>
        </div>
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">
                <input
                  type="checkbox"
                  checked={selectedItems.length === currentItems.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-sm text-left pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-left py-3">Project</th>
              {requisition && selectedItems.length > 0 && (
                <th className="text-sm text-center py-3">Qty Req</th>
              )}
              <th className="text-sm text-left py-3">Description</th>
              <th className="text-sm text-left py-3">Qty</th>
              {/* <th className="text-sm text-center py-3">Part No.</th> */}
              <th className="text-sm text-left py-3">Model</th>
              <th className="text-sm text-left py-3">Threshold</th>
              <th className="text-sm text-left py-3">Location</th>
              <th className="text-sm text-left py-3">Date Acquired</th>
              <th className="text-sm text-left py-3">Warranty Days</th>
              <th className="text-sm text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 &&
              currentItems.map((item: SparePart, index) => {
                const countdown = countdowns[index] || {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                  seconds: 0,
                };
                const { days, hours, minutes, seconds } = countdown;
                const {
                  id,
                  project,
                  description,
                  stock_quantity,
                  part_number,
                  date_acquired,
                  waranty_period,
                  threshold,
                  location,
                  model_grade,
                } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(id)}
                        onChange={() => handleSelectItem(id)}
                      />
                    </td>
                    <td className="py-2 text-center text-sm text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-left text-sm">
                      {project?.project_name}
                    </td>
                    {selectedItems.includes(item.id) && requisition ? (
                      <td>
                        <input
                          type="number"
                          className="p-3 border rounded-md w-[100px]"
                          value={quantities[item.id] || ''}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </td>
                    ) : selectedItems.length > 0 && requisition ? (
                      <td></td>
                    ) : null}
                    <td className="py-2 text-left text-sm">{description}</td>
                    <td className="py-2 text-left text-sm">{stock_quantity}</td>
                    {/* <td className="py-2 text-center">{part_number}</td> */}
                    <td className="py-2 text-left text-sm">
                      {model_grade || 'nil'}
                    </td>
                    <td className="py-2 text-left text-sm">{threshold}</td>
                    <td className="py-2 text-left text-sm">{location?.name}</td>
                    <td className="py-2 text-left text-sm">{date_acquired}</td>
                    <td className="py-2 text-left text-sm">{`${days}d ${hours}h ${minutes}m ${seconds}s`}</td>
                    {(parent === 'Engine' &&
                      (hasPermission('can update engine consumable') ||
                        hasPermission('can delete engine consumable'))) ||
                    (parent === 'Deck' &&
                      (hasPermission('can update deck consumable') ||
                        hasPermission('can delete deck consumable'))) ||
                    (parent === 'Safety' &&
                      (hasPermission('can update safety consumable') ||
                        hasPermission('can delete safety consumable'))) ||
                    (parent === 'Hospital' &&
                      (hasPermission('can update hospital consumable') ||
                        hasPermission('can delete hospital consumable'))) ||
                    (parent === 'Galley' &&
                      (hasPermission('can update galley laundry consumable') ||
                        hasPermission(
                          'can delete galley laundry consumable'
                        ))) ? (
                      <td className="py-2 text-left text-sm relative">
                        <div className="flex items-left text-sm justify-center gap-2">
                          <button
                            className="bg-blue-700 text-white text-sm p-2 rounded-md"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-700 p-2 rounded-md text-white cursor-pointer flex items-center justify-center"
                            onClick={() => handleDelete([id])}
                            disabled={loadingStates[item.id]} // Optional: Disable button while loading
                          >
                            {loadingStates[id] ? (
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                              </svg>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    ) : null}
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
                          No {parent} found
                        </p>
                        <p className="font-normal text-sm mt-3">
                          Click “add {parent}” button to get started in doing
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
        {data.length > itemsPerPage && (
          <nav className="flex justify-center">
            <ul className="flex list-none">
              {[...Array(Math.ceil(data.length / itemsPerPage))].map(
                (_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      className={`${
                        currentPage === index + 1
                          ? 'bg-primary text-white'
                          : 'bg-white text-primary'
                      } px-3 py-1 rounded-md border border-primary`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ConsumablesableList;
