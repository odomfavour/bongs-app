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
  toggleAddDeckTypeModal,
  toggleLoading,
  toggleStoreOnBoardModal,
} from '@/provider/redux/modalSlice';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';
import DeckTypeListTable from '@/components/preferences/DeckTypeListTable';
import { useRouter } from 'next/navigation';

const Preferences = () => {
/* tracking the state of the search field */
  const [search, setSearch] = useState("")


  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Barge');
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Barge', count: '' },
    { id: 2, name: 'Deck', count: '' },
    // { id: 3, name: 'Deck Type', count: '' },
    { id: 3, name: 'Store - on - Board', count: '' },
  ]);
  const [barges, setBarges] = useState<Barge[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckTypes, setDeckTypes] = useState<DeckType[]>([]);
  const [storeItems, setStoreItems] = useState<StoreBoard[]>([]);
  // const [loading, setLoading] = useState(true);



  
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.user);


  
  const isBargeModalOpen = useSelector(
    (state: any) => state.modal.isBargeModalOpen
  );
  const isDeckModalOpen = useSelector(
    (state: any) => state.modal.isDeckModalOpen
  );
  const isDeckTypeModalOpen = useSelector(
    (state: any) => state.modal.isDeckTypeModalOpen
  );

  const isStoreOnBoardModalOpen = useSelector(
    (state: any) => state.modal.isStoreOnBoardModalOpen
  );

  // const isLoading = useSelector((state: any) => state.modal.isLoading);

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const [
        bargesResponse,
        decksResponse,
        deckTypesResponse,
        storeOnBoardResponse,
      ] = await Promise.all([
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
        axios.get(`${process.env.BASEURL}/deck-type`, {
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
      console.log('barge', bargesResponse);
      setBarges(bargesResponse?.data?.data?.data);
      setDecks(decksResponse?.data?.data?.data);
      setDeckTypes(deckTypesResponse?.data?.data?.data);
      setStoreItems(storeOnBoardResponse?.data?.data?.data);
      // You can similarly setStoreItems if needed
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, router, user?.token]);

  useEffect(() => {
    fetchData();
  }, [
    fetchData,
    isBargeModalOpen,
    isDeckModalOpen,
    isStoreOnBoardModalOpen,
    isDeckTypeModalOpen,
  ]);

  return (
    <div>
      <div className="flex md:flex-row gap-5 flex-col justify-between md:items-center items-start mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium ">Barge Setup</p>
        <div className="flex items-center gap-2 md:w-2/5 w-full">
          <div className="md:w-4/5 w-3/5">
            <div className="w-full relative">
              <input
                type="search"
                onChange={e => { 
                  setSearch(e.target.value)
                }}
                placeholder="Search here... now"
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
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleAddDeckTypeModal());
            }}
          >
            Add Deck Type
          </button>
        ) : (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              dispatch(toggleStoreOnBoardModal());
            }}
          >
            Add Store - on - Board
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 flex-wrap items-center gap-2">
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
        {activeTab === 'Barge' && (
          <BargeListTable data={barges} fetchdata={fetchData} />
        )}
        {activeTab === 'Deck' && (
          <DeckListTable data={decks} fetchdata={fetchData} />
        )}
        {activeTab === 'Deck Type' && (
          <DeckTypeListTable data={deckTypes} fetchdata={fetchData} />
        )}
        {activeTab === 'Store - on - Board' && (
          <StoreOnBoardListTable data={storeItems} fetchdata={fetchData} />
        )}
      </div>
    </div>
  );
};

export default Preferences;
