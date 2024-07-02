'use client';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Page = () => {
  const [activeTab, setActiveTab] = useState('spare-parts');
  const [selectedOption, setSelectedOption] = useState('engine');
  const [enginetabs, setEngineTabs] = useState([
    { id: 1, name: 'Generators', count: '' },
    { id: 2, name: 'Huisman Crane', count: '' },
    { id: 3, name: 'Tensioner and A&R Winch', count: '' },
    { id: 4, name: 'Mooring Winches', count: '' },
    { id: 5, name: 'Davits', count: '' },
    { id: 6, name: 'Line Up Station', count: '' },
  ]);
  const [deckTabs, setDeckTabs] = useState([
    { id: 1, name: 'Radars', count: '' },
    { id: 2, name: 'Radios', count: '' },
    { id: 3, name: "Monitor, Tv's ,Printers", count: '' },
    { id: 4, name: 'Ropes and Wires', count: '' },
    { id: 5, name: 'Brush and Painting', count: '' },
  ]);
  const [safetyTabs, setSafetyTabs] = useState([
    { id: 1, name: 'Gas Detector', count: '' },
    { id: 2, name: ' Fire Hoses and Nozzles', count: '' },
    { id: 3, name: 'Breathing Device Apparatus', count: '' },
  ]);
  const [hospitalTabs, setHospitalTabs] = useState([
    { id: 1, name: 'Mattrass', count: '' },
    { id: 2, name: 'Respirators', count: '' },
  ]);
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
      {selectedOption === 'engine' && (
        <div className="grid grid-cols-6 gap-2">
          {enginetabs.map((tab) => (
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
      )}
      {selectedOption === 'deck' && (
        <div className="grid grid-cols-6 gap-2">
          {deckTabs.map((tab) => (
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
      )}

      {selectedOption === 'safety' && (
        <div className="grid grid-cols-6 gap-2">
          {safetyTabs.map((tab) => (
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
      )}
      {selectedOption === 'hospital' && (
        <div className="grid grid-cols-6 gap-2">
          {hospitalTabs.map((tab) => (
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
      )}
    </div>
  );
};

export default Page;
