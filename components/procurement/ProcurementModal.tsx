import React, { ReactNode, CSSProperties } from 'react';
import { BsXLg } from 'react-icons/bs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  title?: string;
}

const ProcurementModal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = '840px',
}) => {
  return (
    <>
      {isOpen ? (
        <div
          className={`fixed inset-0 flex items-center justify-center transition-all ease-in-out duration-500 z-50 `}
        >
        
          <div
            className="bg-white  rounded-lg z-50 sm:w-[70%] mx-auto overflow-auto max-h-[95vh] relative"
            // style={{ maxWidth } as CSSProperties}
          >
            <div className="flex p-5 justify-between items-center my-4">
              <p className="font-bold text-2xl">{title}</p>
              <BsXLg
                className="cursor-pointer text-primary"
                role="button"
                onClick={onClose}
              />
            </div>
            <div
            className="bg-[#988888]  h-[2px] mb-6 opacity-50"
            />
          <div className='px-5'>
          {children}
          </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProcurementModal;
