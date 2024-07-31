'use client';
import AssignRoleListTable from '@/components/users/AssignRoleList';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Define TypeScript interfaces for your data
interface Permission {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Module {
  id: number;
  name: string;
  sub_categories: SubCategory[];
}

interface RolePermission {
  // Define this based on your API response
}

interface User {
  token: string;
}

const Page = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermission] = useState<RolePermission[]>([]);
  const [perPage, setPerPage] = useState<string>('10'); // Default per_page
  const [search, setSearch] = useState<string>(''); // Default search
  const [currentPage, setCurrentPage] = useState<number>(1); // Default page
  const user = useSelector(
    (state: { user: { user: User } }) => state.user.user
  );
  const dispatch = useDispatch();

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedSubModule, setSelectedSubModule] = useState<string>('');
  const [updatedPermissions, setUpdatedPermissions] = useState<Set<number>>(
    new Set()
  ); // Store updated permission IDs

  const fetchModules = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(`${process.env.BASEURL}/modules`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setModules(response?.data?.data.modules);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [user?.token, router, dispatch]);

  useEffect(() => {
    // fetchData(perPage, search, currentPage);
    // fetchRolesPermissions();
    fetchModules();
  }, [fetchModules]);

  const selectedModuleData = modules.find(
    (module) => module.id === Number(selectedModule)
  );
  const subCategoriesToShow = selectedSubModule
    ? selectedModuleData?.sub_categories.filter(
        (sub) => sub.id === Number(selectedSubModule)
      )
    : selectedModuleData?.sub_categories;

  const handleSavePermissions = async () => {
    dispatch(toggleLoading(true));
    try {
      await axios.post(
        `${process.env.BASEURL}/assign-permissions`,
        {
          role_id: Number(id), // Role ID
          permissions: Array.from(updatedPermissions), // Array of permission IDs
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success('Permissions updated successfully');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';

      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  return (
    <div>
      {/* <AssignRoleListTable
        roleId={Number(id)}
        data={permissions}
        rolePermissions={rolePermissions}
        fetchData={fetchData}
        perPage={perPage}
        setPerPage={setPerPage}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}

      <div className="grid grid-cols-2 gap-6 mt-5">
        <div>
          <label
            htmlFor="module"
            className="block mb-2 text-lg font-medium text-gray-900"
          >
            Module
          </label>
          <select
            id="modules"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-5"
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setSelectedSubModule('');
            }}
          >
            <option value="">Select a module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="submodules"
            className="block mb-2 text-lg font-medium text-gray-900"
          >
            Module Sub Category
          </label>
          <select
            id="submodules"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-5"
            value={selectedSubModule}
            onChange={(e) => setSelectedSubModule(e.target.value)}
            disabled={!selectedModule}
          >
            <option value="">Select a sub module</option>
            {selectedModule &&
              selectedModuleData?.sub_categories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="my-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {subCategoriesToShow?.map((sub) => (
            <div key={sub.id} className="rounded-md bg-[#F4F7FE] p-3">
              <p className="mb-4">{sub.name}</p>
              {sub.permissions.map((permission) => (
                <div key={permission.id}>
                  <label className="inline-flex justify-between w-full items-center cursor-pointer mb-3">
                    <span className="text-sm font-medium text-gray-900">
                      {permission.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={updatedPermissions.has(permission.id)}
                      onChange={(e) => {
                        setUpdatedPermissions((prev) => {
                          const newPermissions = new Set(prev);
                          if (e.target.checked) {
                            newPermissions.add(permission.id);
                          } else {
                            newPermissions.delete(permission.id);
                          }
                          return newPermissions;
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleSavePermissions}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Permissions
      </button>
    </div>
  );
};

export default Page;
