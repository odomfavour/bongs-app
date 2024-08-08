import { categoryCountType } from '@/utils/types'
import React, { useState } from 'react'
import { RxValue } from 'react-icons/rx'

function InventoryRequisitionAnalysis({ 
    categoryCounts
}: {
    categoryCounts: categoryCountType
  }) {
  
  
  
 
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)

    const [selectConsumableCount, setSelectConsumableCount] = useState(false)

    const [dataToDisplay, setdataToDisplay] = useState<any[] | []>([])
    

    const categoryCountKeys = Object.keys(categoryCounts);
    const categoryCountValues = Object.values(categoryCounts);

    
  return (
    <div>
          {/* header section starts */}
          

          <div className="flex flex-col items-center  mb-2">
        <span className='text-center text-gray-500'>Inventory to Requisition Analysis</span>
              <div className='flex flex-row justify-around  items-center mt-2 w-full'>
              <div className="flex lg:flex-col flex-row  items-center space-x- lg:space-x-0">
          <span className="flex-row flex  space-x-1">
            <input
               onClick={() => setSelectConsumableCount(false)} 
              defaultChecked
              type="radio"
              name="choose"
              id="sparePart"
            />
              <label htmlFor="sparePart" >
                <span className='text-center text-gray-500'>
                Spare Parts
                </span>
            </label>
          </span>
          <span className="flex flex-row space-x-1">
            <input
           
              onClick={() => setSelectConsumableCount(true)} 
              type="radio"
              name="choose"
            />
              <label htmlFor="" className='text-center text-gray-500'>
                <span className='text-center text-gray-500'>
                Consumables
                </span>
               </label>
          </span>
                  </div>   
                  <div>
                      <select
                         value={selectedCategoryIndex} 
                          onChange={(e) => {
                         /*      setSelectedCategoryIndex(Number(e.target.value))  */
                          }}
                          name="" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  p-1">

                       { 
                              categoryCountKeys.map((item, index) => <option className='text-center text-gray-500' key={index} value={ index }>{ item }</option> )

                          }
                       
                      </select>
                  </div>
     </div>
      </div>
          {/* header section sends */}
          {/* body sectionn starts */}

          {/* body section ends */}
    </div>
  )
}

export default InventoryRequisitionAnalysis