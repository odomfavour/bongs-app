'use client';
import Loader from '@/components/Loader';
import Modal from '@/components/dashboard/Modal';
import AddLocationModal from '@/components/location/AddLocationModal';
import LocationListTable from '@/components/location/LocationListTable';
import {
  displayBargeValue,
  toggleLoading,
  toggleLocationModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface Deck {
  id: number;
  name: string;
  deck_number: string;
  deck_type: string;
}

interface Location {
  id: number;
  name: string;
  location_number: string;
  address: string;
  deck: Deck;
  status: string;
  created_at: string;
}

const LocationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const isLocationModalOpen = useSelector(
    (state: any) => state.modal.isLocationModalOpen
  );
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);

  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view location')) {
        const response = await axios.get(`${process.env.BASEURL}/location`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log('resp', response);
        setLocations(response?.data?.data?.data);
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
    fetchData();
  }, [fetchData, isLocationModalOpen]);
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Location</p>
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
          {hasPermission('can create location') && (
            <button
              className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
              onClick={() => {
                dispatch(displayBargeValue({}));
                setOpenModal(true);
              }}
            >
              Add Location
            </button>
          )}
        </div>
        {loading ? (
          <Loader />
        ) : (
          <LocationListTable
            data={locations}
            fetchData={fetchData}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
      <Modal
        title={
          Object.keys(bargeValues).length > 0
            ? 'Edit Location'
            : 'Add New Location'
        }
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="40%"
      >
        <AddLocationModal fetchData={fetchData} handleClose={handleClose} />
      </Modal>
    </section>
  );
};

export default LocationPage;
