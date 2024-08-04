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

const dieselUsageData = [
    { month: 'January', dieselUsed: 150 },
    { month: 'February', dieselUsed: 120 },
    { month: 'March', dieselUsed: 130 },
    { month: 'April', dieselUsed: 140 },
    { month: 'May', dieselUsed: 160 },
    { month: 'June', dieselUsed: 170 },
    { month: 'July', dieselUsed: 180 },
    { month: 'August', dieselUsed: 190 },
    { month: 'September', dieselUsed: 200 },
    { month: 'October', dieselUsed: 210 },
    { month: 'November', dieselUsed: 220 },
    { month: 'December', dieselUsed: 230 },
  ];
const  LineAndbarchart = () => {
    return (<ResponsiveContainer
   
        width="100%" height={400}>
          <ComposedChart
            width={500}
            height={400}
        data={dieselUsageData}
        margin={{ left: 20, bottom: 5 }}
           
            barGap={10}
          >
            <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="month" />
      
        <YAxis dataKey={"dieselUsed"} label={{ value: 'Count', position: 'insideTopLeft' }}
        
        />
            <Tooltip />
        <Legend
          iconType='circle'
          align='right'
          verticalAlign='top'
          content={() => { 
            return  <div className='flex flex-row justify-between items-center mb-4'>
            <span>
         
              Inventory Over Time
              </span>
              <div className='flex flex-roow items-center space-x-2'>
                <div className='flex flex-row items-center'>
                <RxDotFilled
                  color='green'
                  size={32}
                />
                  <span>
                    Inventory
                  </span>
                </div>
              <div className='flex-row flex items-center'>
              <RxDotFilled
                  color='blue'
                  size={32}
                />
                  <span>
                    Counts
                  </span>
                </div>
              </div>
           </div>
          }}
        /> 
            <Bar dataKey="dieselUsed" barSize={20} fill="green"
          radius={[20, 20, 20, 20]}
          
                
            />
            <Line type="monotone" dataKey="dieselUsed" stroke="blue" />
          </ComposedChart>
        </ResponsiveContainer>
      )
}
export default LineAndbarchart