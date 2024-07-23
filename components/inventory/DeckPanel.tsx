import React, { useCallback, useEffect, useState } from 'react';
import RadarsTableList from './RadarsTableList';
import DeckStrip from './DeckStrip';
import { toast } from 'react-toastify';
import axios from 'axios';
import GeneratorTableList from './GeneratorTableList';
import { useDispatch } from 'react-redux';
import { toggleLoading } from '@/provider/redux/modalSlice';
import { usePathname } from 'next/navigation';

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

interface DeckPanelProps {
  deckCategories: { id: number; name: string; count: string }[];
  user: User;
}

const DeckPanel: React.FC<DeckPanelProps> = ({ deckCategories, user }) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [spareparts, setSpareparts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const fetchData = useCallback(async () => {
    if (activeId === undefined) return;
    let endpoint = `${process.env.BASEURL}/sparepart/deck/${activeId}`;
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
    if (deckCategories && deckCategories.length > 0) {
      setActiveTab(deckCategories[0].name);
      setActiveId(deckCategories[0].id);
    }
  }, [deckCategories]);
  useEffect(() => {
    fetchData();
  }, [activeId, fetchData]);
  return (
    <div>
      <div className="my-4">
        <DeckStrip />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2">
        {deckCategories.map((tab) => (
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

      <GeneratorTableList
        data={spareparts}
        fetchdata={fetchData}
        parent={'Deck'}
      />
    </div>
  );
};

export default DeckPanel;
