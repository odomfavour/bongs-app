import CustomTooltip from "@/components/AppComp/CustomToolTip";
import { dateFormaterRelative } from "@/utils/usefulFunc";
import { constants } from "buffer";
import Link from "next/link";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useMediaQuery } from 'react-responsive';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";




const COLORS = ["#08981F", "#D8FAE7", "#FFF2DC"];

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



function MaterialRequisitionAnalysisChart({
  materialReleaseStatus
 
}: {
  materialReleaseStatus: {
    totalMaterialReleased: number;
    totalRequisitionReceived: number;
    totalRequisitionMade: number;
  } | null

}  ) {

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });


  if( materialReleaseStatus === null){
 return <div className="">
       <p>No data found</p>
 </div>
  }
  const data = [
    { name: "Total Requisition Released", value: materialReleaseStatus.totalMaterialReleased },
    { name: "Total Requisition Received", value: materialReleaseStatus.totalRequisitionReceived },
    { name: "Total Requisition Made", value:materialReleaseStatus.totalRequisitionMade },
  ];
 


  console.log("data from inner material chart", data)




  return (
    <div className="">
    
      <div className="flex-1 flex flex-row     justify-center items-center h-full bg-white">
     
        {
        data[0].value === 0 &&  data[0].value === 0  && data[0].value === 0 ? <div className="flex-1 flex flex-col justify-center items-center h-full">
          
          <p className="text-gray-500  mb-4 font-['Inter'] text-center ">
       Material Requisitions Analysis
       </p>
          <p className="text-gray-500 text-sm mb-4 font-['Inter'] text-center ">No data found</p>
        </div>:  <div>
            <div className="ml-2">
      
          <div className="flex flex-row space-x-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#08981FB2]" />

            <span className="text-gray-500 text-sm font-medium font-['Inter']">
              Total Material Released
            </span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#D8FAE7]" />

            <span className="text-gray-500 text-sm font-medium font-['Inter']">
            Total Requisition Received
            </span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <span className="w-3 h-3 rounded-full bg-[#FFF2DC]" />

            <span className="text-gray-500 text-sm font-medium font-['Inter']">
            Total Requisition Made
            </span>
          </div>
        </div> 

        <ResponsiveContainer width={400} height={400}>
          <PieChart>
            <Pie
              data={data}
              outerRadius={"70%"}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
              height={"80%"}
            >
            
              <Legend iconType="circle" align="right" verticalAlign="bottom" />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {
               isDesktop ?  <Tooltip 
              content={<CustomTooltip />}
              
              /> :  <Tooltip  />
            }
           
          </PieChart>
        </ResponsiveContainer>
      
        </div>
        }
      
 
      </div>
     
   
    </div>
  );
}

export default MaterialRequisitionAnalysisChart;
