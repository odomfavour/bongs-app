'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import PreferencesLinks from './PreferencesLinks';
import InventoryLinks from './InventoryLinks';
import { FaX } from 'react-icons/fa6';

const Sidebar: React.FC = () => {
  const [showInnerSidebar, setShowInnerSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  const handleTabClick = (tab: string) => {
    if (activeTab === tab) {
      setShowInnerSidebar(!showInnerSidebar);
    } else {
      setActiveTab(tab);
      setShowInnerSidebar(true);
    }
  };

  const closeInnerSidebar = () => {
    setShowInnerSidebar(false);
    setActiveTab('');
  };

  return (
    <div className="flex h-[90vh] fixed top-[70px] z-40">
      <div className="w-[120px] rounded-t-md shadow bg-white">
        <ul>
          <li className="border-b text-center">
            <Link href="/dashboard" onClick={closeInnerSidebar}>
              <div className="w-full h-[80px] flex justify-center items-center">
                <div>
                  <div className="flex justify-center items-center">
                    <div className="relative w-[28px] h-[28px]">
                      <Image
                        src="/icons/sidebar_dashboard.png"
                        width={28}
                        height={38}
                        priority
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <p className="mt-2">Dashboard</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="border-b text-center">
            <div
              onClick={() => handleTabClick('Preferences')}
              className="w-full h-[80px] flex justify-center items-center cursor-pointer"
            >
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/dashboard-2.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2">Preferences</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div
              onClick={() => handleTabClick('Inventory')}
              className="w-full h-[80px] flex justify-center items-center cursor-pointer"
            >
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/inventories.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2">Inventory</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <Link href="#" onClick={closeInnerSidebar}>
              <div className="w-full h-[80px] flex justify-center items-center">
                <div>
                  <div className="flex justify-center items-center">
                    <div className="relative w-[28px] h-[28px]">
                      <Image
                        src="/icons/sidebar_Reports.png"
                        width={28}
                        height={38}
                        priority
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <p className="mt-2">Reports</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[80px] flex justify-center items-center">
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/sidebar_dashboard.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2">Procurement</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[80px] flex justify-center items-center">
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/sidebar_users.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2">Users</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[80px] flex justify-center items-center">
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/human-resource.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2">HR</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[80px] flex justify-center items-center">
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/sidebar_finance.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2">Finance</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      {showInnerSidebar && (
        <div className="w-[250px] px-3 bg-white rounded-md shadow-md z-30">
          <div className="flex justify-end p-2">
            <button onClick={closeInnerSidebar} className="text-red-700">
              <FaX />
            </button>
          </div>
          {activeTab === 'Preferences' && (
            <PreferencesLinks closeInnerSidebar={closeInnerSidebar} />
          )}
          {activeTab === 'Inventory' && <InventoryLinks />}
          {/* Add other conditions for other tabs here */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
