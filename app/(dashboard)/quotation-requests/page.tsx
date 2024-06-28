'use client';
import UoMListTable from '@/components/uom/UomListTable';
import { toggleUomModal } from '@/provider/redux/modalSlice';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

interface Uom {
  id: number;
  name: string;
  unitNo: string;
  description: string;
  addedBy: string;
  status: string;
  createdOn: string;
}

const UomPage = () => {
  const dispatch = useDispatch();
  const [uom, setUom] = useState<Uom[]>([
    {
      id: 1,
      name: '(Unit - 1)',
      unitNo: 'Set',
      description: 'Set',
      addedBy: 'DP Analytics',
      status: 'Active',
      createdOn: '2024-05-13 10:56:35',
    },
  ]);
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Request for Quotations</p>
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
      <div>
        <div className="flex justify-end mb-6">
          <button
            className="bg-grey-400 border-[3px] border-[#1455D3] text-sm py-3 px-6 rounded-[30px] text-white bg-[#1455D3]"
            onClick={() => dispatch(toggleUomModal())}
          >
            Add UoM
          </button>
        </div>
        <UoMListTable data={uom} />
      </div>
    </section>
  );
};

export default UomPage;
