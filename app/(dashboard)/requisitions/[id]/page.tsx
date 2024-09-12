'use client';
import Modal from '@/components/dashboard/Modal';
import ApproveRequisition from '@/components/requisitions/ApproveRequisition';
import DeclineRequisition from '@/components/requisitions/DeclineRequisition';
import ReleaseItem from '@/components/requisitions/ReleaseItem';
import RequisitionListTable from '@/components/requisitions/ReleaseListTable';
import RequisitionViewListTable from '@/components/requisitions/RequisitionViewTable';
import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
interface Requisition {
  id: number;
  indent_number: string;
  inventory_type: string;
  requested_by: string;
  created_at: string;
}
const Page = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([
    {
      id: 1,
      indent_number: 'fjfdj',
      inventory_type: 'Mainstore',
      requested_by: 'Amina',
      created_at: '',
    },
  ]);
  const [itemGroup, setItemGroup] = useState<any>({});
  const [materials, setMaterials] = useState([]);
  // useEffect(() => {
  //   const selectedRelease = localStorage.getItem('selectedRelease');
  //   if (selectedRelease) {
  //     console.log('first', JSON.parse(selectedRelease).materials);
  //     setItemGroup(JSON.parse(selectedRelease));
  //     setMaterials(JSON.parse(selectedRelease).materials);
  //   } else {
  //     setItemGroup(null); // or some default value like {}
  //   }
  // }, []);
  const { id } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };

  const [openDeclineModal, setOpenDeclineModal] = useState(false);

  const handleDeclineClose = () => {
    setOpenDeclineModal(false);
  };
  const [openReleaseModal, setOpenReleaseModal] = useState(false);

  const handleReleaseClose = () => {
    setOpenReleaseModal(false);
  };

  const [requisitionItem, setRequisitionItem] = useState<any>({});
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const fetchData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/requisitions/grouped-materials/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMaterials(response?.data?.data?.materials);
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      if (error?.response.status === 401) {
        router.push('/login');
      } else {
        toast.error(`${errorMessage}`);
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, id, router, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div>
      <div className=" mb-5 pb-10 border-b">
        <Link href="/requisitions">Back</Link>
        <p className="text-[32px] font-medium mt-3">Material Release</p>
        {/* <div className="flex items-center gap-2 w-2/5">
          <div className="w-4/5">
            <div className="w-full relative">
              <input
                type="search"
                placeholder="Search here..."
                className="bg-gray-50 pl-8 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              />
              <div className="absolute  flex bottom-0 top-0 justify-center items-center left-3 text-primary cursor-pointer">
                <FaSearch className="text-veriDark" />
              </div>
            </div>
          </div>

          <button className="bg-grey-400 border text-sm p-3 rounded-md">
            Add Filter
          </button>
        </div> */}
      </div>
      <div>
        <RequisitionViewListTable
          reqId=""
          data={materials || []}
          fetchData={() => {}}
          setOpenModal={setOpenModal}
          setOpenDeclineModal={setOpenDeclineModal}
          setRequisitionItem={setRequisitionItem}
          setOpenReleaseModal={setOpenReleaseModal}
        />

        <Modal title="" isOpen={openModal} onClose={handleClose} maxWidth="40%">
          <ApproveRequisition
            requisitionItem={requisitionItem}
            setOpenModal={setOpenModal}
            fetchData={fetchData}
          />
        </Modal>
        <Modal
          title=""
          isOpen={openDeclineModal}
          onClose={handleDeclineClose}
          maxWidth="40%"
        >
          <DeclineRequisition
            requisitionItem={requisitionItem}
            setOpenModal={setOpenDeclineModal}
            fetchData={fetchData}
          />
        </Modal>

        <Modal
          title=""
          isOpen={openReleaseModal}
          onClose={handleReleaseClose}
          maxWidth="40%"
        >
          <ReleaseItem
            requisitionItem={requisitionItem}
            setOpenModal={setOpenReleaseModal}
            fetchData={fetchData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Page;
