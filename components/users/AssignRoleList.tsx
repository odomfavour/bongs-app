'use client';

import { displayBargeValue, toggleUomModal } from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface Permission {
  id: number;
  name: string;
}

interface RolesListTableProps {
  data: Permission[];
  rolePermissions: Permission[];
  fetchData: (per_page?: string, search?: string, page?: number) => void;
  roleId: number;
  perPage: string;
  setPerPage: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
}

const AssignRoleListTable: React.FC<RolesListTableProps> = ({
  data,
  rolePermissions,
  fetchData,
  roleId,
  perPage,
  setPerPage,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
}) => {
  console.log('rolePermissions', rolePermissions);

  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Synchronize selectedPermissions with rolePermissions
  useEffect(() => {
    setSelectedPermissions(rolePermissions.map((perm) => perm.id));
  }, [rolePermissions]);

  const toggleDropdown = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(data.map((perm) => perm.id));
    }
    setSelectAll(!selectAll);
  };

  const updatePermissions = async () => {
    console.log('perms', roleId, selectedPermissions);
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.post(
          `${process.env.BASEURL}/assign-permissions`,
          { role_id: roleId, permissions: selectedPermissions },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire('Updated!', 'Permissions have been updated.', 'success');
          fetchData(perPage, search, currentPage);
        } else {
          Swal.fire(
            'Failed to update!',
            'An error occurred while updating permissions.',
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
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchData(perPage, search, pageNumber);
  };

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions..."
            className="border px-2 py-1"
          />
          <select
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <button
            onClick={() => fetchData(perPage, search, currentPage)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Apply
          </button>
        </div>
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-left py-3">Permission Name</th>
              <th className="text-sm text-left py-3 flex-col items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <p>Select all</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 &&
              data?.map((item, index) => {
                const { id, name } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-left">{name}</td>
                    <td className="py-2 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(id)}
                        onChange={() => handleCheckboxChange(id)}
                      />
                    </td>
                  </tr>
                );
              })}
            {data?.length === 0 && (
              <tr className="text-center text-primary bg-white">
                <td className="py-2 text-center" colSpan={3}>
                  <div className="flex justify-center items-center min-h-[60vh]">
                    <div>
                      <div className="flex justify-center items-center">
                        <FaRegFolderClosed className="text-4xl" />
                      </div>
                      <div className="mt-5">
                        <p className="font-medium text-[#475467]">
                          No Permissions found
                        </p>
                        <p className="font-normal text-sm mt-3">
                          Click “add Permission” button to get started in
                          assigning permissions.
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data?.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={updatePermissions}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update permissions
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Previous
              </button>
              <span>{currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={data.length < parseInt(perPage)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignRoleListTable;
