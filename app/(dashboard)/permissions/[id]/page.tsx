'use client';
import AssignRoleListTable from '@/components/users/AssignRoleList';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermission] = useState([]);
  const user = useSelector((state: any) => state?.user?.user);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/roles-and-permissions`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('resp', response);
      setPermissions(response?.data?.data?.permissions);
      // You can similarly setStoreItems if needed
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchRolesPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/role-permissions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('resp', response);
      setRolePermission(response?.data?.data);
      // You can similarly setStoreItems if needed
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [user?.token, id]);

  useEffect(() => {
    fetchData();
    fetchRolesPermissions();
  }, [fetchData, fetchRolesPermissions]);

  return (
    <div>
      <AssignRoleListTable
        roleId={Number(id)}
        data={permissions}
        rolePermissions={rolePermissions}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Page;
