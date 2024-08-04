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
} from 'recharts';

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
            data={dieselUsageData }
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            barGap={10}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="month" />
            <YAxis dataKey={"dieselUsed"} />
            <Tooltip />
            <Legend />
            <Bar dataKey="dieselUsed" barSize={20} fill="green"
                radius={[20, 20, 20, 20]}
                
            />
            <Line type="monotone" dataKey="dieselUsed" stroke="green" />
          </ComposedChart>
        </ResponsiveContainer>
      )
}
export default LineAndbarchart