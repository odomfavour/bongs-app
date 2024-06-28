import Link from 'next/link';
import React from 'react';

const InventoryLinks = () => {
  return (
    <ul>
      <li className="border-b text-center">
        <Link href="/preferences/general">
          <div className="w-full h-[80px] flex justify-center items-center">
            <div>inventory</div>
          </div>
        </Link>
      </li>
      <li className="border-b text-center">
        <Link href="/preferences/security">
          <div className="w-full h-[80px] flex justify-center items-center">
            <div>Security</div>
          </div>
        </Link>
      </li>
      <li className="border-b text-center">
        <Link href="/preferences/notifications">
          <div className="w-full h-[80px] flex justify-center items-center">
            <div>Notifications</div>
          </div>
        </Link>
      </li>
    </ul>
  );
};

export default InventoryLinks;
