import React, { useCallback, useEffect, useState } from 'react';
import GasDetectorTableList from './GasDetectorTableList';
import SafetyStrip from './SafetyStrip';
import axios from 'axios';
import { toast } from 'react-toastify';
import GeneratorTableList from './GeneratorTableList';

interface User {
  token: string;
}

interface SafetyPanelProps {
  safetyCategories: { id: number; name: string; count: string }[];
  user: User;
}

const SafetyPanel: React.FC<SafetyPanelProps> = ({
  safetyCategories,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | undefined>(undefined);
  const [spareparts, setSpareparts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (activeId === undefined) return;
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/sparepart/safety/${activeId}`,
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
    if (safetyCategories && safetyCategories.length > 0) {
      setActiveTab(safetyCategories[0].name);
      setActiveId(safetyCategories[0].id);
    }
  }, [safetyCategories]);
  useEffect(() => {
    fetchData();
  }, [activeId, fetchData]);
  return (
    <div>
      <div className="my-4">
        <SafetyStrip />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {safetyCategories.map((tab) => (
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
      {/* {activeTab === 'Gas Detector' && ( */}
      <GeneratorTableList
        data={spareparts}
        fetchdata={fetchData}
        parent={'Safety'}
      />
      {/* )} */}
    </div>
  );
};

export default SafetyPanel;