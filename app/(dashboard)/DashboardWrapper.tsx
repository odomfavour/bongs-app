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
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import AddDeckTypeModal from '@/components/preferences/AddDeckTypeModal';
import AddVendorCategoryModal from '@/components/vendors/AddVendorCategoryModal';
import AddEngineModal from '@/components/inventory/AddEngineModal';
import AddConsumablesModal from '@/components/inventory/AddConsumablesModal';
import AddPermissionModal from '@/components/users/AddPermissionModal';
import AddUserModal from '@/components/users/AddUserModal';
import AddUserTypeModal from '@/components/users/AddUserTypeModal';
import AddDeptModal from '@/components/users/AddDeptModal';
import AddRoleModal from '@/components/users/AddRoleModal';
import AddInventoryTypeModal from '@/components/inventory-category/AddInventoryTypeModal';
import Loader from '@/components/Loader';
import { setSubscribers } from '@/provider/redux/modalSlice';

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  // const [subscribers, setSubscribers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state: any) => state?.user?.user);
  const subscribers = useSelector((state: any) => state?.modal?.subscribers);
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        dispatch(setSubscribers(response?.data?.data?.data));
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
    };
    getSubscribers();
  }, [dispatch, user?.token]);

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
  const isAddUserModalOpen = useSelector(
    (state: any) => state.modal.isAddUserModalOpen
  );
  const isAddUserTypeModalOpen = useSelector(
    (state: any) => state.modal.isAddUserTypeModalOpen
  );
  const isAddDepartmentModalOpen = useSelector(
    (state: any) => state.modal.isAddDepartmentModalOpen
  );
  const isAddPermissionModalOpen = useSelector(
    (state: any) => state.modal.isAddPermissionModalOpen
  );
  const isAddRoleModalOpen = useSelector(
    (state: any) => state.modal.isAddRoleModalOpen
  );
  const isAddInventoryTypeModalOpen = useSelector(
    (state: any) => state.modal.isAddInventoryTypeModalOpen
  );

  const isLoading = useSelector((state: any) => state.modal.isLoading);

  return (
    <>
      <section>
        <MainHeader toggleSidebar={toggleSidebar} />
        <div className="flex pt-[100px] bg-slate-50 gap-2">
          <div
            className={`fixed z-40 h-full bg-white shadow-lg lg:static lg:w-[120px] lg:block ${
              isSidebarOpen ? 'block' : 'hidden'
            }`}
          >
            <Sidebar />
          </div>
          <main
            className={`flex-1 w-full px-5 min-h-[100vh] transition-all duration-300 ${
              isSidebarOpen ? 'ml-0 lg:ml-[120px]' : 'ml-0'
            }`}
          >
            {children}
          </main>
        </div>
      </section>
      {/* {isBargeModalOpen && (
        <AddBargeModal subscribers={subscribers} user={user} />
      )} */}
      {isDeckModalOpen && (
        <AddDeckModal subscribers={subscribers} user={user} />
      )}
      {isDeckTypeModalOpen && (
        <AddDeckTypeModal subscribers={subscribers} user={user} />
      )}
      {isStoreOnBoardModalOpen && (
        <AddStoreOnBoardModal subscribers={subscribers} user={user} />
      )}
      {/* {isProjectModalOpen && (
        <AddProjectModal subscribers={subscribers} user={user} />
      )} */}
      {/* {isUomModalOpen && <AddUomModal />} */}
      {/* {isSafetyCategoryModalOpen && <AddSafetyCategoryModal />} */}
      {/* {isVendorModalOpen && (
        <AddVendorModal subscribers={subscribers} user={user} />
      )}
      {isVendorCategoryModalOpen && (
        <AddVendorCategoryModal subscribers={subscribers} user={user} />
      )} */}
      {/* {isLocationModalOpen && (
        <AddLocationModal subscribers={subscribers} user={user} />
      )} */}
      {isBargeComponentModalOpen && (
        <AddBargeComponentCategoryModal subscribers={subscribers} user={user} />
      )}
      {isAddEngineModalOpen && (
        <AddEngineModal subscribers={subscribers} user={user} />
      )}
      {isAddConsumeablesModalOpen && (
        <AddConsumablesModal subscribers={subscribers} user={user} />
      )}
      {isAddPermissionModalOpen && <AddPermissionModal />}
      {isAddUserModalOpen && (
        <AddUserModal subscribers={subscribers} user={user} />
      )}
      {isAddUserTypeModalOpen && <AddUserTypeModal />}
      {isAddDepartmentModalOpen && (
        <AddDeptModal subscribers={subscribers} user={user} />
      )}
      {isAddRoleModalOpen && (
        <AddRoleModal subscribers={subscribers} user={user} />
      )}
      {isAddInventoryTypeModalOpen && (
        <AddInventoryTypeModal subscribers={subscribers} user={user} />
      )}
      {isLoading && <Loader />}
      <ToastContainer />
    </>
  );
};

export default DashboardWrapper;
