import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Areachart({
  requisitionApprovedByMonth,
}: {
  requisitionApprovedByMonth: string[];
}) {


  
  const countsArray = Object.values(requisitionApprovedByMonth);
  const monthArray = Object.keys(requisitionApprovedByMonth);


  /* assigning each monnth to its value */

  const data = [];
  for (let index = 0; index < countsArray.length; index++) {
    const month = monthArray[index];
    const value = countsArray[index];

    data.push({
      month,
      value,
    });
  }

  return (
    <div className="px-4 flex flex-row items-center justify-center">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            dataKey={"value"}
            label={{ value: "Counts", position: "insideLeft", angle: -90 }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            content={() => {
              return (
                <div className="flex flex-row justify-center items-center mb-4 text-gray-500">
                  <span className="text-center">
                    Requisition Approved by Months
                  </span>
                </div>
              );
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#BFBEB9"
            fill="#FEFBF4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Areachart;
