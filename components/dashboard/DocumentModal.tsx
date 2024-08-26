'use client';

import Image from 'next/image';

interface DocumentModalProps {
  documentUrl: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ documentUrl }) => {
  return (
    <div>
      <div className="relative h-[500px]">
        <div className="flex-1 overflow-auto">
          <Image src={documentUrl} alt="doc" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
