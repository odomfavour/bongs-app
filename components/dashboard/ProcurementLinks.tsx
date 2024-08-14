import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    href: '/RFQ',
    label: 'RFQ',
    img: 'preference_barge_setup_deck.png',
  },
  {
    href: '/bids',
    labels: ['Bids'],
    label: 'Bids',
    img: 'project.png',
  },
  {
    href: '/memo',
    label: 'Memo',
    labels: ['Memo'],
    img: 'Preferences_units.png',
  },
  {
    href: '/pruchase',
    labels: ['Purchase'],
    img: 'preference_safety_category.png',
  }
];

interface ProcurementLinksProps {
  closeInnerSidebar: () => void;
  subCategories: { id: number; name: string }[];
}

const ProcurementLinks: React.FC<ProcurementLinksProps> = ({
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

export default ProcurementLinks;
