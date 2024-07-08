'use client';
import React, { useCallback, useEffect, useState } from 'react';
import GeneratorTableList from './GeneratorTableList';
import EngineStrip from './EngineStrip';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../Loader';
import { useSelector } from 'react-redux';

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
}

const EnginePanel: React.FC<EnginePanelProps> = ({
  engineCategories,
  user,
  fetchLoading,
}) => {
  console.log('engine', engineCategories?.[0]?.name);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [spareparts, setSpareparts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isAddEngineModalOpen = useSelector(
    (state: any) => state.modal.isAddEngineModalOpen
  );
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/sparepart/engine/${activeId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
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
      setLoading(false);
    }
  }, [activeId, user?.token]);

  useEffect(() => {
    if (engineCategories && engineCategories.length > 0) {
      setActiveTab(engineCategories[0].name);
      setActiveId(engineCategories[0].id);
    }
  }, [engineCategories]);
  useEffect(() => {
    fetchData();
  }, [activeId, fetchData, isAddEngineModalOpen]);

  return (
    <div>
      <div className="my-4">
        <EngineStrip />
      </div>
      {activeTab}
      <div className="grid grid-cols-6 gap-2">
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
      {/* {activeTab === engineCategories && ( */}
      {loading ? (
        <Loader />
      ) : (
        <GeneratorTableList
          data={spareparts}
          fetchdata={fetchData}
          parent={'Engine'}
        />
      )}

      {/* )} */}
    </div>
  );
};

export default EnginePanel;
