"use client"

import React, { useEffect, useState } from 'react';
import Areachart from '@/components/dashboard/charts/Areachart';
import Barchart from '@/components/dashboard/charts/Barchart';
import LineAndbarchart from '@/components/dashboard/charts/LineAndBarchart';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { fetchDashboardDataApi } from '@/utils/apiServices/dashboard';
import { toast } from 'react-toastify';
import { categoryCountType, consumableCountType, DashboardCardType, sparePartCountType } from '@/utils/types';
import TopTenInnventories from '@/components/dashboard/charts/TopTenInnventories';
import Image from 'next/image';
import { months } from '@/utils/data';
import InventoryRequisitionAnalysis from '@/components/dashboard/charts/InventoryRequisitionAnalysis';



const page = () => {


  const [dashboardData, setDashboardData] = useState<DashboardCardType[] | []>([])
 const [requisitionApprovedByMonth, setRequisitionApprovedByMonth] = useState<string[] | []>([])
  const [inventoryOverTime, setInventoryOverTime] = useState<{
    months: string[]
  } | null>(null)

  const [isUIReady, setIsUIReady] = useState(false)
  const [consumableCounts, setConsumableCounts] = useState<consumableCountType | null>(null)
  const [sparePartCounts, setSparePartCounts] = useState< sparePartCountType  | null>(null)
  const [categoryCounts, setCategoryCounts] = useState< categoryCountType  | null>(null)


/* 


inventory_data
: 
category_counts
: 
DeckConsumable
: 
Greases
: 
0
Paintings
: 
0
Peripherials
: 
0
Ropes
: 
0
[[Prototype]]
: 
Object
EngineConsumable
: 
{Electrical: 0, Mechanical: 0, Pnuematic: 0, Hydraulic: 0, Oils & Greases: 0, …}
GalleyLaundryConsumable
: 
{Mess: 0, Kitchen: 0, Laundry: 0}
HospitalConsumable
: 
{Drugs: 0, Injections: 0}
SafetyConsumable
: 
{Main Deck: 0, Auxillary: 0}
SparePartDeck
: 
{radar: 0, radios: 0, monitors, tvs, printers: 0, ropes and wires: 0, brush and painting: 0}
SparePartEngine
: 
{generator: 0, huisman crane: 0, tensioner and A&R wrench: 0, davits: 0, lineup station: 0, …}
SparePartHospital
: 
{mattress/bed: 0, respirators: 0}
SparePartSafety
: 
{gas de
*/


  useEffect(() => {
  const handleFetchData =   async() => { 
    try {
      const response = await fetchDashboardDataApi() 
      if (response.status)
      { 
        const { message, data } = response
        toast.success(message)
        console.log("dd", message, data)

 
        const { 
          total_inventory,
          total_project_inventory,
          total_project_consumable_inventory, 
          total_project_sparepart_inventory,
          total_requisitions,
          total_approved_requisitions,
          total_miv_inventory,
          total_miv_sparepart_inventory,
          total_miv_consumable_inventory,
          percentage_change_total_inventory,
          consumable_counts,
          spare_part_counts,
          category_counts

        } = data.inventory_data

  setCategoryCounts(category_counts)
        setConsumableCounts(consumable_counts)
        setSparePartCounts(spare_part_counts)
        
        const {total_items_received, percentage_change } = data.total_items_received_data
      
  setRequisitionApprovedByMonth(data.requisition_data.approved_requisitions_by_month)
      setInventoryOverTime(data.filtered_inventory_data)
 
        setDashboardData([
          {
            stockCountAmount: total_inventory,
            stockCountPercent: percentage_change_total_inventory,
            inventoryAmount: total_project_inventory,
            sparePartInventory: total_project_sparepart_inventory,
            consumablesInventory: total_project_consumable_inventory,
            materialRequisitionAmount: total_requisitions,
            totalApprovedMaterial: total_approved_requisitions,
            mivAmount: total_miv_inventory,
            mivConsumables: total_miv_consumable_inventory,
            mivSperePart: total_miv_sparepart_inventory,
            materialReceivedAmount: total_items_received,
            materialReceivedPercent: percentage_change

          }
        ])
        
     setIsUIReady(true)
      
      }
      
    } catch (error: any) {
      setIsUIReady(false)
      const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.errors ||
      error?.message ||
      'Unknown error';
    toast.error(`${errorMessage}`);
    }
  }
  
    handleFetchData()


  }, [])
  
  if (!isUIReady) { 
 return   <div className='h-screen w-screen flex  justify-center items-center'>
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin">
        </div>
     </div>
  }



  return <div style={{
    backgroundColor: "rgb(244,245,246)"
  }}>
    {/* gilter section start */}
    
    <div className='flex flex-row justify-end items-center space-x-2 mb-4'>
      <Image
        src={"/icons/filterPic.png"}
        alt='filter'
        className='w-[27px] h-[30px]'
        width={27}
        height={30}
        objectFit='contain'
      
      />
      <select name="" id=""  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3">
        <option>month</option>
        { 
          months.map(item => <option key={item} value={item}>{ item}</option>)
        }
      </select>
      <select name="" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3">
        <option value="">Year</option>
        <option value="">2024</option>
       </select>
  </div>

    {/* filter section ends */}
    {/* card sectio starts */}
    <div className='mb-4'>
      { 
dashboardData.length > 0 &&  <DashboardCard
{
...dashboardData[0]
}
/>

      }
    </div>
    {/* card section ends */}

    {/* chart section starts */}
    
    <div className='grid grid-cols-12 gap-2 mb-4'>
   
      <div className='col-span-12 lg:col-span-8 gap-2'>
        <div className='grid grid-cols-12 gap-2 mb-[8px]'>
          <div className='col-span-12 lg:col-span-6  rounded-[23px] p-2 border-[1.2px] border-slate-300'>
           
            {
            inventoryOverTime &&  <LineAndbarchart
            inventoryOverTime={inventoryOverTime}
              />
            }
          </div>
          <div className='col-span-12 lg:col-span-6  rounded-[23px] p-2 border-[1.2px] border-slate-300'>
            <Areachart
               requisitionApprovedByMonth={requisitionApprovedByMonth}
            
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-2'>
          <div className=' col-span-12 lg:col-span-6  rounded-[23px] p-2 border-[1.2px] border-slate-300'>
         

            { 

        consumableCounts && sparePartCounts &&  <Barchart
        consumable_counts={consumableCounts}
        spare_part_counts={sparePartCounts}
      />
              
            }
          </div>
          <div className='col-span-12 lg:col-span-6  rounded-[23px] p-2 border-[1.2px] border-slate-300'>
            { 
              categoryCounts &&  <InventoryRequisitionAnalysis
              categoryCounts={ categoryCounts}
            />

            }
          </div>
        </div>
      
     
      
   
      </div>
      <div className='col-span-12  lg:col-span-4 gap-2  rounded-[23px] p-2 border-[1.2px] border-slate-300'>
   <TopTenInnventories />
      </div>
    
      
    </div>

   
    
    {/* chart sectio ends */}
  </div>;
};

export default page;
