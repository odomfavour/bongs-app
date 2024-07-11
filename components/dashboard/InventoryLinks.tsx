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
    href: '/inventories',
    text: 'Project-based Inventories',
    img: 'inventories.png',
  },
  {
    href: '/miv-inventories',
    text: 'MIV Inventories',
    img: 'inventories.png',
  },
];

interface InventoryLinksProps {
  closeInnerSidebar: () => void;
}

const InventoryLinks: React.FC<InventoryLinksProps> = ({
  closeInnerSidebar,
}) => {
  return (
    <div>
      <ul>
        {links.map((link, index) => (
          <li key={index} className="text-center py-3 pl-2">
            <Link href={link.href} onClick={closeInnerSidebar}>
              <div
                className="w-full flex gap-3 items-center"
                onClick={closeInnerSidebar}
              >
                <div className="relative w-[28px] h-[28px]">
                  <Image
                    src={`/icons/${link.img}`}
                    width={28}
                    height={38}
                    priority
                    alt="avatar"
                  />
                </div>
                <p className="text-[14px]">{link.text}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryLinks;
