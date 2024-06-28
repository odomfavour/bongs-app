'use client';
import BargeListTable from '@/components/preferences/BargeListTable';
import DeckListTable from '@/components/preferences/DeckListTable';
import StoreOnBoardStrip from '@/components/preferences/StoreOnBoardStrip';
import StoreOnBoardListTable from '@/components/preferences/StoreOnBoardTableList';
import RfqListTable from '@/components/procurement/RfqLIstTable';
import {
  toggleAddBargeModal,
  toggleAddDeckModal,
} from '@/provider/redux/modalSlice';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
interface Rfq {
  id: number;
  title: string;
  rfqId: string;
  type: string;
  budget: number;
  date: string;
  status: string;
}

const Preferences = () => {
  const [activeTab, setActiveTab] = useState('RFQ');
  const [tabs, setTabs] = useState([
    { id: 1, name: 'RFQ', count: '' },
    { id: 2, name: 'Bids', count: '' },
    { id: 3, name: 'Memo', count: '' },
    { id: 4, name: 'Purchase Orders', count: '' },
    { id: 4, name: 'Quality Control', count: '' },
    { id: 4, name: 'GRN', count: '' },
  ]);
  const [rfq, setRFQ] = useState<Rfq[]>([
    {
      id: 1,
      rfqId: 'RFQ 003',
      title: 'Request for equipment',
      budget: 300,
      type: 'OEM Specific',
      date: '21-05-24',
      status: 'Active',
    },
  ]);

  const dispatch = useDispatch();

  return (
    <div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-red-700">Barge Setup</p>
        <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute  flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
                <FaSearch className="text-veriDark" />
              </div>
            </div>
          </div>

          <button className="bg-grey-400 border text-sm p-3 rounded-md">
            Add Filter
          </button>
        </div>
      </div>
      <div className="flex justify-end mb-6">
        {activeTab === 'RFQ' ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => dispatch(toggleAddBargeModal())}
          >
            Add New RFQ
          </button>
        ) : activeTab === 'Deck' ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => dispatch(toggleAddDeckModal())}
          >
            Add Deck
          </button>
        ) : activeTab == 'Deck Type' ? (
          <button className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]">
            Add Deck Type
          </button>
        ) : (
          <StoreOnBoardStrip />
        )}
      </div>

      <div className="grid grid-cols-6 items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`p-3  w-full ${
              activeTab === tab.name
                ? 'bg-black text-white'
                : 'bg-[#D9D9D9] text-black'
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {activeTab === 'RFQ' && <RfqListTable data={rfq} />}
      </div>
    </div>
  );
};

export default Preferences;
