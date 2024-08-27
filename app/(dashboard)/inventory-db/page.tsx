'use client';
import InventoryDbListTable from '@/components/inventory/InventoryDbListTable';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useRouter } from 'next/navigation'; // Assuming you're using Next.js routing
import { useDispatch, useSelector } from 'react-redux'; // Assuming you use Redux
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import { toggleLoading } from '@/provider/redux/modalSlice';

interface Inventory {
  id: number;
  description: string;
  quantity: number;
  threshold: string;
  part_number: string;
  model_number: string;
  location: string;
}

const Page = () => {
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [selectedOption3, setSelectedOption3] = useState('');
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true)); // Assuming you want to toggle loading state

    try {
      const response = await axios.get(`${process.env.BASEURL}/inventory`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('resp', response);
      //   setInventories(response?.data?.data?.data);
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
  }, [selectedOption1, selectedOption2, selectedOption3, dispatch, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div className="flex gap-3 mb-5">
        <div>
          <select
            id="selectedOption1"
            value={selectedOption1}
            onChange={(e) => setSelectedOption1(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          >
            <option value="">All</option>
            <option value="engine">Spareparts</option>
            <option value="deck">Consumable</option>
          </select>
        </div>
        <div>
          <select
            id="selectedOption2"
            value={selectedOption2}
            onChange={(e) => setSelectedOption2(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
          >
            <option value="">All</option>
            <option value="engine">MIV</option>
            <option value="deck">Project</option>
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
            {selectedOption1 === 'consumables' && (
              <option value="galley">Galley</option>
            )}
          </select>
        </div>
      </div>
      <InventoryDbListTable fetchData={fetchData} data={inventories} />
    </div>
  );
};

export default Page;
