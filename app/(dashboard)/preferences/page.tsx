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
import AddBargeModal from '@/components/preferences/AddBargeModal';
import Modal from '@/components/dashboard/Modal';
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
interface DeckType {
  id: number;
  deck_number: string;
  name: string;
  deck: Deck;
  barge: Barge;
  type: string;
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Barge');
  const user = useSelector((state: any) => state?.user?.user);
  const hasPermission = useCallback(
    (permissionName: string) =>
      user?.permissions?.some(
        (permission: any) => permission.name === permissionName
      ),
    [user?.permissions]
  );
  const tabs = [
    { id: 1, name: 'Barge', count: '', permission: 'can view barge' },
    { id: 2, name: 'Deck', count: '', permission: 'can view deck' },
    {
      id: 3,
      name: 'Store - on - Board',
      count: '',
      permission: 'can view keystore',
    },
  ].filter((tab) => hasPermission(tab.permission));
  const [barges, setBarges] = useState<Barge[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckTypes, setDeckTypes] = useState<DeckType[]>([]);
  const [storeItems, setStoreItems] = useState<StoreBoard[]>([]);
  // const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
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

  const fetchBarges = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view barge')) {
        const response = await axios.get(`${process.env.BASEURL}/barge`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setBarges(response?.data?.data?.data);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, hasPermission, router, user?.token]);

  const fetchDecks = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view deck')) {
        const response = await axios.get(`${process.env.BASEURL}/deck`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setDecks(response?.data?.data?.data);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, hasPermission, router, user?.token]);

  const fetchDeckTypes = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view deck type')) {
        const response = await axios.get(`${process.env.BASEURL}/deck-type`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setDeckTypes(response?.data?.data?.data);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, hasPermission, router, user?.token]);

  const fetchStoreOnBoard = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      if (hasPermission('can view keystore')) {
        const response = await axios.get(`${process.env.BASEURL}/keystore`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setStoreItems(response?.data?.data?.data);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response?.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, hasPermission, router, user?.token]);

  useEffect(() => {
    if (activeTab === 'Barge') {
      fetchBarges();
    } else if (activeTab === 'Deck') {
      fetchDecks();
    } else if (activeTab === 'Deck Type') {
      fetchDeckTypes();
    } else if (activeTab === 'Store - on - Board') {
      fetchStoreOnBoard();
    }
  }, [
    activeTab,
    fetchBarges,
    fetchDecks,
    fetchDeckTypes,
    fetchStoreOnBoard,
    isBargeModalOpen,
    isDeckModalOpen,
    isDeckTypeModalOpen,
    isStoreOnBoardModalOpen,
  ]);

  const [openBargeModal, setOpenBargeModal] = useState(false);
  const [openDeckModal, setOpenDeckModal] = useState(false);
  const [openStoreModal, setOpenStoreModal] = useState(false);

  const handleBargeClose = () => {
    setOpenBargeModal(false);
  };

  return (
    <div>
      <div className="flex md:flex-row gap-5 flex-col justify-between md:items-center items-start mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium ">Barge Setup</p>
        <div className="flex items-center gap-2 md:w-2/5 w-full">
          <div className="md:w-4/5 w-3/5">
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
        {activeTab === 'Barge' && hasPermission('can create barge') ? (
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => {
              dispatch(displayBargeValue({}));
              setOpenBargeModal(true);
              // dispatch(toggleAddBargeModal());
            }}
          >
            Add Barge
          </button>
        ) : activeTab === 'Deck' && hasPermission('can create deck') ? (
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
          <>
            {hasPermission('can create keystore') && (
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
          </>
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
          <BargeListTable
            data={barges}
            fetchData={fetchBarges}
            setOpenBargeModal={setOpenBargeModal}
          />
        )}
        {activeTab === 'Deck' && (
          <DeckListTable data={decks} fetchdata={fetchDecks} />
        )}
        {activeTab === 'Deck Type' && (
          <DeckTypeListTable data={deckTypes} fetchdata={fetchDeckTypes} />
        )}
        {activeTab === 'Store - on - Board' && (
          <StoreOnBoardListTable
            data={storeItems}
            fetchdata={fetchStoreOnBoard}
          />
        )}
      </div>
      <Modal
        title={
          Object.keys(bargeValues).length > 0 ? 'Edit Barge' : 'Add New Barge'
        }
        isOpen={openBargeModal}
        onClose={handleBargeClose}
        maxWidth="55%"
      >
        <AddBargeModal fetchData={fetchBarges} handleClose={handleBargeClose} />
      </Modal>
    </div>
  );
};

export default Preferences;
