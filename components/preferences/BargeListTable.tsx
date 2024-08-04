'use client';

// import { EmptyProductIcon } from '@/utils/utils';
import Image from 'next/image';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass, FaRegFolderClosed } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import { TbDotsCircleHorizontal } from 'react-icons/tb';
import { formatDate } from '@/utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  displayBargeValue,
  toggleAddBargeModal,
} from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AppTable from '../AppComp/AppTable';
import { Barge } from '@/utils/types';




interface BargeListTableProps {
  data: Barge[];
  fetchdata: () => void;
}


const BargeListTable: React.FC<BargeListTableProps> = ({ data, fetchdata }) => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reverse the data array
  // const reversedData = [...data].reverse();

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
          `${process.env.BASEURL}/barge/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log('Delete Response:', response);
        // toast.success(`${response?.data?.message}`);
        fetchdata();

        if (response.status === 200) {
          // Handle success
          Swal.fire('Deleted!', 'Your barge has been deleted.', 'success');
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Delete Error:', error);
        // Handle error
        Swal.fire('Error!', 'There was a problem deleting the barge.', 'error');
      } finally {
        setLoadingStates((prevState) => ({ ...prevState, [id]: false }));
      }
    }
  };


  const handleEdit = (item: Barge) => {
    dispatch(displayBargeValue(item));
    dispatch(toggleAddBargeModal());
  };

  const itemList = currentItems.map((item, index) => {
    return {
      ...item,
      barge_number: `${item.barge_number}${item.id}`,
      "S/N": `${index + 1}`,
      
      created_at: `${formatDate(item.created_at)}`,
      added_by: `${item.user.first_name} ${item.user.last_name}`,
     
    }
  })


  return (
    <div className="bg-white">
      <div className="overflow-x-auto mb-4">
          <AppTable
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
                Header: "Barge No",
                   accessor: "barge_number"
            },
            {
                Header: "Name",
                accessor: "name"
            },
            {
                Header: "Rooms",
                accessor: "rooms"
            },
            {
                Header: "Stores",
                accessor: "store_location"
            },
            {
                Header: "Deck Level",
                accessor: "deck_level"
              },
              {
                Header: "Added By",
                   accessor: "added_by"
              },
              {
                Header: "Status",
                accessor: "status"
              },
              {
                Header: "Created On",
                accessor: "created_at"
              },
              
            ]}
             MOCK_DATA={itemList}
          /> 
        
        
       
      </div>

     {/*  {data.length > itemsPerPage && (
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

export default BargeListTable;
