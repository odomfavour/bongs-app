import React, { useCallback, useEffect, useState } from 'react';
import EngineStrip from './EngineStrip';
import GeneratorTableList from './GeneratorTableList';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConsEngineStrip from './ConsEngineStrip';
import ConsumablesableList from './ConsumablesTableList';
import { toggleLoading } from '@/provider/redux/modalSlice';
import { usePathname } from 'next/navigation';

interface User {
  token: string;
}

interface CEnginePanelProps {
  engineCategories: { id: number; name: string; count: string }[];
  user: User;
}

const ConsumablesEnginePanel: React.FC<CEnginePanelProps> = ({
  engineCategories,
  user,
}) => {
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
    let endpoint = `${process.env.BASEURL}/consumable/engine/${activeId}`;
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
  }, [activeId, dispatch, pathname, user?.token]);

  useEffect(() => {
    if (engineCategories && engineCategories.length > 0) {
      setActiveTab(engineCategories[0].name);
      setActiveId(engineCategories[0].id);
    }
  }, [engineCategories]);

  useEffect(() => {
    fetchData();
  }, [activeId, fetchData, isAddConsumeablesModalOpen]);

  return (
    <div>
      <div className="my-4">
        <ConsEngineStrip />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2">
        {engineCategories.map((tab: any) => (
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
        parent={'Engine'}
      />
    </div>
  );
};

export default ConsumablesEnginePanel;
