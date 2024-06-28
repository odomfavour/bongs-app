'use client';
import UoMListTable from '@/components/uom/UomListTable';
import VendorListTable from '@/components/vendors/VendorListTable';
import { toggleVendorModal } from '@/provider/redux/modalSlice';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

interface Vendor {
  id: number;
  vendorNo: string;
  companyName: string;
  category: string;
  description: string;
  email: string;
  status: string;
  createdOn: string;
}

const VendorsPage = () => {
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 1,
      vendorNo: '(Sup - 1)',
      companyName: 'WHITEGATE ENGINEERING',
      category: 'Oil&Lub',
      email: 'whitegate.engineering@yahoo.com',
      description: 'Set',
      status: 'Active',
      createdOn: '2024-05-13 10:56:35',
    },
  ]);
  return (
    <section>
      <div className="flex justify-between items-center mb-5 pb-10 border-b">
        <p className="text-[32px] font-medium">Vendors</p>
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
            onClick={() => dispatch(toggleVendorModal())}
          >
            Add Vendor
          </button>
        </div>
        <VendorListTable data={vendors} />
      </div>
    </section>
  );
};

export default VendorsPage;
