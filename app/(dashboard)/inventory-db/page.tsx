'use client';
import InventoryDbListTable from '@/components/inventory/InventoryDbListTable';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toggleLoading } from '@/provider/redux/modalSlice';

interface Deck {
  id: number;
  name: string;
  deck_number: string;
  deck_type: string;
}

interface Location {
  id: number;
  name: string;
  location_number: string;
  address: string;
  deck: Deck;
  status: string;
  created_at: string;
}

interface SparePart {
  id: number;
}

interface Inventory {
  id: number;
  description: string;
  quantity: number;
  threshold: string;
  part_number: string;
  model_number: string;
  model_grade: string;
  location: Location;
  stock_quantity: number;
  project_id: number;
  spare_part_category: SparePart;
  consumable_engine_category_id: number;
  sparepart_engine_category_id: number;
  consumable_deck_category_id: number;
  sparepart_deck_category_id: number;
  consumable_safety_category_id: number;
  sparepart_safety_category_id: number;
  consumable_hospital_category_id: number;
  consumable_category_id: number;
  sparepart_hospital_category_id: number;
}

const Page = () => {
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [selectedOption3, setSelectedOption3] = useState('');
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(
    []
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));

    try {
      const response = await axios.get(`${process.env.BASEURL}/inventory`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setInventories(response?.data?.data?.original?.data);
      setFilteredInventories(response?.data?.data?.original?.data); // Initially set to all data
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
  }, [dispatch, user?.token, router]);

  const filterData = useCallback(() => {
    let filteredData = inventories;

    if (selectedOption1 && !selectedOption2 && !selectedOption3) {
      filteredData = filteredData.filter((item) => {
        if (selectedOption1 === 'spareparts') {
          return item.spare_part_category != null;
        } else if (selectedOption1 === 'consumable') {
          return item.spare_part_category == null;
        }
        return true;
      });
    }

    if (selectedOption2 && !selectedOption1 && !selectedOption3) {
      filteredData = filteredData.filter((item) => {
        if (selectedOption2 === 'miv') {
          return item.project_id == null;
        } else if (selectedOption2 === 'project') {
          return item.project_id != null;
        }
        return true;
      });
    }

    if (selectedOption2 && selectedOption1 && !selectedOption3) {
      filteredData = filteredData.filter((item) => {
        if (selectedOption2 === 'miv' && selectedOption1 === 'spareparts') {
          return item.project_id == null;
        } else if (
          selectedOption2 === 'project' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.project_id != null;
        }
        return true;
      });
    }

    if (selectedOption3 && selectedOption1 && !selectedOption2) {
      filteredData = filteredData.filter((item) => {
        if (selectedOption3 === 'engine' && selectedOption1 === 'consumable') {
          return item.consumable_engine_category_id !== null;
        } else if (
          selectedOption3 === 'engine' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_engine_category_id !== null;
        } else if (
          selectedOption3 === 'deck' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_deck_category_id !== null;
        } else if (
          selectedOption3 === 'deck' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_deck_category_id !== null;
        } else if (
          selectedOption3 === 'safety' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_safety_category_id !== null;
        } else if (
          selectedOption3 === 'safety' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_safety_category_id !== null;
        } else if (
          selectedOption3 === 'hospital' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_hospital_category_id !== null;
        } else if (
          selectedOption3 === 'hospital' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_hospital_category_id !== null;
        } else if (
          selectedOption3 === 'safety' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_safety_category_id !== null;
        } else if (selectedOption3 === 'galley') {
          return item.consumable_category_id !== null;
        }
        return true;
      });
    }

    if (selectedOption3 && selectedOption1 && selectedOption2) {
      filteredData = filteredData.filter((item) => {
        if (
          selectedOption3 === 'engine' &&
          selectedOption1 === 'consumable' &&
          selectedOption2 === 'miv'
        ) {
          return item.consumable_engine_category_id !== null;
        } else if (
          selectedOption3 === 'engine' &&
          selectedOption1 === 'spareparts' &&
          selectedOption2 === 'project'
        ) {
          return item.sparepart_engine_category_id !== null;
        } else if (
          selectedOption3 === 'deck' &&
          selectedOption1 === 'consumable' &&
          selectedOption2 === 'miv'
        ) {
          return item.consumable_deck_category_id !== null;
        } else if (
          selectedOption3 === 'deck' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_deck_category_id !== null;
        } else if (
          selectedOption3 === 'safety' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_safety_category_id !== null;
        } else if (
          selectedOption3 === 'safety' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_safety_category_id !== null;
        } else if (
          selectedOption3 === 'hospital' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_hospital_category_id !== null;
        } else if (
          selectedOption3 === 'hospital' &&
          selectedOption1 === 'spareparts'
        ) {
          return item.sparepart_hospital_category_id !== null;
        } else if (
          selectedOption3 === 'safety' &&
          selectedOption1 === 'consumable'
        ) {
          return item.consumable_safety_category_id !== null;
        } else if (selectedOption3 === 'galley') {
          return item.consumable_category_id !== null;
        }
        return true;
      });
    }

    setFilteredInventories(filteredData);
  }, [selectedOption1, selectedOption2, selectedOption3, inventories]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    filterData();
  }, [selectedOption1, selectedOption2, selectedOption3, filterData]);

  return (
    <div>
      <div className="flex gap-3 mb-5">
        <div>
          <select
            id="selectedOption2"
            value={selectedOption2}
            onChange={(e) => setSelectedOption2(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          >
            <option value="">All</option>
            <option value="miv">MIV</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div>
          <select
            id="selectedOption1"
            value={selectedOption1}
            onChange={(e) => setSelectedOption1(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          >
            <option value="">All</option>
            <option value="spareparts">Spareparts</option>
            <option value="consumable">Consumable</option>
          </select>
        </div>
        <div>
          <select
            id="selectedOption3"
            value={selectedOption3}
            onChange={(e) => setSelectedOption3(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          >
            <option value="">Choose Option</option>
            <option value="engine">Engine</option>
            <option value="deck">Deck</option>
            <option value="safety">Safety</option>
            <option value="hospital">Hospital</option>
            {selectedOption1 === 'consumable' && (
              <option value="galley">Galley</option>
            )}
          </select>
        </div>
      </div>
      <InventoryDbListTable data={filteredInventories} fetchData={() => {}} />
    </div>
  );
};

export default Page;
