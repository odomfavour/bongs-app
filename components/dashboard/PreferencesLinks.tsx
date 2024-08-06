import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    href: '/preferences',
    labels: ['Barge', 'Deck', 'Keystore'],
    label: 'Barge Setup',
    img: 'preference_barge_setup_deck.png',
  },
  {
    href: '/projects',
    labels: ['Project'],
    label: 'Project',
    img: 'project.png',
  },
  {
    href: '/unit-of-measurement',
    label: 'UOM',
    labels: ['Unit of Measurement'],
    img: 'Preferences_units.png',
  },
  {
    href: '/safety-category',
    labels: ['Safety Category'],
    label: 'Safety Category',
    img: 'preference_safety_category.png',
  },
  {
    href: '/location',
    label: 'Location',
    labels: ['Location'],
    img: 'Preferences_location.png',
  },
  {
    href: '/inventory-category',
    label: 'Inventory Category',
    labels: ['Inventory Category'],
    img: 'preference_Equipment_type.png',
  },
  { href: '/vendors', label: 'Vendor', labels: ['Vendor'], img: 'vendor.png' },
  {
    href: '/vendor-category',
    label: 'Vendor Category',
    labels: ['Vendor Category'],
    img: 'vendor_category.png',
  },
  {
    href: '/barge-component-category',
    label: 'Barge Equipment',
    labels: ['Barge Component Category', 'Keystore'],
    img: 'categories.png',
  },
];

interface PreferencesLinksProps {
  closeInnerSidebar: () => void;
  subCategories: { id: number; name: string }[];
}

const PreferencesLinks: React.FC<PreferencesLinksProps> = ({
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

export default PreferencesLinks;
