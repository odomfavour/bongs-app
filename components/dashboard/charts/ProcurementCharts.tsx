import React from "react";
import { RxDotFilled } from "react-icons/rx";

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
} from "recharts";


const COLORS = ["#96f2d7", "#c69cf4", "#ffc9c9"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: string;
  cy: string;
  midAngle: string;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const data2 = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];




function ProcurementCharts({
rfq_status,
year,
total_budget,
allBidData
}: {
rfq_status: {
  expired: number,
  sent: number,
  responded: number
},
year: string,
total_budget: number,
allBidData: any[]
}) {

  console.log("data for rfq", rfq_status)

  const data = [
    { name: "Pending", value: rfq_status.sent || 10 },
    { name: "Responded", value: rfq_status.responded  || 10 },
    { name: "Expired", value: rfq_status.expired  || 10 },
  ];
  

  return (
    <div className="flex flex-row justify-between space-x-8 h-[40vh]">
         <div className="flex-1 p-[7.42px]  rounded-lg justify-center items-center shadow inline-flex bg-white">

        <ResponsiveContainer width="100%" height={"90%"}>
          <LineChart
            width={400}
            height={400}
            data={data2}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 flex-col p-[7.42px]  rounded-lg justify-center items-center shadow inline-flex h-full bg-white">
      <p className="text-black text-left text-[13.04px] font-semibold font-['Inter']">Total RFQ’s Status</p>
        <ResponsiveContainer width={"100%"} height={'90%'} >
         <PieChart>
            <Pie
              data={data}
              outerRadius={"80%"}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
            
              fill="#8884d8"
              dataKey="value"
              height={'80%'}
            
              
            >
              <Tooltip />
              <Legend
                iconType='circle'
                align='right'
                verticalAlign='bottom'
              
              /> 
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="mx-auto flex-row flex space-x-4 items-center">
          <div className="flex flex-row space-x-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#96f2d7]" />

            <span className="text-black text-sm font-medium font-['Inter']">
              Pending
            </span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#c69cf4]" />

            <span className="text-black text-sm font-medium font-['Inter']">
             Responded
            </span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#ffc9c9]" />

            <span className="text-black text-sm font-medium font-['Inter']">
            Expired
            </span>
          </div>
        </div>
      
      </div>
      <div className="flex-1 flex-col p-[7.42px]  rounded-lg justify-center items-center shadow inline-flex bg-white h-full">
     {/* {
      allBidData.length > 0 ?  <p className="text-black text-start text-[13.04px] font-semibold font-['Inter']">Updates</p> :
       <div className="flex items-center justify-center">
        <p className="text-black text-start text-lg font-semibold font-['Inter']">
          No Bid found
        </p>
       </div>
     } */}
      <div className="flex items-center justify-center">
        <p className="text-black text-start text-lg font-semibold font-['Inter']">
          No Bid found
        </p>
       </div>
       
       
      
      </div>
   
    </div>
  );
}

export default ProcurementCharts;
