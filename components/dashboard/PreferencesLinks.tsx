import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    href: '/preferences',
    label: 'Barge Setup',
    img: 'preference_barge_setup_deck.png',
  },
  {
    href: '/projects',
    label: 'Projects',
    img: 'project.png',
  },
  // {
  //   href: '#l',
  //   label: 'Inventory Types',
  //   img: 'inventory_types.png',
  // },
  { href: '/unit-of-measurement', label: 'UoM', img: 'Preferences_units.png' },
  {
    href: '/safety-category',
    label: 'Safety Category',
    img: 'preference_safety_category.png',
  },
  // {
  //   href: '#',
  //   label: 'Asset Category',
  //   img: 'preference_asset_category.png',
  // },
  // {
  //   href: '#',
  //   label: 'Department',
  //   img: 'department.png',
  // },
  {
    href: '/location',
    label: 'Location',
    img: 'Preferences_location.png',
  },
  {
    href: '/inventory-category',
    label: 'Inventory Category',
    img: 'preference_Equipment_type.png',
  },
  // {
  //   href: '#',
  //   label: 'Manufacturer',
  //   img: 'preference_manufacturer.png',
  // },
  { href: '/vendors', label: 'Vendor', img: 'vendor.png' },
  {
    href: '/vendor-category',
    label: 'Vendor Category',
    img: 'vendor_category.png',
  },
  {
    href: '/barge-component-category',
    label: 'Barge Equipment',
    img: 'categories.png',
  },
];

interface PreferencesLinksProps {
  closeInnerSidebar: () => void;
}

const PreferencesLinks: React.FC<PreferencesLinksProps> = ({
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
                <p className="text-[14px]">{link.label}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreferencesLinks;
