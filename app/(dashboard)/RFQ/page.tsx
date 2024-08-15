"use client";
import ProcurementCharts from "@/components/dashboard/charts/ProcurementCharts";
import ProcurementAddRequestModal from "@/components/procurement/ProcurementAddRequestModal";

import ProcurementModal from "@/components/procurement/ProcurementModal";
import { fetchProcurementChartDataApi } from "@/utils/apiServices/procurementApi";
import { procurementMenuList } from "@/utils/data";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FaBedPulse, FaBullseye } from "react-icons/fa6";
import { toast } from "react-toastify";

function Page() {
  const [openModal, setOpenModal] = useState(false);

const route = useRouter()

  const [selectedMenu, setselectedMenu] = useState("RFQS")

  
  const [isUIReady, setIsUIReady] = useState(false)

  
  const [year, setYear] = useState("")

  const handleClose = () => setOpenModal(!openModal)


  const fetchConsumablesData = useCallback(async () => {
    setIsUIReady(false)
     try {
       const [
         procurementDashboardResponse,
        
       ] = await Promise.all([
        fetchProcurementChartDataApi({year})
         
       ]);
       console.log('procurementResponse', procurementDashboardResponse);
       setIsUIReady(true)
      
       // You can similarly setStoreItems if needed
     } catch (error: any) {
      
       console.error('Error:', error);
 
       const errorMessage =
         error?.response?.data?.message ||
         error?.response?.data?.errors ||
         error?.message ||
         'Unknown error';
       toast.error(`${errorMessage}`);
     } finally {
      
     }
   }, [year, route]);

  if (!isUIReady) {
    return (
      <div className="h-screen flex  justify-center items-center">
         <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div> 
      </div>
    );
  }

  return (
    <div  className="relative">

        {/* show dark background */}
 {
    openModal &&   <div
    className="bg-black opacity-50 h-screen w-screen absolute top-0 bottom-0 z-10 overflow-hidden"
    />
 }
        {/* show dark background ends */}
      {/* chart sction starts */}
      <ProcurementCharts />
      {/* chart section nds */}
      {/* search field */}
      <div className="flex flex-row items-center justify-between mt-8">
        <div className="">
          <span className="text-black text-[32px] font-medium font-['Inter']">
            Request For Quotations(RFQs)
          </span>
        </div>
        <div
        onClick = {() => setOpenModal(!openModal)}
        className=" border border-[#1354d2]  rounded-[10px]  justify-center items-center  flex flex-row px-2 py-1 cursor-pointer ">
          
          <span className="text-[#1354d2] text-xl font-normal font-['Inter']">
           New Request
          </span>
        </div>
      </div>

      {/* search field ends */}

{/* menu list */}
<div className="flex flex-row w-full justify-between items-center mt-8 mb-4 space-x-4">
{
  procurementMenuList.map(menu => <div key={menu.key}
  onClick={() => setselectedMenu(menu.menuHeading)}
  className={ `${selectedMenu === menu.menuHeading ? "bg-[#1E1E1E]" : "bg-[#d9d9d9]"}  flex items-center justify-center flex-1 rounded-t-md h-[50px]`}
  >
    <span className="text-center text-white text-2xl font-medium font-['Inter']">
      {menu.menuHeading}
    </span>
  </div>)
}
</div>
{/* menu list ends */}


      {/* table section starts */}
      <div className="bg-[#d9d9d9]  py-4 border-t-2  border-t-[#D9D9D9]">

      </div>

      {/* table section ends */}


      {/* modal section starts */}
  
      <ProcurementModal
    isOpen = {openModal}
    title={"Request For Quotations"}
    onClose = {handleClose}
  >
  <ProcurementAddRequestModal />
  </ProcurementModal>

      {/* modal section ends */}
    </div>
  );

}

export default Page;
