import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { RxDotFilled } from "react-icons/rx";


const LineAndbarchart = ({
  inventoryOverTime
}: {
    inventoryOverTime: {
      months: string[]
    }
  }) => {
  
  const newObj = inventoryOverTime.months

  const countsArray = newObj && Object?.values(newObj);
   const monthArray = Object?.keys(newObj); 

    /* assigning each monnth to its value */
  
    const data = [];
    for (let index = 0; index < countsArray.length; index++) {
      const month = monthArray[index];
      const value = countsArray[index];
  
      data.push({
        month,
        counts:value,
      });
    }
   
  

  return (
    <div >
      { 
data.length > 0  ? 
<ResponsiveContainer

width="100%" height={400}>
<ComposedChart
width={500}
height={400}
data={data}
margin={{ left: 20, bottom: 5 }}
barGap={10}
>
<CartesianGrid stroke="#f5f5f5" />
<XAxis dataKey="month" />

 
<YAxis dataKey={"counts"} label={{ value: 'Counts', position: 'insideLeft', angle: -90  }}

/>
<Tooltip />
<Legend
iconType='circle'
align='right'
verticalAlign='top'
content={() => { 
return  <div className='flex flex-row justify-between items-center mb-4'>

<div className="flex flex-row justify-center items-center mb-4 ">
          <span className="text-center text-gray-500">
          Inventory Over Time
          </span>
        </div>

 <div className='flex flex-roow items-center space-x-2'>
   <div className='flex flex-row items-center'>
   <RxDotFilled
     color='green'
     size={32}
   />
     <span>
    
     </span>
     <span className="text-center text-gray-500">
          Inventory
          </span>
   </div>
 <div className='flex-row flex items-center'>
 <RxDotFilled
     color='blue'
     size={32}
   />
   <span className="text-center text-gray-500">
       Counts
     </span>
   </div>
 </div>
</div>
}}
/> 
<Bar dataKey="counts" barSize={20} fill="green"
radius={[20, 20, 20, 20]}
/>
<Line type="monotone" dataKey="counts" stroke="blue" />
</ComposedChart>
</ResponsiveContainer>: <div className='flex items-center justify-center'>
<span className='text-center text-gray-500'>
    No data found
</span>

</div>

      }


  </div>
      )
}
export default LineAndbarchart