'use client';
import AssignRoleListTable from '@/components/users/AssignRoleList';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermission] = useState([]);
  const [perPage, setPerPage] = useState('10'); // Default per_page
  const [search, setSearch] = useState(''); // Default search
  const [currentPage, setCurrentPage] = useState(1); // Default page
  const user = useSelector((state: any) => state?.user?.user);

  const fetchData = useCallback(
    async (per_page = '10', search = '', page = 1) => {
      console.log(
        `Fetching data for page: ${page}, per_page: ${per_page}, search: ${search}`
      );
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.BASEURL}/permissions`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          params: {
            per_page,
            search,
            page,
          },
        });
        console.log('resp', response);
        setPermissions(response?.data?.data?.data);
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
        setLoading(false);
      }
    },
    [router, user?.token]
  );

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
      setLoading(false);
    }
  }, [id, user?.token, router]);

  useEffect(() => {
    fetchData(perPage, search, currentPage);
    fetchRolesPermissions();
  }, [fetchData, fetchRolesPermissions, perPage, search, currentPage]);

  return (
    <div>
      <AssignRoleListTable
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
      />
    </div>
  );
};

export default Page;
