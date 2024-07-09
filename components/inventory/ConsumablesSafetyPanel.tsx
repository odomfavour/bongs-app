import React, { useCallback, useEffect, useState } from 'react';
import EngineStrip from './EngineStrip';
import GeneratorTableList from './GeneratorTableList';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConsSafetyStrip from './ConsSafetyStrip';
import ConsumablesableList from './ConsumablesTableList';

interface User {
  token: string;
}

interface CEnginePanelProps {
  safetyCategories: { id: number; name: string; count: string }[];
  user: User;
}

const ConsumablesEnginePanel: React.FC<CEnginePanelProps> = ({
  safetyCategories,
  user,
}) => {
  console.log('engine', safetyCategories?.[0]?.name);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [consumables, setConsumables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isAddConsumeablesModalOpen = useSelector(
    (state: any) => state.modal.isAddConsumeablesModalOpen
  );
  const fetchData = useCallback(async () => {
    if (activeId === undefined) return;
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/consumable/safety/${activeId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
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
      setLoading(false);
    }
  }, [activeId, user?.token]);

  useEffect(() => {
    if (safetyCategories && safetyCategories.length > 0) {
      setActiveTab(safetyCategories[0].name);
      setActiveId(safetyCategories[0].id);
    }
  }, [safetyCategories]);

  useEffect(() => {
    fetchData();
  }, [activeId, fetchData, isAddConsumeablesModalOpen]);

  return (
    <div>
      <div className="my-4">
        <ConsSafetyStrip />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2">
        {safetyCategories.map((tab: any) => (
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
        parent={'Safety'}
      />
    </div>
  );
};

export default ConsumablesEnginePanel;
