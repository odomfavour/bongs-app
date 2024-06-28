'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import BargeListTable from '@/components/preferences/BargeListTable';
import DeckListTable from '@/components/preferences/DeckListTable';
import StoreOnBoardStrip from '@/components/preferences/StoreOnBoardStrip';
import StoreOnBoardListTable from '@/components/preferences/StoreOnBoardTableList';
import {
  displayBargeValue,
  toggleAddBargeModal,
  toggleAddDeckModal,
} from '@/provider/redux/modalSlice';
import Loader from '@/components/Loader';

interface User {
  first_name: string;
  last_name: string;
}

interface Barge {
  id: number;
  barge_number: string;
  name: string;
  rooms: number;
  store_location: number;
  deck_level: number;
  addedBy: string;
  created_at: string;
  status: string;
  user: User;
}

interface Project {
  id: number;
  project_name: string;
  project_title: string;
  project_duration: string;
  project_start_date: string;
  project_end_date: string;
  created_at: string;
}

interface Deck {
  id: number;
  deck_number: string;
  name: string;
  deck_type: string;
  barge: Barge;
  user: User;
  created_at: string;
  status: string;
}

interface StoreBoard {
  id: number;
  project: Project;
  description: string;
  deck: Deck;
  key: string;
  room_number: string;
  addedBy: string;
  created_at: string;
  status: string;
  user: User;
}

const Preferences = () => {
  const [activeTab, setActiveTab] = useState('Barge');
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Barge', count: '' },
    { id: 2, name: 'Deck', count: '' },
    { id: 3, name: 'Deck Type', count: '' },
    { id: 4, name: 'Store - on - Board', count: '' },
  ]);
  const [barges, setBarges] = useState<Barge[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [storeItems, setStoreItems] = useState<StoreBoard[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.user);
  const isBargeModalOpen = useSelector(
    (state: any) => state.modal.isBargeModalOpen
  );
  const isDeckModalOpen = useSelector(
    (state: any) => state.modal.isDeckModalOpen
  );

  const isStoreOnBoardModalOpen = useSelector(
    (state: any) => state.modal.isStoreOnBoardModalOpen
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bargesResponse, decksResponse, storeOnBoardResponse] =
        await Promise.all([
          axios.get(`${process.env.BASEURL}/barge`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }),
          axios.get(`${process.env.BASEURL}/deck`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }),
          axios.get(`${process.env.BASEURL}/keystore`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }),
        ]);
      setBarges(bargesResponse?.data?.data?.data);
      console.log('decks', storeOnBoardResponse);
      setDecks(decksResponse?.data?.data?.data);
      setStoreItems(storeOnBoardResponse?.data?.data?.data);
      // You can similarly setStoreItems if needed
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isBargeModalOpen, isDeckModalOpen, isStoreOnBoardModalOpen]);

  return (
    <div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Barge Setup</p>
        <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
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
        {activeTab === 'Barge' ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleAddBargeModal());
            }}
          >
            Add Barge
          </button>
        ) : activeTab === 'Deck' ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleAddDeckModal());
            }}
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

      <div className="grid grid-cols-4 items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`p-3 w-full ${
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
        {loading ? (
          <Loader />
        ) : (
          <>
            {activeTab === 'Barge' && (
              <BargeListTable data={barges} fetchdata={fetchData} />
            )}
            {activeTab === 'Deck' && (
              <DeckListTable data={decks} fetchdata={fetchData} />
            )}
            {activeTab === 'DeckType' && (
              <BargeListTable data={barges} fetchdata={fetchData} />
            )}
            {activeTab === 'Store - on - Board' && (
              <StoreOnBoardListTable data={storeItems} fetchdata={fetchData} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Preferences;
