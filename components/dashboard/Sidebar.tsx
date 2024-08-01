'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import PreferencesLinks from './PreferencesLinks';
import InventoryLinks from './InventoryLinks';
import { FaX } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';

interface Module {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  status: string;
  subscriber_id: number | null;
  department_id: number | null;
  is_hod: number;
  is_barge_master: number;
  is_company_rep: number;
  is_authorized_for_release: number;
  roles: { id: number; name: string }[];
  // permissions: Permission[];
  modules: Module[];
}

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [showInnerSidebar, setShowInnerSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const innerSidebarRef = useRef<HTMLDivElement>(null);
  console.log(user);
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

  const hasPermission = (moduleName: string) =>
    user?.modules?.some((module) => module.name === moduleName);
  const pathname = usePathname();
  const preferencePaths = [
    '/preferences',
    '/barge-component-category',
    '/vendor-category',
    '/location',
    '/projects',
    '/safety-category',
    '/unit-of-measurement',
    '/inventory-category',
  ];
  return (
    <div className="flex fixed top-[70px] z-40">
      <div className="w-[120px] h-[90vh] pb-5 overflow-y-auto rounded-t-md shadow bg-white">
        <ul>
          <li
            className={`border-b text-center ${
              activeTab === 'Dashboard' || pathname === '/dashboard'
                ? 'bg-gray-200'
                : ''
            }`}
          >
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
          {hasPermission('Preference Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'Preferences' ||
                preferencePaths.includes(pathname)
                  ? 'bg-gray-200'
                  : ''
              }`}
            >
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
          )}
          {hasPermission('Inventory Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'Inventory' ? 'bg-gray-200' : ''
              }`}
            >
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
          )}
          {hasPermission('Reports Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'Reports' ? 'bg-gray-200' : ''
              }`}
            >
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
          )}
          {hasPermission('Procurement Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'Procurement' ? 'bg-gray-200' : ''
              }`}
            >
              <div
                onClick={() => handleTabClick('Procurement')}
                className="w-full h-[90px] flex justify-center items-center cursor-pointer"
              >
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
          )}
          {hasPermission('User Management Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'Users' ? 'bg-gray-200' : ''
              }`}
            >
              <Link href="/users" onClick={closeInnerSidebar}>
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
              </Link>
            </li>
          )}
          {hasPermission('Human Resource Management Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'HR' ? 'bg-gray-200' : ''
              }`}
            >
              <div
                onClick={() => handleTabClick('HR')}
                className="w-full h-[90px] flex justify-center items-center cursor-pointer"
              >
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
          )}
          {hasPermission('Finance Module') && (
            <li
              className={`border-b text-center ${
                activeTab === 'Finance' ? 'bg-gray-200' : ''
              }`}
            >
              <div
                onClick={() => handleTabClick('Finance')}
                className="w-full h-[80px] flex justify-center items-center cursor-pointer"
              >
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
          )}
        </ul>
      </div>
      {showInnerSidebar && (
        <div
          ref={innerSidebarRef}
          className="w-[250px] px-3 bg-white rounded-md shadow-md z-30 h-[90vh] overflow-y-auto"
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
