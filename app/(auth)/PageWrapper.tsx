import React, { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <section className="flex justify-center items-center h-screen  bg-auth-pattern bg-cover bg-center">
      <div className="md:w-2/5 w-full">
        <div className="bg-[#f6f2f2ae] p-8 rounded-[10px]">{children}</div>
      </div>
    </section>
  );
};

export default PageWrapper;
