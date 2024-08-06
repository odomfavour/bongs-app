import { BarchartPropType } from "@/utils/types";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";

function Barchart({ consumable_counts, spare_part_counts }: BarchartPropType) {
  /* 


export interface consumableCountType{

}


export interface sparePartCountType {
  Deck: string, 
  Hospital: string,
  Engine: string,
  Safety: string

}
*/

  const [selectConsumableCount, setSelectConsumableCount] = useState(false);

  const consumableCountKeys = Object.keys(consumable_counts);
  const consumableCountValues = Object.values(consumable_counts);

  const sparePartCountKeys = Object.keys(spare_part_counts);
  const sparePartCountValues = Object.values(spare_part_counts);

  /* create an object for both consumables and sparePart */

  const consumableData = [];
  for (let index = 0; index < consumableCountKeys.length; index++) {
    const name = consumableCountKeys[index];
    const count = consumableCountValues[index];
    let color;

  
    if (consumableCountKeys[index] == "Deck") {
      color = "#62BD71";
    } else if (consumableCountKeys[index] == "Engine") {
      color = "#F13D04B2";
    } else if (consumableCountKeys[index] == "GalleyLaundry") {
      color = "#C9CDD4";
    } else if (consumableCountKeys[index] == "Hospital") {
      color = "#007AFF1A";
    } else {
      color = "#E4CD0099";
    }

    consumableData.push({
      name,
      counts: count,
      color,
    });
  }

  const sparePartData = [];
  for (let index = 0; index < sparePartCountKeys.length; index++) {
    const name = sparePartCountKeys[index];
    const count = sparePartCountValues[index];
    let color;
    if (sparePartCountValues[index] == "Deck") {
      color = "#62BD71";
    } else if (sparePartCountKeys[index] == "Engine") {
      color = "#F13D04B2";
    } else if (sparePartCountKeys[index] == "GalleyLaundry") {
      color = "#C9CDD4";
    } else if (sparePartCountKeys[index] == "Hospital") {
      color = "#007AFF1A";
    } else {
      color = "#E4CD0099";
    }
    sparePartData.push({
      name,
      counts: count,
      color,
    });
  }

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center mb-2">
        <span>Inventory Movement</span>
        <div className="flex flex-row justify-center items-center space-x-2">
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
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={!selectConsumableCount ? consumableData : sparePartData}
          barSize={100}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis
            label={{ value: "counts", angle: -90, position: "insideLeft" }}
          />

          <Tooltip />
          <Bar dataKey="counts" radius={[10, 10, 0, 0]}>
            {(selectConsumableCount ? consumableData : sparePartData).map(
              (item, index) => {
                return <Cell key={`cell-${index}`} fill={item.color} />;
              }
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Barchart;
