import { DashboardCardType } from "@/utils/types";
import { currencyFormatter } from "@/utils/usefulFunc";
import React from "react";
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
function DashboardCard({
  stockCountAmount = 5000,
  stockCountPercent = 15,

  inventoryAmount = 5000,
  sparePartInventory = 200,
  consumablesInventory = 150,

  materialReceivedAmount = 800,
  materialReceivedPercent = 15,

  materialRequisitionAmount = 4000,
  totalApprovedMaterial = 100,

  mivAmount = 800,
  mivConsumables = 250,
  mivSperePart = 130,
}: DashboardCardType) {
  /* 

  */
  
  
  return (
    <div className="flex flex-row  flex-wrap space-x-2">
      <div
        className="h-[191px] min-w-[150px] max-w-[281px] p-2  rounded-[23px] border-[1.2px] border-slate-300 mb-2 flex-1 items-center flex flex-col justify-around"
        style={{
          backgroundColor: "rgba(0, 122, 255, 0.19)",
        }}
      >
        <div>
          <span
            className="font-[400px] font-[inter] text-[22px] text-center w-full block"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Stock Count
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {currencyFormatter(stockCountAmount)}
          </span>
        </div>
        <div className="flex-row flex  justify-between items-center space-x-8">
          <div className="bg-green-200 rounded-2xl px-2 py-1 flex flex-row items-center shadow">
            <span className="text-sm text-center text-green-500 pr-1">
              %{stockCountPercent}
            </span>
            <GoArrowUpRight color="#22c55e" />
          </div>
          <span
            className="text-sm text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            the last month
          </span>
        </div>
      </div>
      <div
        className="h-[191px] min-w-[150px] max-w-[281px] p-2  rounded-[23px] border-[1.2px] border-slate-300 flex-1 items-center flex flex-col justify-center mb-2"
        style={{
          backgroundColor: "rgba(255, 238, 241, 0.5)",
        }}
      >
        <div className="flex min-w-[150px]  flex-col items-center justify-center">
          <span
            className="font-[400px] font-[inter] text-[22px] block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Project
          </span>
          <span
            className="font-[400px] font-[inter] text-[22px] block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Inventory Count
          </span>
        </div>
        <div>
          <span className="font-medium text-[#475467 font-[600px] text-[36px]">
            {currencyFormatter(inventoryAmount)}
          </span>
        </div>
        <div className="flex flex-col  justify-between items-center ">
          <span
            className="text-sm font-[inter] text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Spare-Parts:
            {sparePartInventory}
          </span>
          <span
            className="text-sm  font-[inter] text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Consumables:
            {consumablesInventory}
          </span>
        </div>
      </div>

      <div
        className="h-[191px] min-w-[150px] max-w-[281px] p-2  rounded-[23px] border-[1.2px] border-slate-300 flex-1 items-center flex flex-col justify-center mb-2"
        style={{
          backgroundColor: "rgba(255, 242, 220, 0.5)",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span
            className="font-[400px] font-[inter] text-[22px] block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Material
          </span>
          <span
            className="font-[400px] font-[inter] text-[22px]  block text-center"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Requisition
          </span>
        </div>
        <div>
          <span className="font-medium text-[#475467 font-[600px] text-[36px]">
            {currencyFormatter(materialRequisitionAmount)}
          </span>
        </div>
        <div className="flex flex-col  justify-between items-center ">
          <span
            className="text-sm font-[inter] text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Approved:
            {totalApprovedMaterial}
          </span>
        </div>
      </div>

      <div
        className="h-[191px] min-w-[150px] max-w-[281px]  rounded-[23px] p-2 border-[1.2px] border-slate-300 mb-2 flex-1 items-center flex flex-col justify-around"
        style={{
          backgroundColor: "#D8FAE71A",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span
            className="font-[400px] font-[inter] text-[22px] block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Materials
          </span>
          <span
            className="font-[400px] font-[inter] text-[22px]  "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Received
          </span>
        </div>
        <div>
          <span className="font-medium text-[#475467 font-[600px] text-[36px]">
            {currencyFormatter( materialReceivedAmount )}
          </span>
        </div>
        <div className="flex-row flex  justify-between items-center space-x-8">
          <div className="bg-red-200 rounded-2xl px-2 py-1 flex flex-row items-center shadow">
            <span className="text-sm text-center text-red-500 pr-1">
              %{materialReceivedPercent}
            </span>
            <GoArrowDownRight color="#F13D04" />
          </div>
          <span
            className="text-sm text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            the last month
          </span>
        </div>
      </div>
     
      <div
        className="h-[191px] min-w-[150px] max-w-[281px] rounded-[23px] p-2 border-[1.2px] border-slate-300 mb-2 flex-1 items-center flex flex-col justify-center "
        style={{
          backgroundColor: "#DAD7FE80",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <span
            className="font-[400px] font-[inter] text-[22px] block text-center  "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total MIV
          </span>
          <span
            className="font-[400px] font-[inter] text-[22px] text-center block"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
             Inventory Count
          </span>
        </div>
        <div>
          <span className="font-medium text-[#475467 font-[600px] text-[36px]">
            {currencyFormatter(mivAmount)}
          </span>
        </div>
        <div className="flex flex-col  justify-between items-center ">
          <span
            className="text-sm font-[inter] text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Spare-Parts:
            {mivSperePart}
          </span>
          <span
            className="text-sm  font-[inter] text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Consumables:
            {mivConsumables}
          </span>
        </div>
      </div>

    </div>
  );
}

export default DashboardCard;
