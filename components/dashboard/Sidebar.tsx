'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import PreferencesLinks from './PreferencesLinks';
import InventoryLinks from './InventoryLinks';
import { FaX } from 'react-icons/fa6';

const Sidebar: React.FC = () => {
  const [showInnerSidebar, setShowInnerSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const innerSidebarRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        innerSidebarRef.current &&
        !innerSidebarRef.current.contains(event.target as Node)
      ) {
        closeInnerSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex  fixed top-[70px] z-40 ">
      <div className="w-[120px] h-[90vh] pb-5 overflow-y-auto rounded-t-md shadow bg-white">
        <ul>
          <li className="border-b text-center">
            <Link href="/dashboard" onClick={closeInnerSidebar}>
              <div className="w-full h-[90px] flex justify-center items-center">
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
                  <p className="mt-2 text-[13px]">Dashboard</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="border-b text-center">
            <div
              onClick={() => handleTabClick('Preferences')}
              className="w-full h-[90px] flex justify-center items-center cursor-pointer"
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
                <p className="mt-2 text-[13px]">Preferences</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div
              onClick={() => handleTabClick('Inventory')}
              className="w-full h-[90px] flex justify-center items-center cursor-pointer"
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
                <p className="mt-2 text-[13px]">Inventory</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <Link href="#" onClick={closeInnerSidebar}>
              <div className="w-full h-[90px] flex justify-center items-center">
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
                  <p className="mt-2 text-[13px]">Reports</p>
                </div>
              </div>
            </Link>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[90px] flex justify-center items-center">
              <div>
                <div className="flex justify-center items-center">
                  <div className="relative w-[28px] h-[28px]">
                    <Image
                      src="/icons/procurement.png"
                      width={28}
                      height={38}
                      priority
                      alt="avatar"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[13px]">Procurement</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[90px] flex justify-center items-center">
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
                <p className="mt-2 text-[13px]">Users</p>
              </div>
            </div>
          </li>
          <li className="border-b text-center">
            <div className="w-full h-[90px] flex justify-center items-center">
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
                <p className="mt-2 text-[13px]">HR</p>
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
                <p className="mt-2 text-[13px]">Finance</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      {showInnerSidebar && (
        <div
          ref={innerSidebarRef}
          className="w-[230px] px-3 bg-white rounded-md shadow-md z-30 h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-end p-2">
            <button onClick={closeInnerSidebar} className="text-red-700">
              <FaX />
            </button>
          </div>
          {activeTab === 'Preferences' && (
            <PreferencesLinks closeInnerSidebar={closeInnerSidebar} />
          )}
          {activeTab === 'Inventory' && (
            <InventoryLinks closeInnerSidebar={closeInnerSidebar} />
          )}
          {/* Add other conditions for other tabs here */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
