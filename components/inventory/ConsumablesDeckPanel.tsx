import React, { useCallback, useEffect, useState } from 'react';
import EngineStrip from './EngineStrip';
import GeneratorTableList from './GeneratorTableList';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConsDeckStrip from './ConsDeckStrip';
import ConsumablesableList from './ConsumablesTableList';
import { toggleLoading } from '@/provider/redux/modalSlice';

interface User {
  token: string;
}

interface CEnginePanelProps {
  deckCategories: { id: number; name: string; count: string }[];
  user: User;
}

const ConsumablesEnginePanel: React.FC<CEnginePanelProps> = ({
  deckCategories,
  user,
}) => {
  console.log('engine', deckCategories?.[0]?.name);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [consumables, setConsumables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isAddConsumeablesModalOpen = useSelector(
    (state: any) => state.modal.isAddConsumeablesModalOpen
  );
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    if (activeId === undefined) return; // Ensure activeId is defined before making the request
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/consumable/deck/${activeId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('resp', response, activeId);
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
  }, [activeId, dispatch, user?.token]);

  useEffect(() => {
    if (deckCategories && deckCategories.length > 0) {
      console.log(deckCategories);
      setActiveTab(deckCategories[0].name);
      setActiveId(deckCategories[0].id);
    }
  }, [deckCategories]);

  useEffect(() => {
    if (activeId !== undefined) {
      fetchData();
    }
  }, [activeId, fetchData, isAddConsumeablesModalOpen]);

  return (
    <div>
      <div className="my-4">
        <ConsDeckStrip />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2">
        {deckCategories.map((tab: any) => (
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
        parent={'Deck'}
      />
    </div>
  );
};

export default ConsumablesEnginePanel;
