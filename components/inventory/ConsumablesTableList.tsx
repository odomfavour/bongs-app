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
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Modal from '../dashboard/Modal';
import { usePathname } from 'next/navigation';
import ConsumableTable from '../AppComp/ConsumableTable';

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
  bulkDelete: boolean;
  toggleBulkDelete: () => void;
}

const ConsumablesableList: React.FC<ConsumablesListTableProps> = ({
  data,
  fetchdata,
  parent,
  requisition,
  setOpenModal,
  toggleRequisition,
  bulkDelete,
  toggleBulkDelete,
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

  const [openDisplayModal, setOpenDisplayModal] = useState(false);
  const handleDisplayClose = () => {
    setOpenDisplayModal(false);
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
  const pathname = usePathname();
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
        {
          subscriber_id: user?.subscriber_id,
          ...formData,
          items: selectedQuantities,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log('Requisition Response:', response);
      setSelectedItems([]);
      toggleRequisition();
      toggleBulkDelete();
      fetchdata();
      handleDisplayClose();
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

  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );

  const [isProjectActive, setIsProjectActive] = useState(true);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: null as null | number,
    is_project: true,
  });

  // const user = useSelector((state: any) => state.user.user);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const toggleActionsDropdown = () => {
    setIsActionsOpen(!isActionsOpen);
    setIsExportOpen(false); // Close the export dropdown if it is open
  };

  const toggleExportDropdown = () => {
    setIsExportOpen(!isExportOpen);
    setIsActionsOpen(false); // Close the actions dropdown if it is open
  };

  const actionsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionsRef.current &&
      !actionsRef.current.contains(event.target as Node)
    ) {
      setIsActionsOpen(false);
    }
    if (
      exportRef.current &&
      !exportRef.current.contains(event.target as Node)
    ) {
      setIsExportOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = async (format: string) => {
    setIsExportOpen(false);
    try {
      dispatch(toggleLoading(true));
      const response = await axios.get(
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
        }/export`,
        {
          params: { format },
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error: any) {
      console.error('Export failed:', error);
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

  const fetchProjects = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view project')) {
        const response = await axios.get(`${process.env.BASEURL}/getProjects`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log('resp', response);
        setProjects(response?.data?.data?.data);
      }
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      // if (error?.response.status === 401) {
      //   router.push('/login');
      // } else {
      //   toast.error(`${errorMessage}`);
      // }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, user?.token, hasPermission]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
              onClick={() => setOpenDisplayModal(true)}
              disabled={selectedItems.length === 0}
            >
              Review Selected Items
            </button>
          )}
          {bulkDelete && (
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
          )}
        </div>
        <div className="flex mb-2">
          <div
            ref={actionsRef}
            className="relative inline-block text-left mr-4"
          >
            {/* Actions Dropdown button */}
            <button
              className="text-[#1455D3] px-4 py-2 border border-[#1455D3] rounded-[30px] inline-flex items-center"
              onClick={toggleActionsDropdown}
            >
              Actions
            </button>

            {/* Actions Dropdown content */}
            {isActionsOpen && (
              <div className="origin-top-right rounded-[16px] absolute left-0 -mt-2 w-[150px] py-2 px-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-gray-100 z-30">
                <button
                  className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                  onClick={() => {
                    toggleRequisition();
                    setIsActionsOpen(false);
                  }}
                >
                  Material Release
                </button>
                <button
                  className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                  onClick={() => {
                    toggleBulkDelete();
                    setIsActionsOpen(false);
                  }}
                >
                  Bulk Delete
                </button>
              </div>
            )}
          </div>

          <div ref={exportRef} className="relative inline-block text-left">
            {/* Export Dropdown button */}
            <button
              className="text-[#1455D3] px-4 py-2 border border-[#1455D3] rounded-[30px] inline-flex items-center"
              onClick={toggleExportDropdown}
            >
              Export
            </button>

            {/* Export Dropdown content */}
            {isExportOpen && (
              <div className="origin-top-right rounded-[16px] absolute left-0 -mt-2 w-[150px] py-2 px-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-gray-100 z-30">
                {/* <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('pdf')}
              >
                PDF
              </button> */}
                <button
                  className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                  onClick={() => handleExport('xlsx')}
                >
                  Excel
                </button>
                {/* <button
                className="block p-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-start"
                onClick={() => handleExport('csv')}
              >
                CSV
              </button> */}
              </div>
            )}
          </div>
        </div>

        {/*    ConsumableTable */}

        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              {(requisition || bulkDelete) && (
                <th className="text-sm text-center pl-3 py-3 rounded">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentItems.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th className="text-sm text-left pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-left py-3">Project</th>
              {requisition && selectedItems.length > 0 && (
                <th className="text-sm text-center py-3">Qty Req</th>
              )}
              <th className="text-sm text-left py-3">Description</th>
              <th className="text-sm text-left py-3">Qty</th>
              {/* <th className="text-sm text-center py-3">Part No.</th> */}
              <th className="text-sm text-left py-3">
                {parent == 'Engine' || parent == 'Deck' ? 'Part No' : 'Model'}
              </th>
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
                    {(requisition || bulkDelete) && (
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(id)}
                          onChange={() => handleSelectItem(id)}
                        />
                      </td>
                    )}
                    <td className="py-2 text-center text-sm text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-left text-sm">
                      {project?.project_name || 'DLB-Kenenna'}
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
                    <td className="py-2 text-left text-sm" title={description}>
                      {description?.length > 100
                        ? `${description.slice(0, 100)}...`
                        : description}
                    </td>

                    <td className="py-2 text-left text-sm">{stock_quantity}</td>
                    {/* <td className="py-2 text-center">{part_number}</td> */}
                    <td className="py-2 text-left text-sm">
                      {model_grade || part_number}
                    </td>
                    <td className="py-2 text-left text-sm">{threshold}</td>
                    <td className="py-2 text-left text-sm">{location?.name}</td>
                    <td className="py-2 text-left text-sm">{date_acquired}</td>
                    <td className="py-2 text-left text-sm">{`${days}d ${hours}h ${minutes}m ${seconds}s`}</td>
                    {(parent === 'Engine' &&
                      (hasPermission('can update project engine consumable') ||
                        hasPermission(
                          'can delete project engine consumable'
                        ))) ||
                    (parent === 'Deck' &&
                      (hasPermission('can update project deck consumable') ||
                        hasPermission('can delete project deck consumable'))) ||
                    (parent === 'Safety' &&
                      (hasPermission('can update project safety consumable') ||
                        hasPermission(
                          'can delete project safety consumable'
                        ))) ||
                    (parent === 'Hospital' &&
                      (hasPermission(
                        'can update project hospital consumable'
                      ) ||
                        hasPermission(
                          'can delete project hospital consumable'
                        ))) ||
                    (parent === 'Galley' &&
                      (hasPermission(
                        'can update project galley laundry consumable'
                      ) ||
                        hasPermission(
                          'can delete project galley laundry consumable'
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

      <Modal
        title=""
        isOpen={openDisplayModal}
        onClose={handleDisplayClose}
        maxWidth="50%"
      >
        <h3 className="mb-3 text-2xl">Selected Materials to Release</h3>

        <div className="flex items-center mb-4">
          <label htmlFor="projectToggle" className="mr-2 font-semibold">
            Project :
          </label>
          <input
            type="checkbox"
            id="projectToggle"
            checked={pathname == '/inventories' ? true : isProjectActive}
            onChange={() => {
              if (!(pathname == '/inventories')) {
                setIsProjectActive(!isProjectActive);
              }
            }}
            className="form-checkbox"
          />
          <span className="ml-2">
            {isProjectActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        {isProjectActive && (
          <div className="mb-4">
            <label
              htmlFor="subscriber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Project
            </label>
            <select
              id="subscriber"
              name="subscriber_id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              value={
                formData.project_id !== null
                  ? formData?.project_id?.toString()
                  : ''
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  project_id: e.target.value ? parseInt(e.target.value) : null,
                })
              }
            >
              <option value="">Select Project</option>
              {projects?.map((project: any) => (
                <option
                  value={project.id}
                  key={project.id}
                  className="capitalize"
                >
                  {project.project_name
                    .split(' ')
                    .map(
                      (word: any) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Selected Items Table */}
        <h2 className="text-xl font-semibold mb-4">Selected Items</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">#</th>
              <th className="py-2">Description</th>
              <th className="py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {currentItems
              .filter((item) => selectedItems.includes(item.id))
              .map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 text-center">{index + 1}</td>
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-center">{quantities[item.id]}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Modal Actions */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleDisplayClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Close
          </button>
          <button
            onClick={() => handleRequisition(selectedItems)}
            className={`px-4 py-2 rounded text-white ${
              selectedItems.length === 0 || !isProjectActive
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={selectedItems.length === 0 && !formData.project_id}
          >
            Confirm & Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ConsumablesableList;
