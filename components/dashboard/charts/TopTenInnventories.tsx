import { topTenInnventries } from '@/utils/data'
import React from 'react'

function TopTenInnventories() {

    const onlyAmountArray =topTenInnventries.map(item => item.value)
    const totalAmount =  onlyAmountArray.reduce((initial, accu) => { 
  return initial + accu
    },0)
    const percentagePerItem = topTenInnventries.map(item => { 
  
        const persent = ((item.value) / totalAmount) * 100
        return persent
    })
    const totalAmount3 =  percentagePerItem.reduce((initial, accu) => { 
        return initial + accu
          },0)
 /*  console.log("percenntage",percentagePerItem, totalAmount, totalAmount3) */
  return (
    <div>
      <div>
      TopTenInnventories
      </div>
    
    </div>
  )
}

export default TopTenInnventories