'use client';
import React, { useCallback, useEffect, useState } from 'react';
import GeneratorTableList from './GeneratorTableList';
import EngineStrip from './EngineStrip';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../Loader';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { toggleLoading } from '@/provider/redux/modalSlice';
import AddEngineModal from './AddEngineModal';
import Modal from '../dashboard/Modal';

interface Generator {
  id: number;
  project: string;
  description: string;
  quantity: number;
  part_number: string;
  model: string;
  threshold: number;
  location: string;
  warranty_days: string;
}

interface User {
  token: string;
}

interface EnginePanelProps {
  engineCategories: { id: number; name: string; count: string }[];
  user: User;
  fetchLoading: boolean;
  requisition: boolean;
  toggleRequisition: () => void;
}

const EnginePanel: React.FC<EnginePanelProps> = ({
  engineCategories,
  user,
  fetchLoading,
  requisition,
  toggleRequisition,
}) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [spareparts, setSpareparts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isAddEngineModalOpen = useSelector(
    (state: any) => state.modal.isAddEngineModalOpen
  );
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  const dispatch = useDispatch();
  const fetchData = useCallback(async () => {
    if (activeId === undefined) return;
    let endpoint = `${process.env.BASEURL}/sparepart/engine/${activeId}`;
    if (pathname === '/inventories') {
      console.log('inverntor');
      endpoint += '?filter=project';
    }
    try {
      dispatch(toggleLoading(true));
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('resp', response);
      setSpareparts(response?.data?.data?.data);
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [activeId, dispatch, pathname, user?.token]);

  useEffect(() => {
    if (engineCategories && engineCategories.length > 0) {
      setActiveTab(engineCategories[0].name);
      setActiveId(engineCategories[0].id);
    }
  }, [engineCategories]);
  useEffect(() => {
    fetchData();
  }, [activeId, fetchData, isAddEngineModalOpen]);

  // const filteredSpareparts = spareparts.filter((sparepart) =>
  //   pathname === '/miv-inventories' ? !sparepart.project : sparepart.project
  // );
  return (
    <div>
      <div className="my-4">
        <EngineStrip
          toggleRequisition={toggleRequisition}
          setOpenModal={setOpenModal}
        />
      </div>
      <div className="overflow-y-auto">
        <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
          {engineCategories.map((tab) => (
            <button
              key={tab.id}
              className={`p-3 w-full capitalize ${
                activeTab === tab.name
                  ? 'bg-black text-white'
                  : 'bg-[#D9D9D9] text-black'
              }`}
              onClick={() => {
                setActiveTab(tab.name);
                setActiveId(tab.id);
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* {activeTab === engineCategories && ( */}
      {loading ? (
        <Loader />
      ) : (
        <GeneratorTableList
          data={spareparts}
          fetchdata={fetchData}
          parent={'Engine'}
          requisition={requisition}
          setOpenModal={setOpenModal}
          toggleRequisition={toggleRequisition}
        />
      )}
      <Modal
        title="Add New Engine"
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="70%"
      >
        <AddEngineModal
          fetchData={fetchData}
          handleClose={handleClose}
          inventoryType="Engine"
        />
      </Modal>
      {/* )} */}
    </div>
  );
};

export default EnginePanel;
