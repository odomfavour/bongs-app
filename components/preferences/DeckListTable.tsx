'use client';

import {
  displayBargeValue,
  toggleAddBargeModal,
  toggleAddDeckModal,
} from '@/provider/redux/modalSlice';
import { formatDate } from '@/utils/utils';
import axios from 'axios';
// import { EmptyProductIcon } from '@/utils/utils';
import Image from 'next/image';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import DeckTable from '../AppComp/DeckTable';

interface User {
  first_name: string;
  last_name: string;
}

interface Barge {
  id: number;
  barge_number: string;
  name: string;
  rooms: number;
  store_location: number;
  deck_level: number;
  addedBy: string;
  created_at: string;
  status: string;
  user: User;
}

interface Deck {
  id: number;
  deck_number: string;
  name: string;
  deck_type: string;
  barge: Barge;
  user: User;
  created_at: string;
  status: string;
}

interface DeckListTableProps {
  data: Deck[];
  fetchdata: () => void;
}

const DeckListTable: React.FC<DeckListTableProps> = ({ data, fetchdata }) => {
  
  console.log("ran inner here")
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleDropdown = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex(index);
    }
  };


  console.log("this is the data",data)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleEdit = (item: Deck) => {
    dispatch(displayBargeValue(item));
    dispatch(toggleAddDeckModal());
  };
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setLoadingStates((prevState) => ({ ...prevState, [id]: true }));
      try {
        const response = await axios.delete(
          `${process.env.BASEURL}/deck/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('Delete Response:', response);
        fetchdata();
        Swal.fire('Deleted!', 'Your deck has been deleted.', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          error?.message ||
          'Unknown error';
        toast.error(`${errorMessage}`);
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
      }
    }
  };

  const itemList = currentItems.map((item, index) => {
    return {
      ...item,
      deck_type: `${item.deck_number}${item.id}`,
      "S/N": `${index + 1}`,
      name: item.name,
      barge: item.barge.name,
      user: `${item.user.first_name} ${item.user.last_name}`,
      created_at: `${formatDate(item.created_at)}`,
     status: item.status
     
    }
  })

  return (
    <div className="bg-white">
      <div className="overflow-x-auto mb-4">
         <DeckTable
           fetchedData={ currentItems}
           loadingStates={ loadingStates }
           handleDelete={handleDelete}
           handleEdit={ handleEdit }
           COLUMNS={[
             {
               Header: "S/N",
               accessor: "S/N"
           },
           {
               Header: "Deck No.",
                  accessor: "deck_type"
           },
           {
               Header: "Name",
               accessor: "name"
           },
           {
               Header: "Barge",
               accessor: "barge"
           },
           {
               Header: "Added By",
               accessor: "user"
           },
           {
               Header: "Staus",
               accessor: "status"
             },
             {
               Header: "Created On",
                  accessor: "created_at"
             }
            
             
           ]}
            MOCK_DATA={itemList}
        /> 
    
      </div>

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

export default DeckListTable;
