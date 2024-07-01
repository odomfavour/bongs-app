import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface LinkItem {
  href: string;
  text: string;
  img: string;
}

const links: LinkItem[] = [
  {
    href: '/preferences/general',
    text: 'Oil and Lubricant',
    img: 'inventories.png',
  },
  {
    href: '/preferences/security',
    text: 'Chipping and paints',
    img: 'inventory_chipping_and_painting.png',
  },
  {
    href: '/preferences/notifications',
    text: 'Spare Part List',
    img: 'inventory_all_spare_parts.png',
  },
];

const InventoryLinks: React.FC = () => {
  return (
    <ul>
      {links.map((link, index) => (
        <li key={index} className="border-b text-center">
          <Link href={link.href}>
            <div className="w-full h-[80px] flex justify-center items-center">
              <div className="relative w-[28px] h-[28px] mr-2">
                <Image
                  src={`/icons/${link.img}`}
                  width={28}
                  height={28}
                  priority
                  alt={link.text}
                />
              </div>
              <div>{link.text}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default InventoryLinks;
