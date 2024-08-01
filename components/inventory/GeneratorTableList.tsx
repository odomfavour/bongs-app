'use client';

import {
  displayBargeValue,
  toggleAddEngineModal,
  toggleBargeComponentModal,
  toggleLoading,
} from '@/provider/redux/modalSlice';
import { calculateCountdown, formatDate } from '@/utils/utils';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  model_number: string;
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

interface GeneratorListTableProps {
  data: SparePart[];
  fetchdata: () => void;
  parent: string;
  requisition: boolean;
  setOpenModal: (isOpen: boolean) => void;
  toggleRequisition: () => void;
}

const GeneratorTableList: React.FC<GeneratorListTableProps> = ({
  data,
  fetchdata,
  parent,
  requisition,
  setOpenModal,
  toggleRequisition,
}) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const user = useSelector((state: any) => state.user.user);
  const inventoryType = useSelector((state: any) => state.modal.inventoryType);

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
  const itemsPerPage = 30;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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
          `${process.env.BASEURL}/sparepart/${
            parent === 'Engine'
              ? 'engine'
              : parent === 'Deck'
              ? 'deck'
              : parent === 'Safety'
              ? 'safety'
              : 'hospital'
          }/bulk-delete`,
          { ids },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        console.log('Delete Response:', response);
        fetchdata();

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
        setSelectedItems((prevSelected) =>
          prevSelected.filter((itemId) => !ids.includes(itemId))
        );
      }
    }
  };

  const handleSelect = (id: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleEdit = (item: SparePart) => {
    dispatch(displayBargeValue(item));
    setOpenModal(true);
    // dispatch(toggleAddEngineModal(parent));
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
      const response = await axios.post(
        `${process.env.BASEURL}/sparepart/${
          parent === 'Engine'
            ? 'engine'
            : parent === 'Deck'
            ? 'deck'
            : parent === 'Safety'
            ? 'safety'
            : 'hospital'
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
      if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else if (typeof errorMessage === 'object' && errorMessage !== null) {
        const messages = errorMessage as Record<string, string[]>;
        Object.entries(messages).forEach(([field, messages]) =>
          messages.forEach((message) => toast.error(`${field}: ${message}`))
        );
      }
      // toast.error(`${errorMessage}`);
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
    <div className="bg-white">
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
                  onChange={(e) =>
                    setSelectedItems(
                      e.target.checked
                        ? currentItems.map((item) => item.id)
                        : []
                    )
                  }
                  checked={
                    selectedItems.length === currentItems.length &&
                    currentItems.length > 0
                  }
                />
              </th>
              <th className="text-sm text-center py-3">S/N</th>
              {pathname === '/inventories' && (
                <th className="text-sm text-left py-3">Project</th>
              )}
              {requisition && selectedItems.length > 0 && (
                <th className="text-sm text-center py-3">Qty Req</th>
              )}
              <th className="text-sm text-left py-3">Description</th>
              <th className="text-sm text-left py-3">Qty</th>
              <th className="text-sm text-left py-3">Part No.</th>
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
              currentItems?.map((item, index) => {
                const countdown = countdowns[index] || {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                  seconds: 0,
                };
                const { days, hours, minutes, seconds } = countdown;
                return (
                  <tr key={item.id} className="border-b">
                    <td className="text-center py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </td>

                    <td className="text-center text-sm py-3">{index + 1}</td>
                    {pathname === '/inventories' && (
                      <td className="text-left text-sm py-3">
                        {item?.project?.project_name}
                      </td>
                    )}

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
                    {/* {selectedItems.length > 0 && requisition && <td></td>} */}
                    <td className="text-left text-sm py-3">
                      {item?.description}
                    </td>
                    <td className="text-left text-sm py-3">
                      {item?.stock_quantity}
                    </td>
                    <td className="text-left text-sm py-3">
                      {item?.part_number}
                    </td>
                    <td className="text-left text-sm py-3">
                      {item?.model_number}
                    </td>
                    <td className="text-left text-sm py-3">{item.threshold}</td>
                    <td className="text-left text-sm py-3">
                      {item?.location.name}
                    </td>
                    <td className="text-left text-sm py-3">
                      {item?.date_acquired}
                    </td>
                    <td className="text-left text-sm py-3">{`${days}d ${hours}h ${minutes}m ${seconds}s`}</td>
                    {/* {(parent === 'Engine' &&
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
                        ))) ? ( */}
                    <td className="text-left text-sm py-3">
                      <div className="flex justify-left text-sm space-x-2">
                        <button
                          className="bg-blue-500 text-white p-2 rounded-md"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        {/* <button
                    className="bg-red-500 text-white p-2 rounded-md"
                    onClick={() => handleDelete([item.id])}
                    disabled={loadingStates[item.id]}
                  >
                    {loadingStates[item.id] ? (
                      <span className="loader"></span>
                    ) : ( */}
                        <button
                          className="bg-red-700 p-2 rounded-md text-white cursor-pointer flex items-center justify-center
                    "
                          onClick={() => handleDelete([item.id])}
                          disabled={loadingStates[item.id]} // Optional: Disable button while loading
                        >
                          {loadingStates[item.id] ? (
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

                        {/* )}
                  </button> */}
                      </div>
                    </td>
                    {/* ) : null} */}
                  </tr>
                );
              })}
            {currentItems.length == 0 && (
              <tr className="text-center text-primary bg-white">
                <td className="py-2 text-center" colSpan={14}>
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

        {/* Pagination */}
        <div>
          <div className="flex justify-end mt-4">
            <button
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({
              length: Math.ceil(data.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index + 1}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300'
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === Math.ceil(data.length / itemsPerPage)
                  ? 'bg-gray-300'
                  : 'bg-blue-500 text-white'
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorTableList;
