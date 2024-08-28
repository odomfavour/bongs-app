'use client';

import {
  displayBargeValue,
  toggleLocationModal,
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
import LocationTable from '../AppComp/LocationTable';
import InventoryDbTable from '../AppComp/InventoryDbTable';

interface Deck {
  id: number;
  name: string;
  deck_number: string;
  deck_type: string;
}
interface Location {
  id: number;
  name: string;
  location_number: string;
  address: string;
  deck: Deck;
  status: string;
  created_at: string;
}

interface SparePart {
  id: number;
}

interface Inventory {
  id: number;
  description: string;
  quantity: number;
  threshold: string;
  part_number: string;
  model_number: string;
  model_grade: string;
  location: Location;
  stock_quantity: number;
  project_id: number;
  spare_part_category: SparePart;
  consumable_engine_category_id: number;
  sparepart_engine_category_id: number;
  consumable_deck_category_id: number;
  sparepart_deck_category_id: number;
  consumable_safety_category_id: number;
  sparepart_safety_category_id: number;
  consumable_hospital_category_id: number;
  consumable_category_id: number;
  sparepart_hospital_category_id: number;
}

interface LocationListTableProps {
  data: Inventory[];
  fetchData: () => void;
}

const InventoryDbListTable: React.FC<LocationListTableProps> = ({
  data,
  fetchData,
}) => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<any>(null);

  const toggleDropdown = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const hasPermission = (permissionName: string) =>
    user?.permissions?.some(
      (permission: any) => permission.name === permissionName
    );

  const itemList = currentItems.map((item, index) => {
    return {
      ...item,
      description: `${item.description}`,
      'S/N': `${index + 1}`,
      quantity: `${item.stock_quantity || ''}`,
      threshold: `${item?.threshold || ''}`,
      part_number: `${item?.part_number || ''} `,
      model_number: `${item?.model_number || item?.model_grade}`,
      location: `${item?.location?.name}`,
      'Inventory Type': `${
        !item?.spare_part_category ? 'Consumeable' : 'Spare part'
      }`,
    };
  });

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <InventoryDbTable
          fetchedData={currentItems}
          hasPermission={hasPermission}
          COLUMNS={[
            {
              Header: 'S/N',
              accessor: 'S/N',
            },

            {
              Header: 'Description',
              accessor: 'description',
            },
            {
              Header: 'Quantity',
              accessor: 'quantity',
            },
            {
              Header: 'Threshold',
              accessor: 'threshold',
            },
            {
              Header: 'Part Number',
              accessor: 'part_number',
            },
            {
              Header: 'Model Number',
              accessor: 'model_number',
            },
            {
              Header: 'Location',
              accessor: 'location',
            },
            {
              Header: 'Inventory Type',
              accessor: 'Inventory Type',
            },
          ]}
          MOCK_DATA={itemList}
        />
      </div>
    </div>
  );
};

export default InventoryDbListTable;
