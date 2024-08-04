import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const data = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 20 },
    { month: 'Mar', value: 50 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 60 },
];

function Areachart() {
    return (
        <div className='px-4 flex flex-row items-center justify-center'>
          
    <ResponsiveContainer width="100%" height={400}>
        
          <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis dataKey={"value"} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#BFBEB9" fill="#FEFBF4" />
         </AreaChart>
            </ResponsiveContainer>
            </div>
  )
}

export default Areachart