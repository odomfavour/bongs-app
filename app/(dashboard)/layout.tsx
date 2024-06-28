import { Anybody } from 'next/font/google';
import DashboardWrapper from './DashboardWrapper';
import { ReactNode } from 'react';

// Define the metadata type
interface Metadata {
  title: string;
  description: string;
}

const anybody = Anybody({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: 'normal',
});

export const metadata: Metadata = {
  title: 'Bongs',
  description: '',
};

// Define the props type for RootLayout
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
