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

    console.log("this are the category counnts values", categoryCountKeys, categoryCountValues, Math.max(...categoryCountValues), "seletec Index", selectedCategoryIndex)
    

   /*  const createChild = () => { 
        const selectedCategoryKey = Object.keys(categoryCountValues[selectedCategoryIndex])
        const selectedCategoryValue = Object.values(categoryCountValues[selectedCategoryIndex]) as number[]
        const maxValue = Math.max(...selectedCategoryValue)

        const data =[]
   for (let index = 0; index < selectedCategoryKey.length; index++) {
       data.push({
        name: selectedCategoryKey[index],
        value: selectedCategoryValue[index]
    } ) 
    
   }
        setdataToDisplay(data)
        console.log("this is the max value", maxValue)

        

    }
    createChild() */
    
  return (
    <div>
          {/* header section starts */}
          

          <div className="flex flex-col items-center  mb-2">
        <span>Inventory to Requisition Analysis</span>
              <div className='flex flex-row justify-around lg:justify-between items-center mt-2 w-full'>
              <div className="flex flex-row items-center space-x-1">
          <span className="flex-row flex space-x-1">
            <input
              onClick={() => setSelectConsumableCount(false)}
              defaultChecked
              type="radio"
              name="choose"
              id="sparePart"
            />
            <label htmlFor="sparePart">Spare Parts</label>
          </span>
          <span className="flex flex-row space-x-1">
            <input
           
              onClick={() => setSelectConsumableCount(true)}
              type="radio"
              name="choose"
            />
            <label htmlFor="">Consumables</label>
          </span>
                  </div>   
                  <div>
                      <select
                         value={selectedCategoryIndex} 
                          onChange={(e) => {
                              setSelectedCategoryIndex(Number(e.target.value)) 
                          }}
                          name="" id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-1">

                          { 
                              categoryCountKeys.map((item, index) => <option key={index} value={ index }>{ item }</option> )

                          }
                        
                      </select>
                  </div>
     </div>
      </div>
          {/* header section sends */}

         {/*  <div className='flex flex-col space-y-1'>
          { 
              
              dataToDisplay.map((item, index) => <div className='flex flex-row '>
                  <span>
                      {item.name}
                      
                  </span>
                  <div className={`w-[${item.value}] h-[16px] bg-blue-400`} />
                  <span>
                      {item.value}
                      
                  </span>
                      
                 
              </div>)
          }
        </div> */}
          {/* body sectionn starts */}

          {/* body section ends */}
    </div>
  )
}

export default InventoryRequisitionAnalysis