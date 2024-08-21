import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface LinkItem {
  href: string;
  label: string;
  labels: string[];
  img: string;
}

const links: LinkItem[] = [
  {
    href: '/inventories',
    label: 'Project',
    labels: ['Project'],
    img: 'i-projects.svg',
  },
  {
    href: '/miv-inventories',
    label: 'MIV',
    labels: ['MIV'],
    img: 'preference_barge_setup_deck.png',
  },
  {
    href: '/material-release',
    label: 'Material Release',
    labels: ['Project', 'MIV'],
    img: 'm-release.svg',
  },
  {
    href: '/requisitions',
    label: 'Material Requisition',
    labels: ['Project', 'MIV'],
    img: 'requisition.svg',
  },
];

interface InventoryLinksProps {
  closeInnerSidebar: () => void;
  subCategories: { id: number; name: string }[];
}

const InventoryLinks: React.FC<InventoryLinksProps> = ({
  closeInnerSidebar,
  subCategories,
}) => {
  return (
    <div>
      <ul>
        {links.map(
          (link, index) =>
            subCategories.some((subCategory) =>
              link.labels.includes(subCategory.name)
            ) && (
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
                    <p className="text-[14px]">{link.label}</p>
                  </div>
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default InventoryLinks;
