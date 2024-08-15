'use client';
import Modal from '@/components/dashboard/Modal';
import AddEngineModal from '@/components/inventory/AddEngineModal';
import ConsDeckStrip from '@/components/inventory/ConsDeckStrip';
import ConsEngineStrip from '@/components/inventory/ConsEngineStrip';
import ConsHospitalStrip from '@/components/inventory/ConsHospitalStrip';
import ConsSafetyStrip from '@/components/inventory/ConsSafetyStrip';
import ConsumablesDeckPanel from '@/components/inventory/ConsumablesDeckPanel';
import ConsumablesEnginePanel from '@/components/inventory/ConsumablesEnginePanel';
import ConsumablesGalleyPanel from '@/components/inventory/ConsumablesGalleyPanel';
import ConsumablesHospitalPanel from '@/components/inventory/ConsumablesHospital';
import ConsumablesSafetyPanel from '@/components/inventory/ConsumablesSafetyPanel';
import DeckPanel from '@/components/inventory/DeckPanel';
import DeckStrip from '@/components/inventory/DeckStrip';
import EnginePanel from '@/components/inventory/EnginePanel';
import EngineStrip from '@/components/inventory/EngineStrip';
import HospitalPanel from '@/components/inventory/HospitalPanel';
import HospitalStrip from '@/components/inventory/HospitalStrip';
import SafetyPanel from '@/components/inventory/SafetyPanel';
import SafetyStrip from '@/components/inventory/SafetyStrip';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('spare-parts');
  const [selectedOption, setSelectedOption] = useState('engine');
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const isAddEngineModalOpen = useSelector(
    (state: any) => state.modal.isAddEngineModalOpen
  );

  const [requisition, setRequisition] = useState(false);
  const toggleRequisition = () => {
    setRequisition(!requisition);
    console.log('req', requisition);
  };
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      let response;
      let urlPath;

      if (activeTab === 'spare-parts') {
        switch (selectedOption) {
          case 'engine':
            urlPath = 'sparepart-engine-category';
            break;
          case 'deck':
            urlPath = 'sparepart-deck-category';
            break;
          case 'safety':
            urlPath = 'safety-category';
            break;
          default:
            urlPath = 'sparepart-hospital-category';
            break;
        }
      } else {
        switch (selectedOption) {
          case 'engine':
            urlPath = 'consumable/getEngineCategories';
            break;
          case 'deck':
            urlPath = 'consumable/getDeckCategories';
            break;
          case 'safety':
            urlPath = 'consumable/getSafetyCategories';
            break;
          case 'hospital':
            urlPath = 'consumable/getHospitalCategories';
            break;
          default:
            urlPath = 'consumable/getGalleyLaundryCategories';
            break;
        }
      }

      response = await axios.get(`${process.env.BASEURL}/${urlPath}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setCategories(response?.data?.data?.data);
      console.log('Response:', response);

      console.log('resp', response);
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
  }, [activeTab, dispatch, router, selectedOption, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isAddEngineModalOpen, user?.token]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[30px] font-medium mb-2">Project Inventories</p>
          <div className="inline-flex border rounded-[30px] p-1">
            <button
              className={`${
                activeTab === 'spare-parts' ? 'bg-blue-600 text-white' : ''
              } p-2 border rounded-s-[30px] text-sm`}
              onClick={() => setActiveTab('spare-parts')}
            >
              Spare parts
            </button>
            <button
              className={`${
                activeTab === 'consumables' ? 'bg-blue-600 text-white' : ''
              } p-2 border rounded-e-[30px] text-sm`}
              onClick={() => setActiveTab('consumables')}
            >
              Consumables
            </button>
          </div>

          <div>
            <select
              id="selectedOption"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            >
              <option value="">Choose Option</option>
              <option value="engine">Engine</option>
              <option value="deck">Deck</option>
              <option value="safety">Safety</option>
              <option value="hospital">Hospital</option>
              {activeTab === 'consumables' && (
                <option value="galley">Galley</option>
              )}
            </select>
          </div>
        </div>
        <div>
          {activeTab === 'spare-parts' && selectedOption === 'engine' && (
            <EngineStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'spare-parts' && selectedOption === 'deck' && (
            <DeckStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'spare-parts' && selectedOption === 'safety' && (
            <SafetyStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'spare-parts' && selectedOption === 'hospital' && (
            <HospitalStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'consumables' && selectedOption === 'engine' && (
            <ConsEngineStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'consumables' && selectedOption === 'deck' && (
            <ConsDeckStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'consumables' && selectedOption === 'safety' && (
            <ConsSafetyStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
          {activeTab === 'consumables' && selectedOption === 'hospital' && (
            <ConsHospitalStrip
              toggleRequisition={toggleRequisition}
              setOpenModal={setOpenModal}
            />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b"></div>
      {activeTab === 'spare-parts' && selectedOption === 'engine' && (
        <EnginePanel
          openModal={openModal}
          engineCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
          fetchLoading={loading}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
        />
      )}
      {activeTab === 'spare-parts' && selectedOption === 'deck' && (
        <DeckPanel
          openModal={openModal}
          deckCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
        />
      )}

      {activeTab === 'spare-parts' && selectedOption === 'safety' && (
        <SafetyPanel
          openModal={openModal}
          safetyCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
        />
      )}
      {activeTab === 'spare-parts' && selectedOption === 'hospital' && (
        <HospitalPanel
          openModal={openModal}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
          hospitalCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
        />
      )}
      {activeTab === 'consumables' && selectedOption === 'engine' && (
        <ConsumablesEnginePanel
          openModal={openModal}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
          engineCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
        />
      )}
      {activeTab === 'consumables' && selectedOption === 'deck' && (
        <ConsumablesDeckPanel
          openModal={openModal}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
          deckCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
        />
      )}
      {activeTab === 'consumables' && selectedOption === 'galley' && (
        <ConsumablesGalleyPanel
          openModal={openModal}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
          galleyCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
        />
      )}
      {activeTab === 'consumables' && selectedOption === 'hospital' && (
        <ConsumablesHospitalPanel
          openModal={openModal}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
          hospitalCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
        />
      )}
      {activeTab === 'consumables' && selectedOption === 'safety' && (
        <ConsumablesSafetyPanel
          openModal={openModal}
          handleClose={handleClose}
          setOpenModal={setOpenModal}
          safetyCategories={categories}
          user={user}
          requisition={requisition}
          toggleRequisition={toggleRequisition}
        />
      )}
    </div>
  );
};

export default Page;
