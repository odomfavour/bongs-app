import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    href: '/Overview',
    labels: ['', '', ''],
    label: 'Overview',
    img: 'procurementOverview.png',
  },
  {
    href: '/RFQ',
    labels: ['', '', ''],
    label: 'RFQ',
    img: 'rfqIcon.png',
  },
  {
    href: '/BID',
    labels: [''],
    label: 'BID',
    img: 'bidIcon.png',
  },
  {
    href: '/Memo',
    label: 'MEMO',
    labels: [''],
    img: 'memoIcon.png',
  },
  {
    href: '/Purchase',
    labels: [''],
    label: 'Purchase',
    img: 'purchaseOrderIcon.png',
  },
  {
    href: '/QA_QC',
    label: 'QA/QC',
    labels: [''],
    img: 'QCIcon.png',
  },
  {
    href: '/GRN',
    label: 'GRN',
    labels: [''],
    img: 'GRNIcon.png',
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
