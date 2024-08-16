"use client";
import BIDTable from "@/components/AppComp/BIDTable";
import RFQTable from "@/components/AppComp/BIDTable";
import ProcurementCharts from "@/components/dashboard/charts/ProcurementCharts";
import Modal from "@/components/dashboard/Modal";
import ProcurementAddRequestModal from "@/components/procurement/ProcurementAddRequestModal";

import ProcurementModal from "@/components/procurement/ProcurementModal";
import { fetchAllBidDataApi, fetchAllRfqDataApi, fetchProcurementChartDataApi } from "@/utils/apiServices/procurementApi";
import { procurementMenuList } from "@/utils/data";
import { currencyFormatter } from "@/utils/usefulFunc";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FaBedPulse, FaBullseye } from "react-icons/fa6";
import { toast } from "react-toastify";

function Page() {
  const [openModal, setOpenModal] = useState(false);

const route = useRouter()

  const [selectedMenu, setselectedMenu] = useState("RFQS")

  
  const [isUIReady, setIsUIReady] = useState(false)
  const [rfqStatus, setRfqStatus] = useState<
  {
    expired: number,
    sent: number,
    responded: number
  }>(
    {
      expired: 0,
      sent: 0,
      responded: 0
    }
  )
  const [totalBudget, setTotalsBudget] = useState< number>(0)


  const [allBidData, setAllBidData] = useState<any[]>([])


  const [allRfq, setAllRfq] = useState<any[]>([])

  
  const [year, setYear] = useState("")

  const [yearFormServer, setYearFromServer] = useState<string>("")

  const handleClose = () => setOpenModal(!openModal)


  const fetchProcurementsData = useCallback(async () => {
    setIsUIReady(false)
     try {
       const [
         procurementDashboardResponse,
         allRfqData,
         allBidData
        
       ] = await Promise.all([
        fetchProcurementChartDataApi({year}),
        fetchAllRfqDataApi(),
        fetchAllBidDataApi()
         
       ]);
       console.log('procurementResponse', procurementDashboardResponse, "all rfq", allRfqData, "allBidData", allBidData);
       setAllBidData(allBidData.data.data)
       setAllRfq(allRfqData.data.data)

 

       const {
        data,
        status
       } = procurementDashboardResponse
       if(status){
              const {rfq_status, total_budget, year} = data
              setRfqStatus( {
                expired: rfq_status.expired,
                sent: rfq_status.sent,
                responded:rfq_status.responded
              })
              setTotalsBudget(total_budget)
              setYearFromServer(year)
       }
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
   }, [year]);


   console.log("all allRfq", allRfq)

   useEffect(() => {
    fetchProcurementsData()
   },[year, route, fetchProcurementsData])

  if (!isUIReady) {
    return (
      <div className="h-screen flex  justify-center items-center">
         <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div> 
      </div>
    );
  }

  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }

const  itemListRFQ = allRfq.map(item => {
  return {
      rfqId: `RFQ ${item.id}`,
      title:item.title ,
      type: item.procurement_type,
      status: item.status,
      budget: `${item.currency}${currencyFormatter(item.budget)}`,
      date: item.bidding_deadline
  }
})


const  itemListBid = allRfq.map(item => {
  return {
      rfqId: `RFQ ${item.id}`,
      title:item.title ,
      noOfBirds: item.bid_count,
      status: item.status,
      awardedBirds: 0,
      performanceInvoice: 0,
      deadline: item.bidding_deadline
  }
})

  return (
    <div  className=" bg-[#f8f8f8]">

        {/* show dark background */}

        {/* show dark background ends */}
      {/* chart sction starts */}
      <ProcurementCharts
      rfq_status={rfqStatus}
      total_budget={totalBudget}
      year={yearFormServer}
      allBidData={allBidData}
      />
      {/* chart section nds */}
      {/* search field */}
      <div className="flex flex-row items-center justify-between mt-8">
        <div className="">
        <span className="text-black text-[32px] font-medium font-['Inter']">
          
            {
        selectedMenu === "RFQS" && `Request For Quotations(RFQs)`
      
        }
          {
         selectedMenu === "Bids" && `Bids Evaluation `
      }
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
  className={ `${selectedMenu === menu.menuHeading ? "bg-[#1E1E1E]" : "bg-[#d9d9d9]"} cursor-pointer  flex items-center justify-center flex-1 rounded-t-md min-h-[50px]`}
  >
    <span className="text-center text-white text-2xl font-medium font-['Inter']">
      {menu.menuHeading} 
      {
        menu.menuHeading === "RFQS" && `(${allRfq.length})`
        }
      {
          menu.menuHeading === "Bids" && `(${allBidData.length})`
      }
    
    </span>
  </div>)
}
</div>
{/* menu list ends */}





      {/* table section starts */}
    

      {/* table section ends */}

     {
     selectedMenu === "RFQS" &&  
     <RFQTable
     fetchedData={allRfq}
   
     handleOpenModal = {handleOpenModal}
    
     COLUMNS={[
       {
         Header: "RFQ ID",
         accessor: "rfqId"
     },
     {
         Header: "Title",
            accessor: "title"
     },
     {
         Header: "Type",
         accessor: "type"
     },
     {
         Header: "Budget",
         accessor: "budget"
     },
     {
         Header: "Status",
         accessor: "status"
     },
     {
         Header: "Date",
         accessor: "date"
       }
      

     ]}
      MOCK_DATA={itemListRFQ}
  /> 


     }
        {

          selectedMenu  === "Bids" && <BIDTable
          fetchedData={allBidData}
         
          handleOpenModal = {handleOpenModal}
         
          COLUMNS={[
            {
              Header: "RFQ ID",
              accessor: "rfqId"
          },
          {
              Header: "Title",
                 accessor: "title"
          },
          {
              Header: "No. Of Birds",
              accessor: "noOfBirds"
          },
          {
              Header: "Status",
              accessor: "status"
          },
          {
              Header: "Awarded Bids",
              accessor: "awardedBids"
          },
          {
              Header: "Performance Invoice",
              accessor: "performanceInvoice"
            },
            {
              Header: "Deadline",
                 accessor: "deadline"
            }
           
   
          ]}
           MOCK_DATA={itemListBid}
        
        />
        }
      {/* modal section starts */}
  
      <Modal
    isOpen = {openModal}
    title={"Request For Quotations"}
    onClose = {handleClose}
    maxWidth="900px"
  >
  <ProcurementAddRequestModal />
  </Modal>

      {/* modal section ends */}
    </div>
  );

}

export default Page;
