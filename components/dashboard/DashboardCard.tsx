import { DashboardCardType } from "@/utils/types";
import { currencyFormatter } from "@/utils/usefulFunc";
import React from "react";
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
function DashboardCard({
  stockCountAmount,
  stockCountPercent,

  inventoryAmount,
  sparePartInventory,
  consumablesInventory,

  materialReceivedAmount,
  materialReceivedPercent,

  materialRequisitionAmount,
  materialReleasedPercentageChange,

  mivAmount,
  mivConsumables,
  mivSperePart,

  totalMaterialRequisition,
  totalMaterialRequisitionApproved,
}: DashboardCardType) {
  return (
    <div className="flex flex-row  flex-wrap space-x-6">
      <div
        className="min-w-[150px] max-w-[281px] p-2  rounded-[23px] border border-slate-300 mb-2 flex-1 items-center flex flex-col justify-around"
        style={{
          backgroundColor: "rgba(0, 122, 255, 0.19)",
        }}
      >
        <div>
          <span
            className="font-[400px] font-[inter] text-lg text-center w-full block"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Stock
          </span>
          <span
            className="font-[400px] font-[inter] text-lg text-center w-full block"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Count
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {stockCountAmount !== undefined
              ? currencyFormatter(stockCountAmount)
              : "No data"}
          </span>
        </div>
        <div className="flex-row flex  justify-between items-center space-x-8">
          <div className="bg-green-200 rounded-2xl px-2 py-1 flex flex-row items-center shadow">
            <span className="text-sm text-center text-green-500 pr-1">
              %{stockCountPercent !== undefined ? stockCountPercent : "No data"}
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
        className="min-w-[150px] max-w-[281px] p-2  rounded-[23px] border-[1.2px] border-slate-300 flex-1 items-center flex flex-col justify-center mb-2"
        style={{
          backgroundColor: "rgba(255, 238, 241, 0.5)",
        }}
      >
        <div className="flex min-w-[150px]  flex-col items-center justify-center">
          <span
            className="font-[400px] font-[inter] text-lg block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Project
          </span>
          <span
            className="font-[400px] font-[inter] text-lg block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Inventory Counts
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {inventoryAmount !== undefined
              ? currencyFormatter(inventoryAmount)
              : "No data"}
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
            {sparePartInventory !== undefined ? sparePartInventory : "No data"}
          </span>
          <span
            className="text-sm  font-[inter] text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Consumables:
            {consumablesInventory !== undefined
              ? consumablesInventory
              : "No data"}
          </span>
        </div>
      </div>

      <div
        className=" min-w-[150px] max-w-[281px] rounded-[23px] p-2 border-[1.2px] border-slate-300 mb-2 flex-1 items-center flex flex-col justify-center "
        style={{
          backgroundColor: "#DAD7FE80",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <span
            className="font-[400px] font-[inter] text-lg block text-center  "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total MIV
          </span>
          <span
            className="font-[400px] font-[inter] text-lg text-center block"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Inventory Count
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {mivAmount !== undefined ? currencyFormatter(mivAmount) : "No data"}
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
            {mivSperePart !== undefined ? mivSperePart : "No data"}
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

      <div
        className="min-w-[150px] max-w-[281px] p-2  rounded-[23px] border-[1.2px] border-slate-300 flex-1 items-center flex flex-col justify-center mb-2"
        style={{
          backgroundColor: "rgba(255, 242, 220, 0.5)",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span
            className="font-[400px] font-[inter] text-lg block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Material
          </span>
          <span
            className="font-[400px] font-[inter] text-lg  block text-center"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Released
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {materialRequisitionAmount !== undefined
              ? currencyFormatter(materialRequisitionAmount)
              : "No data"}
          </span>
        </div>
        <div className="flex-row flex  justify-between items-center space-x-8">
          <div className="bg-red-200 rounded-2xl px-2 py-1 flex flex-row items-center shadow">
            <span className="text-sm text-center text-red-500 pr-1">
              {materialReleasedPercentageChange !== undefined
                ? `%${materialReleasedPercentageChange}`
                : "No data"}
            </span>
            {materialReleasedPercentageChange !== undefined ? (
              <GoArrowDownRight color="#F13D04" />
            ) : (
              ``
            )}
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
        className="min-w-[150px] max-w-[281px]  rounded-[23px] p-2 border-[1.2px] border-slate-300 mb-2 flex-1 items-center flex flex-col justify-around"
        style={{
          backgroundColor: "#D8FAE71A",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span
            className="font-[400px] font-[inter] text-lg block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Materials
          </span>
          <span
            className="font-[400px] font-[inter] text-lg  "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Requisition
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {totalMaterialRequisition !== undefined
              ? currencyFormatter(totalMaterialRequisition)
              : "No data"}
          </span>
        </div>
        <div className="flex-row flex  justify-between items-center space-x-8">
          <span
            className="text-sm text-[12px] text-[#475467]"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Approved:{" "}
            {totalMaterialRequisitionApproved !== undefined
              ? totalMaterialRequisitionApproved
              : "No data"}
          </span>
        </div>
      </div>

      <div
        className="min-h-[150px] max-w-[281px]  rounded-[23px] p-2 border-[1.2px] border-slate-300 mb-2 flex-1 items-center flex flex-col justify-around"
        style={{
          backgroundColor: "#D8FAE7",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span
            className="font-[400px] font-[inter] text-lg block text-center "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Total Materials
          </span>
          <span
            className="font-[400px] font-[inter] text-lg  "
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Received
          </span>
        </div>
        <div>
          <span className=" text-[#475467] font-[600px] text-[36px]">
            {materialReceivedAmount !== undefined
              ? currencyFormatter(materialReceivedAmount)
              : "No data"}
          </span>
        </div>
        <div className="flex-row flex  justify-between items-center space-x-8">
          <div className="bg-red-200 rounded-2xl px-2 py-1 flex flex-row items-center shadow">
            <span className="text-sm text-center text-red-500 pr-1">
              {materialReceivedPercent !== undefined
                ? `%${materialReceivedPercent}`
                : "No data"}
            </span>

            {materialReceivedPercent !== undefined ? (
              <GoArrowDownRight color="#F13D04" />
            ) : (
              ""
            )}
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
    </div>
  );
}

export default DashboardCard;
