import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const links = [
  { href: '/preferences', label: 'Barge Setup' },
  { href: '/projects', label: 'Projects' },
  { href: '/preferences/general', label: 'Inventory Types' },
  { href: '/unit-of-measurement', label: 'UoM' },
  { href: '/safety-category', label: 'Safety Category' },
  { href: '/preferences/general', label: 'Asset Category' },
  { href: '/preferences/general', label: 'Department' },
  { href: '/location', label: 'Location' },
  { href: '/preferences/general', label: 'Equipment Type' },
  { href: '/preferences/general', label: 'Manufacturer' },
  { href: '/vendors', label: 'Vendor' },
  { href: '/barge-component-category', label: 'Barge Component Category' },
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
                    src="/icons/sidebar_dashboard.png"
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
