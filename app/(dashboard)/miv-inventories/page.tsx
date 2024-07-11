'use client';
import ConsumablesDeckPanel from '@/components/inventory/ConsumablesDeckPanel';
import ConsumablesEnginePanel from '@/components/inventory/ConsumablesEnginePanel';
import ConsumablesGalleyPanel from '@/components/inventory/ConsumablesGalleyPanel';
import ConsumablesHospitalPanel from '@/components/inventory/ConsumablesHospital';
import ConsumablesSafetyPanel from '@/components/inventory/ConsumablesSafetyPanel';
import DeckPanel from '@/components/inventory/DeckPanel';
import EnginePanel from '@/components/inventory/EnginePanel';
import HospitalPanel from '@/components/inventory/HospitalPanel';
import SafetyPanel from '@/components/inventory/SafetyPanel';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const [activeTab, setActiveTab] = useState('spare-parts');
  const [selectedOption, setSelectedOption] = useState('engine');
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const isAddEngineModalOpen = useSelector(
    (state: any) => state.modal.isAddEngineModalOpen
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
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
      toast.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedOption, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, isAddEngineModalOpen]);
  return (
    <div>
      <div className=" inline-flex border rounded-[30px] p-2 mb-5">
        <button
          className={`${
            activeTab === 'spare-parts' ? 'bg-blue-600 text-white' : ''
          } p-3 border rounded-s-[30px]`}
          onClick={() => setActiveTab('spare-parts')}
        >
          Spare parts
        </button>
        <button
          className={`${
            activeTab === 'consumables' ? 'bg-blue-600 text-white' : ''
          } p-3 border rounded-e-[30px]`}
          onClick={() => setActiveTab('consumables')}
        >
          Consumables
        </button>
      </div>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
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
      {activeTab === 'spare-parts' && selectedOption === 'engine' && (
        <EnginePanel
          engineCategories={categories}
          user={user}
          fetchLoading={loading}
        />
      )}
      {activeTab === 'spare-parts' && selectedOption === 'deck' && (
        <DeckPanel deckCategories={categories} user={user} />
      )}

      {activeTab === 'spare-parts' && selectedOption === 'safety' && (
        <SafetyPanel safetyCategories={categories} user={user} />
      )}
      {activeTab === 'spare-parts' && selectedOption === 'hospital' && (
        <HospitalPanel hospitalCategories={categories} user={user} />
      )}
      {activeTab === 'consumables' && selectedOption === 'engine' && (
        <ConsumablesEnginePanel engineCategories={categories} user={user} />
      )}
      {activeTab === 'consumables' && selectedOption === 'deck' && (
        <ConsumablesDeckPanel deckCategories={categories} user={user} />
      )}
      {activeTab === 'consumables' && selectedOption === 'galley' && (
        <ConsumablesGalleyPanel galleyCategories={categories} user={user} />
      )}
      {activeTab === 'consumables' && selectedOption === 'hospital' && (
        <ConsumablesHospitalPanel hospitalCategories={categories} user={user} />
      )}
      {activeTab === 'consumables' && selectedOption === 'safety' && (
        <ConsumablesSafetyPanel safetyCategories={categories} user={user} />
      )}
    </div>
  );
};

export default Page;
