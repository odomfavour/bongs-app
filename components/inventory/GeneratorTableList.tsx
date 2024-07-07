'use client';

import {
  displayBargeValue,
  toggleAddEngineModal,
  toggleBargeComponentModal,
} from '@/provider/redux/modalSlice';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
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
}

const GeneratorTableList: React.FC<GeneratorListTableProps> = ({
  data,
  fetchdata,
  parent,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

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
          `${process.env.BASEURL}/sparepart/engine/bulk-delete`,
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
    dispatch(toggleAddEngineModal(parent));
  };

  return (
    <div className="bg-white">
      <div className="flex justify-end mb-4">
        <button
          className="bg-red-700 text-white p-2 rounded-md"
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
                    e.target.checked ? currentItems.map((item) => item.id) : []
                  )
                }
                checked={
                  selectedItems.length === currentItems.length &&
                  currentItems.length > 0
                }
              />
            </th>
            <th className="text-sm text-center py-3">S/N</th>
            <th className="text-sm text-center py-3">Project</th>
            <th className="text-sm text-center py-3">Description</th>
            <th className="text-sm text-center py-3">Qty</th>
            <th className="text-sm text-center py-3">Part No.</th>
            <th className="text-sm text-center py-3">Model</th>
            <th className="text-sm text-center py-3">Threshold</th>
            <th className="text-sm text-center py-3">Location</th>
            <th className="text-sm text-center py-3">Warranty Days</th>
            <th className="text-sm text-center py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td className="text-center py-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
              </td>
              <td className="text-center py-3">{index + 1}</td>
              <td className="text-center py-3">{item.project.project_name}</td>
              <td className="text-center py-3">{item.description}</td>
              <td className="text-center py-3">{item.quantity}</td>
              <td className="text-center py-3">{item.part_number}</td>
              <td className="text-center py-3">{item.model_number}</td>
              <td className="text-center py-3">{item.threshold}</td>
              <td className="text-center py-3">{item.location.name}</td>
              <td className="text-center py-3">{item.warranty_days}</td>
              <td className="text-center py-3">
                <div className="flex justify-center space-x-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={() => handleEdit(item)}
                  >
                    <FaPenAlt />
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-md"
                    onClick={() => handleDelete([item.id])}
                    disabled={loadingStates[item.id]}
                  >
                    {loadingStates[item.id] ? (
                      <span className="loader"></span>
                    ) : (
                      <FaTrashAlt />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
  );
};

export default GeneratorTableList;
