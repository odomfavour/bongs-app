import React, { useCallback, useEffect, useState } from 'react';
import MattrassTableList from './MattrassTableList';
import HospitalStrip from './HospitalStrip';
import axios from 'axios';
import { toast } from 'react-toastify';
import GeneratorTableList from './GeneratorTableList';
interface User {
  token: string;
}

interface HospitalPanelProps {
  hospitalCategories: { id: number; name: string; count: string }[];
  user: User;
}

const HospitalPanel: React.FC<HospitalPanelProps> = ({
  hospitalCategories,
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
        `${process.env.BASEURL}/sparepart/hospital/${activeId}`,
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
    if (hospitalCategories && hospitalCategories.length > 0) {
      setActiveTab(hospitalCategories[0].name);
      setActiveId(hospitalCategories[0].id);
    }
  }, [hospitalCategories]);
  useEffect(() => {
    fetchData();
  }, [activeId, fetchData]);
  return (
    <div>
      <div className="my-4">
        <HospitalStrip />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2  gap-2">
        {hospitalCategories.map((tab) => (
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

      {/* {activeTab === 'Mattress' && ( */}
      <GeneratorTableList
        data={spareparts}
        fetchdata={fetchData}
        parent={'Hospital'}
      />
      {/* )} */}
    </div>
  );
};

export default HospitalPanel;
