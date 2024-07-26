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
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import RolesListTable from '@/components/users/RolesListTable';
import { useRouter } from 'next/navigation';

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
  const [activeTab, setActiveTab] = useState('Users');
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Roles', count: '' },
    { id: 2, name: 'Departments', count: '' },
    { id: 3, name: 'Users', count: '' },
  ]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const [usersResponse, rolesResponse, deptResponse] = await Promise.all([
        axios.get(`${process.env.BASEURL}/users`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(
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
        ),
        axios.get(`${process.env.BASEURL}/getDepartments`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
      ]);
      setUsers(usersResponse?.data?.data?.data);
      setRoles(rolesResponse?.data?.data?.data);
      setDepartments(deptResponse?.data?.data?.data);
    } catch (error: any) {
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
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, router, user?.subscriber_id, user?.token]);

  useEffect(() => {
    fetchData();
  }, [
    fetchData,
    isAddRoleModalOpen,
    isAddUserModalOpen,
    isAddDepartmentModalOpen,
  ]);
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
        {activeTab === 'Users' ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleAddUserModal());
            }}
          >
            Add User
          </button>
        ) : activeTab === 'Roles' ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleAddRoleModal());
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
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleAddDepartmentModal());
            }}
          >
            Add Department
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 flex-wrap items-center gap-2">
        {tabs.map((tab) => (
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
          <UserListTable data={users} fetchData={fetchData} />
        )}
        {activeTab === 'Roles' && (
          <RolesListTable data={roles} fetchData={fetchData} />
        )}
        {/* {activeTab === 'Permissions' && (
              <PermissionListTable data={permissions} fetchData={fetchData} />
            )} */}
        {activeTab === 'Departments' && (
          <DepartmentListTable data={departments} fetchData={fetchData} />
        )}
      </div>
    </section>
  );
};

export default Page;
