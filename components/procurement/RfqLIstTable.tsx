'use client';

// import { EmptyProductIcon } from '@/utils/utils';
import Image from 'next/image';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
interface Rfq {
  id: number;
  title: string;
  rfqId: string;
  type: string;
  budget: number;
  date: string;
  status: string;
}

interface RfqListTableProps {
  data: Rfq[];
}

const RfqListTable: React.FC<RfqListTableProps> = ({ data }) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const toggleDropdown = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="bg-white">
      <table className="table-auto w-full text-primary rounded-2xl mb-5">
        <thead>
          <tr className="border-b bg-[#E9EDF4]">
            <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
            <th className="text-sm text-center py-3">RFQ ID</th>
            <th className="text-sm text-center py-3">Title</th>
            <th className="text-sm text-center py-3">Type</th>
            <th className="text-sm text-center py-3">Budget</th>
            <th className="text-sm text-center py-3">Status</th>
            <th className="text-sm text-center py-3">Date</th>
            <th className="text-sm text-center py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 &&
            currentItems.map((item) => {
              const { id, rfqId, title, type, status, budget, date } = item;
              return (
                <tr className="border-b" key={id}>
                  <td className="py-2 text-center text-[#344054]">{id}</td>
                  <td className="py-2 text-center">{rfqId}</td>
                  <td className="py-2 text-center">{title}</td>
                  <td className="py-2 text-center">{type}</td>
                  <td className="py-2 text-center">${budget}</td>
                  <td className="py-2 text-center">{status}</td>
                  <td className="py-2 text-center">{date}</td>
                  <td className="py-2 text-center flex justify-center items-center">
                    <div className="flex gap-3">
                      <FaExternalLinkAlt title="view" role="button" />
                      <FaPenAlt title="edit" role="button" />
                      <FaTrashAlt
                        title="delete"
                        role="button"
                        className="text-red-600"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          {currentItems.length == 0 && (
            <tr className="text-center text-primary bg-white">
              <td className="py-2 text-center" colSpan={10}>
                <div className="flex justify-center items-center  min-h-[60vh]">
                  <div>
                    <div className="flex justify-center items-center">
                      <FaRegFolderClosed className="text-4xl" />
                    </div>
                    <div className="mt-5">
                      <p className="font-medium text-[#475467]">
                        No Decks found
                      </p>
                      <p className="font-normal text-sm mt-3">
                        Click “add deck” button to get started in doing your
                        <br /> first transaction on the platform
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* {data.length > itemsPerPage && (
        <div className="pagination px-5">
          <div className="flex items-center gap-6 text-primary">
            <p
              className={`text-[#9F9F9F] text-base cursor-pointer ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary'
              }`}
              onClick={() => {
                if (currentPage !== 1) {
                  paginate(currentPage - 1);
                }
              }}
            >
              Previous page
            </p>
            {Array.from(
              { length: Math.ceil(data.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((pageNumber) => (
              <div
                key={pageNumber}
                className={`h-[24px] w-[24px] rounded-full  flex justify-center items-center cursor-pointer ${
                  pageNumber == currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-400'
                }`}
                onClick={() => paginate(pageNumber)}
              >
                <p>{pageNumber}</p>
              </div>
            ))}
            <p
              className={`text-[#4C4C4C] text-base cursor-pointer ${
                currentPage === Math.ceil(data.length / itemsPerPage)
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary'
              }`}
              onClick={() => {
                if (currentPage !== Math.ceil(data.length / itemsPerPage)) {
                  paginate(currentPage + 1);
                }
              }}
            >
              Next page
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RfqListTable;
