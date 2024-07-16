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
  fetchData: () => void;
  roleId: number;
}

const AssignRoleListTable: React.FC<RolesListTableProps> = ({
  data,
  rolePermissions,
  fetchData,
  roleId,
}) => {
  console.log('rolePermissions', rolePermissions);

  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 200;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((permId) => permId !== id) : [...prev, id]
    );
  };

  const updatePermissions = async () => {
    // Display SweetAlert confirmation dialog
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    });

    // If user confirms action
    if (confirmResult.isConfirmed) {
      // Optionally set a loading state if you want to show a loading indicator
      // setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.BASEURL}/assign-permissions`, // Replace with your actual endpoint
          { role_id: roleId, permissions: selectedPermissions }, // Include the necessary role_id if required
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.status === 200) {
          // Handle success
          Swal.fire('Updated!', 'Permissions have been updated.', 'success');
          fetchData();
        } else {
          // Handle error
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
      } finally {
        // Optionally unset the loading state
        // setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white">
      <pre>{JSON.stringify(selectedPermissions, null, 2)}</pre>{' '}
      {/* Display as JSON */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-primary rounded-2xl mb-5">
          <thead>
            <tr className="border-b bg-[#E9EDF4]">
              <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
              <th className="text-sm text-center py-3">Permission Name</th>
              <th className="text-sm text-center py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 &&
              currentItems.map((item, index) => {
                const { id, name } = item;
                return (
                  <tr className="border-b" key={id}>
                    <td className="py-2 text-center text-[#344054]">
                      {index + 1}
                    </td>
                    <td className="py-2 text-center">{name}</td>
                    <td className="py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(id)}
                        onChange={() => handleCheckboxChange(id)}
                      />
                    </td>
                  </tr>
                );
              })}
            {currentItems.length === 0 && (
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
        {currentItems.length > 0 && (
          <button
            onClick={updatePermissions}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update permissions
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignRoleListTable;
