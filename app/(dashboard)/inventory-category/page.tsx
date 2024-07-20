'use client';
import Loader from '@/components/Loader';
import ConsumablesListTable from '@/components/inventory-category/ConsumablesList';
import SparePartsListTable from '@/components/inventory-category/SparePartsList';
import {
  displayBargeValue,
  toggleAddInventoryTypeModal,
} from '@/provider/redux/modalSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Spare Parts');
  const [selectedOption, setSelectedOption] = useState('engine');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [sparePartsFetched, setSparePartsFetched] = useState(false);
  const [consumablesFetched, setConsumablesFetched] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Spare Parts', count: '' },
    { id: 2, name: 'Consumables', count: '' },
  ]);
  const fetchSparePartsData = useCallback(async () => {
    setLoading(true);
    let urlPath;
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
    console.log('log', selectedOption, urlPath);
    try {
      const response = await axios.get(`${process.env.BASEURL}/${urlPath}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('category', response);
      setSpareParts(response?.data?.data?.data);
      setSparePartsFetched(true);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [selectedOption, user?.token]);

  const fetchConsumablesData = useCallback(async () => {
    setLoading(true);
    let urlPath;
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

    try {
      const response = await axios.get(`${process.env.BASEURL}/${urlPath}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('category', response);
      setConsumables(response?.data?.data?.data);
      setConsumablesFetched(true);
    } catch (error: any) {
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
      setLoading(false);
    }
  }, [router, selectedOption, user?.token]);

  useEffect(() => {
    if (activeTab === 'Spare Parts') {
      fetchSparePartsData();
    } else if (activeTab === 'Consumables') {
      fetchConsumablesData();
    }
  }, [
    activeTab,
    fetchSparePartsData,
    fetchConsumablesData,
    sparePartsFetched,
    consumablesFetched,
  ]);

  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <div>
          <p className="mb-8">Inventory Category</p>
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

      <div className="mb-14 flex justify-between items-center">
        <div className="lg:w-1/6 w-full">
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
            {activeTab === 'Consumables' && (
              <option value="galley">Galley</option>
            )}
          </select>
        </div>
        <div>
          {selectedOption && (
            <button
              className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] capitalize text-white bg-[#1455D3]"
              onClick={() => {
                console.log('sbhdjhgsdhjg');
                dispatch(displayBargeValue({}));
                dispatch(
                  toggleAddInventoryTypeModal({
                    activeCategory: selectedOption,
                    activeTab: activeTab,
                  })
                );
              }}
            >
              Add {selectedOption}
            </button>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            className={`p-3 w-full capitalize ${
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
      {loading ? (
        <Loader />
      ) : (
        <>
          {activeTab === 'Spare Parts' && (
            <SparePartsListTable
              data={spareParts}
              fetchData={fetchSparePartsData}
              parent={selectedOption}
            />
          )}
          {activeTab === 'Consumables' && (
            <ConsumablesListTable
              data={consumables}
              fetchData={fetchConsumablesData}
              parent={selectedOption}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Page;
