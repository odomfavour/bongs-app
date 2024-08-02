'use client';
import Loader from '@/components/Loader';
import Modal from '@/components/dashboard/Modal';
import UoMListTable from '@/components/uom/UomListTable';
import AddVendorModal from '@/components/vendors/AddVendorModal';
import VendorListTable from '@/components/vendors/VendorListTable';
import {
  displayBargeValue,
  toggleLoading,
  toggleVendorModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface Vendor {
  id: number;
  vendor_number: string;
  vendor_name: string;
  vendor_category_id: number;
  vendor_description: string;
  vendor_email: string;
  status: string;
  created_at: string;
}

interface VendorCategory {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

const VendorsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorCats, setVendorCats] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const isVendorModalOpen = useSelector(
    (state: any) => state.modal.isVendorModalOpen
  );

  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      if (hasPermission('can view vendor')) {
        const response = await axios.get(`${process.env.BASEURL}/getVendors`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log('resp', response);
        setVendors(response?.data?.data?.data);
      }
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
  }, [hasPermission, user?.token]);

  const fetchCategories = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view unit of measurement')) {
        const response = await axios.get(
          `${process.env.BASEURL}/getVendorCategories`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('resp', response);
        setVendorCats(response?.data?.data?.data);
        // You can similarly setStoreItems if needed
      }
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
  }, [dispatch, hasPermission, router, user?.token]);

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, [fetchVendors, fetchCategories, isVendorModalOpen]);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Vendors</p>
        <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute  flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
                <FaSearch className="text-veriDark" />
              </div>
            </div>
          </div>

          <button className="bg-grey-400 border text-sm p-3 rounded-md">
            Add Filter
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-end mb-6">
          {hasPermission('can create vendor') && (
            <button
              className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
              onClick={() => {
                dispatch(displayBargeValue({}));
                setOpenModal(true);
              }}
            >
              Add Vendor
            </button>
          )}
        </div>

        <VendorListTable
          data={vendors}
          fetchData={fetchVendors}
          vendorCats={vendorCats}
          setOpenModal={setOpenModal}
        />
      </div>
      <Modal
        title="Add Vendor"
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="50%"
      >
        <AddVendorModal fetchData={fetchVendors} handleClose={handleClose} />
      </Modal>
    </section>
  );
};

export default VendorsPage;
