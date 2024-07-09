'use client';
import { logOut } from '@/provider/redux/userSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useDispatch } from 'react-redux';

interface MainHeaderProps {
  toggleSidebar: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = {
    firstName: '',
    image: {
      assetUrl: '',
    },
  };
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    router.push('/login');
    localStorage.removeItem('bongsUser');
  };
  return (
    <div className="relative bg-white">
      <div className="fixed top-0 right-0 bg-white text-primary z-50 shadow-sm w-full">
        <div className="flex justify-between items-center py-3 px-5">
          <div>
            <GiHamburgerMenu role="button" onClick={toggleSidebar} />
          </div>
          {/* <div className="w-1/2 relative">
            <input
              type="search"
              placeholder="Search here..."
              className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            />
            <div className="absolute  flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
              <FaSearch className="text-veriDark" />
            </div>
          </div> */}
          <div></div>

          <div className="flex items-center gap-4">
            <div className="rounded-full h-[40px] w-[40px] bg-[#F0F2F5] flex justify-center items-center cursor-pointer border-r">
              <FaRegBell className="text-2xl text-veriDark" />
              {/* <NotificationIcon /> */}
            </div>
            <div className="flex gap-2 items-center">
              <div className="rounded-full w-[36px] h-[36px] flex justify-center bg-primary items-center cursor-pointer">
                {user?.image?.assetUrl ? (
                  <Image
                    src={user?.image?.assetUrl}
                    width={36}
                    height={36}
                    className="rounded-full w-[36px] h-[36px]"
                    priority
                    alt="avatar"
                  />
                ) : (
                  <div className="border border-veriDark flex justify-center items-center text-veriDark rounded-full h-[36px] w-[36px]">
                    <p className="flex items-center text-lg">
                      {user?.firstName?.charAt(0)}
                      {user?.firstName?.charAt(0)}
                    </p>
                  </div>
                )}
              </div>
              {/* <p>{user?.firstname}</p> */}
              <div>
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    type="button"
                    className="rounded-md flex justify-center bg-white items-center cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 6.66797L8.4714 10.1966C8.21106 10.4569 7.78894 10.4569 7.5286 10.1966L4 6.66797"
                        stroke="#434343"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="origin-top-right absolute z-50 right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Logout
                        </button>
                        {/* Add more dropdown items if needed */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
