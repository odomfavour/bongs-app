import { topTenInnventries } from '@/utils/data'
import { mostUsedInventoryPropType } from '@/utils/types'
import React from 'react'

function TopTenInnventories({ 
  data
}: mostUsedInventoryPropType) {


  /* creat an array containing only the counts and also containning only the category_name */
  const countArray = data.map(item => item.count)
  const categoryName = data.map(item => item.category_name)

  /* create an array containg only the values of the countArray */

  const countArrayKeys = Object?.values(countArray)
  
  /* get the height value from the countArrayKeys */

  const maximumCountValue = Math.max(...countArrayKeys)

  /* calculated the percentage of other counts in the array with respect to the maximum value */
  
 const countPercentArray = countArrayKeys.map(count => {
    const countPercent = (count / maximumCountValue) * 100
    return countPercent
  })


  
  /* create an array that gets the category name, countPercent and count actual value */
  let categoryNameCountPercentCountValueArray = []
  for (let index = 0; index < countArrayKeys.length; index++) {
    categoryNameCountPercentCountValueArray.push({
      categoryName: categoryName[index],
      countPercent: countPercentArray[index],
      countValue: countArrayKeys[index],
      key: index
    })
    
  }

  
  return (
    <div className="flex-1  justify-center items-center   h-full">
     <div className="flex flex-row justify-center items-center mb-4 text-gray-500 ">
                  <span className="text-center">
                   Top 10 Used Inventories
                  </span>
      </div>
      { 
     categoryNameCountPercentCountValueArray.length > 0 ?  <div className='flex-1 overflow-y-scroll'>
     { 
       categoryNameCountPercentCountValueArray.map(item => <div key={item.key} className='flex flex-row items-center space-x-2 space-y-2 px-4'>
         <span className=' text-gray-500 w-2/6 block text-left '>
           { item.categoryName}
         </span>
         <div className='flex flex-row items-center space-x-2 flex-1'>
           <div className={`bg-[#08981FCC] h-[28px]`}
             style={{
               width: `${item.countPercent}%`
             }}
           />
         <span className=''>
           { 
             item.countValue
             }
            
         </span>
        </div>
       </div>)
     }
        </div> : <div className='flex items-center justify-center'>
        <span className='text-center text-gray-500'>
            No data found
   </span>

        </div>
      }
    
    </div>
  )
}

export default TopTenInnventories