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
      <div>
        <LocationListTable
          data={locations}
          fetchData={fetchData}
          setOpenModal={setOpenModal}
        />
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
