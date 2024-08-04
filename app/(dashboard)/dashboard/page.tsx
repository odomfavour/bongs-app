"use client"

import React, { useEffect, useState } from 'react';
import Areachart from '@/components/dashboard/charts/Areachart';
import Barchart from '@/components/dashboard/charts/Barchart';
import LineAndbarchart from '@/components/dashboard/charts/LineAndBarchart';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { fetchDashboardDataApi } from '@/utils/apiServices/dashboard';
import { toast } from 'react-toastify';
import { DashboardCardType } from '@/utils/types';



const page = () => {


  const [dashboardData, setDashboardData] = useState<DashboardCardType[] | []>([])


/*   

total_inventory
: 
36
total_miv_consumable_inventory
: 
0
total_miv_inventory
: 
0
total_miv_sparepart_inventory
: 
0
total_project_consumable_inventory
: 
6
total_project_inventory
: 
23
total_project_sparepart_inventory
: 
17
year
: 
2024

stockCountAmount = 5000,
  stockCountPercent = 15,

  inventoryAmount = 5000,
  sparePartInventory = 200,
  consumablesInventory = 150,

  materialReceivedAmount = 800,
  materialReceivedPercent = 15,

  materialRequisitionAmount = 4000,
  totalApprovedMaterial = 100,

  mivAmount = 800,
  mivConsumables = 250,
  mivSperePart = 130, */
/* 

consumable_counts
: 
{Engine: 3, Deck: 1, Hospital: 1, Safety: 1, GalleyLaundry: 1}
month
: 
null
percentage_change_consumable
: 
-100
percentage_change_sparepart
: 
-100
percentage_change_total_inventory
: 
-100
spare_part_counts
: 
{Engine: 22, Deck: 1, Hospital: 6, Safety: 0}
total_inventory
: 
36
total_miv_consumable_inventory
: 
0
total_miv_inventory
: 
0
total_miv_sparepart_inventory
: 
0
total_project_consumable_inventory
: 
6
total_project_inventory
: 
23
total_project_sparepart_inventory
: 
17
year
: 
2024
[[Prototype]]
: 
Object
most_used_inventory_data
: 
{most_used_inventory: Array(0)}
requisition_data
: 
approved_requisitions_by_month
: 
{January: 0, February: 0, March: 0, April: 0, May: 0, …}
total_approved_requisitions
: 
0
total_requisitions
: 
4
[[Prototype]]
: 
Object
total_items_received_data
: 
percentage_change
: 
0
total_items_received
: 
0

*/




  useEffect(() => {
    (async() => { 
    try {
      const response = await fetchDashboardDataApi() 
      if (response.status) { 
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
          percentage_change_total_inventory
        } = data.inventory_data

        const {total_items_received, percentage_change } = data.total_items_received_data
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
        
   
      }
      
    } catch (error: any) {
      const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.errors ||
      error?.message ||
      'Unknown error';
    toast.error(`${errorMessage}`);
    }
    })()


  }, [])
  




  return <div>
   
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
    
    <div className='grid grid-cols-12'>
   
      <div className='col-span-8 '>
        <div className='grid grid-cols-12'>
          <div className='col-span-6'>
          <LineAndbarchart />
          </div>
          <div className='col-span-6'>
          <Areachart />
          </div>
        </div>
        <div className='grid grid-cols-12'>
          <div className='col-span-6'>
            <div className='flex flex-col items-center justify-center'>
              <span>Inventory Movement</span>
              <div className='flex flex-row justify-center items-center space-x-2'>
                <span className='flex-row flex space-x-1'>
                  <input type="radio" name='choose' id='sparePart'/>
                  <label htmlFor='sparePart'>
                    Spare Parts
                  </label >
                </span>
                <span className='flex flex-row space-x-1'>
                  <input type="radio" name='choose' />
                  <label htmlFor=''>
                   Consumables
                  </label>
                </span>
              </div>
            </div>
        <Barchart />
          </div>
          <div className='col-span-6'>
      
          </div>
        </div>
      
     
      
   
      </div>
      <div className='col-span-4'>

      </div>
    
      
    </div>

   
    
    {/* chart sectio ends */}
  </div>;
};

export default page;
