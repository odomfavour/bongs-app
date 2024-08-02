'use client';
import Loader from '@/components/Loader';
import DepartmentListTable from '@/components/users/DepartmentListTable';
import PermissionListTable from '@/components/users/PermissionListTable';
import UserListTable from '@/components/users/UserListTable';
import UserTypesListTable from '@/components/users/RolesListTable';
import {
  displayBargeValue,
  toggleAddDepartmentModal,
  toggleAddPermissionModal,
  toggleAddRoleModal,
  toggleAddUserModal,
  toggleAddUserTypeModal,
  toggleLoading,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import RolesListTable from '@/components/users/RolesListTable';
import { useRouter } from 'next/navigation';
import Modal from '@/components/dashboard/Modal';
import AddUserModal from '@/components/users/AddUserModal';
import AddDeptModal from '@/components/users/AddDeptModal';
import AddRoleModal from '@/components/users/AddRoleModal';

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state?.user?.user);
  const isAddRoleModalOpen = useSelector(
    (state: any) => state?.modal?.isAddRoleModalOpen
  );
  const isAddDepartmentModalOpen = useSelector(
    (state: any) => state?.modal?.isAddDepartmentModalOpen
  );
  const isAddUserModalOpen = useSelector(
    (state: any) => state?.modal?.isAddUserModalOpen
  );
  const [activeTab, setActiveTab] = useState('Roles');
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Roles', count: '', permission: 'can view roles' },
    {
      id: 2,
      name: 'Departments',
      count: '',
      permission: 'can view department',
    },
    { id: 3, name: 'Users', count: '', permission: 'can view user' },
  ]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const handleUserClose = () => {
    setOpenUserModal(false);
  };

  const [openRoleModal, setOpenRoleModal] = useState(false);
  const handleRoleClose = () => {
    setOpenRoleModal(false);
  };

  const [openDeptModal, setOpenDeptModal] = useState(false);
  const handleDeptClose = () => {
    setOpenDeptModal(false);
  };

  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );

  const handleApiError = useCallback(
    (error: any) => {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    },
    [router]
  );

  const fetchUsers = useCallback(async () => {
    if (!hasPermission('can view user')) return;

    dispatch(toggleLoading(true));
    try {
      const usersResponse = await axios.get(`${process.env.BASEURL}/users`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setUsers(usersResponse?.data?.data?.data);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, handleApiError, hasPermission, user?.token]);

  const fetchRoles = useCallback(async () => {
    if (!hasPermission('can view roles')) return;

    dispatch(toggleLoading(true));
    try {
      const rolesResponse = await axios.get(
        `${process.env.BASEURL}${
          user?.subscriber_id
            ? `/subscriber-roles/${user?.subscriber_id}`
            : '/roles'
        }`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('role', rolesResponse);
      setRoles(
        user?.subscriber_id
          ? rolesResponse?.data?.data
          : rolesResponse?.data?.data?.data
      );
    } catch (error: any) {
      handleApiError(error);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [
    dispatch,
    handleApiError,
    hasPermission,
    user?.subscriber_id,
    user?.token,
  ]);

  const fetchDepartments = useCallback(async () => {
    if (!hasPermission('can view department')) return;

    dispatch(toggleLoading(true));
    try {
      const deptResponse = await axios.get(
        `${process.env.BASEURL}/getDepartments`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setDepartments(deptResponse?.data?.data?.data);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, handleApiError, hasPermission, user?.token]);

  useEffect(() => {
    if (activeTab === 'Users') {
      fetchUsers();
    } else if (activeTab === 'Roles') {
      fetchRoles();
    } else if (activeTab === 'Departments') {
      fetchDepartments();
    }
  }, [fetchUsers, fetchRoles, fetchDepartments, activeTab]);

  // Filter tabs based on user permissions
  const accessibleTabs = useMemo(
    () => tabs.filter((tab) => hasPermission(tab.permission)),
    [tabs, hasPermission]
  );

  return (
    <section>
      <div className="flex md:flex-row gap-5 flex-col justify-between md:items-center items-start mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium ">{activeTab}</p>
        <div className="flex items-center gap-2 md:w-2/5 w-full">
          <div className="md:w-4/5 w-3/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
                <FaSearch className="text-veriDark" />
              </div>
            </div>
          </div>

          <button className="bg-grey-400 border text-sm p-3 rounded-md">
            Add Filter
          </button>
        </div>
      </div>
      <div className="flex justify-end mb-6">
        {activeTab === 'Users' && hasPermission('can create user') ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              setOpenUserModal(true);
            }}
          >
            Add User
          </button>
        ) : activeTab === 'Roles' && hasPermission('can create roles') ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              setOpenRoleModal(true);
            }}
          >
            Add Role
          </button>
        ) : (
          //  : activeTab == 'Permissions' ? (
          //   <button
          //     className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
          //     onClick={() => {
          //       dispatch(displayBargeValue({}));
          //       dispatch(toggleAddPermissionModal());
          //     }}
          //   >
          //     Add Permission
          //   </button>
          // )
          <>
            {hasPermission('can create department') && (
              <button
                className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
                onClick={() => {
                  dispatch(displayBargeValue({}));
                  setOpenDeptModal(true);
                }}
              >
                Add Department
              </button>
            )}
          </>
        )}
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 flex-wrap items-center gap-2">
        {accessibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`p-3 w-full ${
              activeTab === tab.name
                ? 'bg-black text-white'
                : 'bg-[#D9D9D9] text-black'
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="">
        {activeTab === 'Users' && (
          <UserListTable
            data={users}
            fetchData={fetchUsers}
            setOpenUserModal={setOpenUserModal}
          />
        )}
        {activeTab === 'Roles' && (
          <RolesListTable
            data={roles}
            fetchData={fetchRoles}
            setOpenRoleModal={setOpenRoleModal}
          />
        )}
        {/* {activeTab === 'Permissions' && (
              <PermissionListTable data={permissions} fetchData={fetchData} />
            )} */}
        {activeTab === 'Departments' && (
          <DepartmentListTable
            data={departments}
            fetchData={fetchDepartments}
            setOpenDeptModal={setOpenDeptModal}
          />
        )}
      </div>
      <Modal
        title="Add User"
        isOpen={openUserModal}
        onClose={handleUserClose}
        maxWidth="60%"
      >
        <AddUserModal
          fetchData={fetchUsers}
          handleUserClose={handleUserClose}
        />
      </Modal>
      <Modal
        title="Add Role"
        isOpen={openRoleModal}
        onClose={handleRoleClose}
        maxWidth="60%"
      >
        <AddRoleModal
          fetchData={fetchRoles}
          handleRoleClose={handleRoleClose}
        />
      </Modal>
      <Modal
        title="Add Department"
        isOpen={openDeptModal}
        onClose={handleDeptClose}
        maxWidth="60%"
      >
        <AddDeptModal
          fetchData={fetchDepartments}
          handleDeptClose={handleDeptClose}
        />
      </Modal>
    </section>
  );
};

export default Page;
