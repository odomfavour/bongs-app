import { Anybody } from 'next/font/google';
import { ReactNode } from 'react';
import PlainWrapper from './PlainWrapper';

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
  title: 'Bongs APP',
  description: 'Lets ship',
};

// Define the props type for RootLayout
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <PlainWrapper>{children}</PlainWrapper>;
}
