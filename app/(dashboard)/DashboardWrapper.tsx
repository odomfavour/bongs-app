'use client';
import AddBargeComponentCategoryModal from '@/components/barge-safety/AddBargeComponentCategoryModal';
import MainHeader from '@/components/dashboard/MainHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import AddLocationModal from '@/components/location/AddLocationModal';
import AddBargeModal from '@/components/preferences/AddBargeModal';
import AddDeckModal from '@/components/preferences/AddDeckModal';
import AddStoreOnBoardModal from '@/components/preferences/AddStoreOnBoardModal';
import AddProjectModal from '@/components/projects/AddProjectModal';
import AddSafetyCategoryModal from '@/components/safety-category/AddSafetyCategoryModal';
import AddUomModal from '@/components/uom/AddUomModal';
import AddVendorModal from '@/components/vendors/AddVendorModal';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import AddDeckTypeModal from '@/components/preferences/AddDeckTypeModal';
import AddVendorCategoryModal from '@/components/vendors/AddVendorCategoryModal';
import AddEngineModal from '@/components/inventory/AddEngineModal';
import AddConsumablesModal from '@/components/inventory/AddConsumablesModal';

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  const [subscribers, setSubscribers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state?.user?.user);
  useEffect(() => {
    const getSubscribers = async () => {
      try {
        const response = await axios.get(
          `${process.env.BASEURL}/getSubscribers`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('resp', response);
        setSubscribers(response?.data?.data?.data);
        // Handle success (e.g., redirect to another page)
      } catch (error: any) {
        console.error('Error:', error);

        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          error?.message ||
          'Unknown error';
        toast.error(`${errorMessage}`);
        // Handle error (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    };
    getSubscribers();
  }, [user?.token]);
  const isBargeModalOpen = useSelector(
    (state: any) => state.modal.isBargeModalOpen
  );
  const isDeckModalOpen = useSelector(
    (state: any) => state.modal.isDeckModalOpen
  );
  const isDeckTypeModalOpen = useSelector(
    (state: any) => state.modal.isDeckTypeModalOpen
  );

  const isStoreOnBoardModalOpen = useSelector(
    (state: any) => state.modal.isStoreOnBoardModalOpen
  );
  const isProjectModalOpen = useSelector(
    (state: any) => state.modal.isProjectModalOpen
  );
  const isUomModalOpen = useSelector(
    (state: any) => state.modal.isUomModalOpen
  );
  const isSafetyCategoryModalOpen = useSelector(
    (state: any) => state.modal.isSafetyCategoryModalOpen
  );
  const isVendorModalOpen = useSelector(
    (state: any) => state.modal.isVendorModalOpen
  );
  const isVendorCategoryModalOpen = useSelector(
    (state: any) => state.modal.isVendorCategoryModalOpen
  );
  const isLocationModalOpen = useSelector(
    (state: any) => state.modal.isLocationModalOpen
  );
  const isBargeComponentModalOpen = useSelector(
    (state: any) => state.modal.isBargeComponentModalOpen
  );
  const isAddEngineModalOpen = useSelector(
    (state: any) => state.modal.isAddEngineModalOpen
  );
  const isAddConsumeablesModalOpen = useSelector(
    (state: any) => state.modal.isAddConsumeablesModalOpen
  );
  return (
    <>
      <section>
        <MainHeader />
        <div className="flex pt-[100px] bg-slate-50 gap-6">
          <Sidebar />
          <main
            className="ml-[120px] px-5 min-h-[100vh]"
            style={{ width: 'calc(100% - 120px)' }}
          >
            {' '}
            {children}
          </main>
        </div>
      </section>
      {isBargeModalOpen && (
        <AddBargeModal subscribers={subscribers} user={user} />
      )}
      {isDeckModalOpen && (
        <AddDeckModal subscribers={subscribers} user={user} />
      )}
      {isDeckTypeModalOpen && (
        <AddDeckTypeModal subscribers={subscribers} user={user} />
      )}
      {isStoreOnBoardModalOpen && (
        <AddStoreOnBoardModal subscribers={subscribers} user={user} />
      )}
      {isProjectModalOpen && (
        <AddProjectModal subscribers={subscribers} user={user} />
      )}
      {isUomModalOpen && <AddUomModal />}
      {isSafetyCategoryModalOpen && <AddSafetyCategoryModal />}
      {isVendorModalOpen && (
        <AddVendorModal subscribers={subscribers} user={user} />
      )}
      {isVendorCategoryModalOpen && (
        <AddVendorCategoryModal subscribers={subscribers} user={user} />
      )}
      {isLocationModalOpen && (
        <AddLocationModal subscribers={subscribers} user={user} />
      )}
      {isBargeComponentModalOpen && (
        <AddBargeComponentCategoryModal subscribers={subscribers} user={user} />
      )}
      {isAddEngineModalOpen && (
        <AddEngineModal subscribers={subscribers} user={user} />
      )}
      {isAddConsumeablesModalOpen && (
        <AddConsumablesModal subscribers={subscribers} user={user} />
      )}
      <ToastContainer />
    </>
  );
};

export default DashboardWrapper;
