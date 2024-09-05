import React, { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

interface PlainWrapperProps {
  children: ReactNode;
}

const PlainWrapper: React.FC<PlainWrapperProps> = ({ children }) => {
  return (
    <>
      <section className="flex justify-center items-center h-screen">
        {children}
      </section>
      <ToastContainer />
    </>
  );
};

export default PlainWrapper;
