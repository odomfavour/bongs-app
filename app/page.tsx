'use client';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BidAccessComp from '@/components/Bid/BidAccessComp';

export default function Home() {
  const router = useRouter();
  const [pathName, setpathName] = useState('');

  const path = usePathname();

  useEffect(() => {
    if (path === '/bid-submission') {
      setpathName('/bid-submission');
      return;
    }
    router.push('/login');
  }, [path, router]);

  if (pathName) {
    return <BidAccessComp />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </main>
  );
}
