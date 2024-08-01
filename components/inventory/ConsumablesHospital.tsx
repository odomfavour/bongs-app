import React, { useCallback, useEffect, useState } from 'react';
import EngineStrip from './EngineStrip';
import GeneratorTableList from './GeneratorTableList';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConsHospitalStrip from './ConsHospitalStrip';
import ConsumablesableList from './ConsumablesTableList';
import { toggleLoading } from '@/provider/redux/modalSlice';
import { usePathname } from 'next/navigation';
import AddConsumablesModal from './AddConsumablesModal';
import Modal from '../dashboard/Modal';

interface User {
  token: string;
}

interface CEnginePanelProps {
  hospitalCategories: { id: number; name: string; count: string }[];
  user: User;
  requisition: boolean;
  toggleRequisition: () => void;
}

const ConsumablesEnginePanel: React.FC<CEnginePanelProps> = ({
  hospitalCategories,
  user,
  requisition,
  toggleRequisition,
}) => {
  console.log('engine', hospitalCategories?.[0]?.name);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [consumables, setConsumables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isAddConsumeablesModalOpen = useSelector(
    (state: any) => state.modal.isAddConsumeablesModalOpen
  );
  const dispatch = useDispatch();
  const pathname = usePathname();
  const fetchData = useCallback(async () => {
    if (activeId === undefined) return;
    let endpoint = `${process.env.BASEURL}/consumable/hospital/${activeId}`;
    if (pathname === '/inventories') {
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
      setConsumables(response?.data?.data?.data);
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
  }, [activeId, dispatch, user?.token, pathname]);

  useEffect(() => {
    if (hospitalCategories && hospitalCategories.length > 0) {
      setActiveTab(hospitalCategories[0].name);
      setActiveId(hospitalCategories[0].id);
    }
  }, [hospitalCategories]);

  useEffect(() => {
    fetchData();
  }, [activeId, fetchData, isAddConsumeablesModalOpen]);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <div>
      <div className="my-4">
        <ConsHospitalStrip
          toggleRequisition={toggleRequisition}
          setOpenModal={setOpenModal}
        />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2">
        {hospitalCategories.map((tab: any) => (
          <button
            key={tab.id}
            className={`p-3 w-full capitalize ${
              activeTab === tab.name
                ? 'bg-black text-white'
                : 'bg-[#D9D9D9] text-black'
            }`}
            onClick={() => {
              setActiveTab(tab.name);
              setActiveId(tab.id); // Ensure both states are updated together
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <ConsumablesableList
        data={consumables}
        fetchdata={fetchData}
        parent={'Hospital'}
        requisition={requisition}
        setOpenModal={setOpenModal}
        toggleRequisition={toggleRequisition}
      />

      <Modal
        title="Add New Safety"
        isOpen={openModal}
        onClose={handleClose}
        maxWidth="70%"
      >
        <AddConsumablesModal
          fetchData={fetchData}
          handleClose={handleClose}
          inventoryType="Hospital"
        />
      </Modal>
    </div>
  );
};

export default ConsumablesEnginePanel;
