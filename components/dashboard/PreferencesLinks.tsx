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
  {
    href: '/preferences/general',
    label: 'Inventory Types',
    img: 'inventory_types.png',
  },
  { href: '/unit-of-measurement', label: 'UoM', img: 'Preferences_units.png' },
  {
    href: '/safety-category',
    label: 'Safety Category',
    img: 'preference_safety_category.png',
  },
  {
    href: '/preferences/general',
    label: 'Asset Category',
    img: 'preference_asset_category.png',
  },
  {
    href: '/preferences/general',
    label: 'Department',
    img: 'department.png',
  },
  {
    href: '/location',
    label: 'Location',
    img: 'Preferences_location.png',
  },
  {
    href: '/preferences/general',
    label: 'Equipment Type',
    img: 'preference_Equipment_type.png',
  },
  {
    href: '/preferences/general',
    label: 'Manufacturer',
    img: 'preference_manufacturer.png',
  },
  { href: '/vendors', label: 'Vendor', img: 'Preference_supplier.png' },
  {
    href: '/vendor-category',
    label: 'Vendor Category',
    img: 'Preference_supplier.png',
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
          <li key={index} className="border-b text-center py-3 pl-2">
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
                <p>{link.label}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreferencesLinks;
