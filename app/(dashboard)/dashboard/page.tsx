"use client";

import React, { useEffect, useState } from "react";
import Areachart from "@/components/dashboard/charts/Areachart";
import Barchart from "@/components/dashboard/charts/Barchart";
import LineAndbarchart from "@/components/dashboard/charts/LineAndBarchart";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { fetchDashboardDataApi } from "@/utils/apiServices/dashboard";
import { toast } from "react-toastify";
import {
  categoryCountType,
  consumableCountType,
  DashboardCardType,
  mostUsedInventoryPropType,
  signMostUsedItemProp,
  sparePartCountType,
} from "@/utils/types";
import TopTenInnventories from "@/components/dashboard/charts/TopTenInnventories";
import Image from "next/image";
import { months } from "@/utils/data";
import InventoryRequisitionAnalysis from "@/components/dashboard/charts/InventoryRequisitionAnalysis";
import { useSelector } from "react-redux";

import { useRouter} from "next/navigation"


const Page = () => {
  const [dashboardData, setDashboardData] = useState<DashboardCardType[] | []>(
    []
  );
  const [requisitionApprovedByMonth, setRequisitionApprovedByMonth] = useState<
    string[] | []
  >([]);
  const [inventoryOverTime, setInventoryOverTime] = useState<{
    months: string[];
  } | null>(null);
  const user = useSelector((state: any) => state?.user?.user);
  const [isUIReady, setIsUIReady] = useState(false);
  const [consumableCounts, setConsumableCounts] =
    useState<consumableCountType | null>(null);
  const [sparePartCounts, setSparePartCounts] =
    useState<sparePartCountType | null>(null);
  const [categoryCounts, setCategoryCounts] =
    useState<categoryCountType | null>(null);
  
  const [mostUsedInvory, setmostUsedInvory] = useState<signMostUsedItemProp[] | []>([])
  console.log("ran inner now")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  
  const router = useRouter();
  useEffect(() => {
    const handleFetchData = async () => {
      try {
        if (user?.subscriber_id) {
          const response = await fetchDashboardDataApi({year, month});
          if (response.status) {
            const { message, data } = response;
            console.log("dashboard data", data)
            toast.success(message);
            const { total_requisitions
             } = data.requisition_data;
            const {
              total_inventory,
              total_project_inventory,
              total_project_consumable_inventory,
              total_project_sparepart_inventory,
              total_miv_inventory,
              total_miv_sparepart_inventory,
              total_miv_consumable_inventory,
              percentage_change_total_inventory,
              consumable_counts,
              spare_part_counts,
              category_counts,
            } = data.inventory_data;


            const { most_used_inventory } = data.most_used_inventory_data
            setmostUsedInvory(most_used_inventory)
         
            setCategoryCounts(category_counts);
            setConsumableCounts(consumable_counts);
            setSparePartCounts(spare_part_counts);

            const { total_items_received, percentage_change } =
              data.total_items_received_data;
              const {total_approved_materials
              } = data.material_release_data
        
            setRequisitionApprovedByMonth(
              data.requisition_data.delivered_requisitions_by_month
            );
            setInventoryOverTime(data.filtered_inventory_data);

            setDashboardData([
              {
                stockCountAmount: total_inventory,
                stockCountPercent: percentage_change_total_inventory,
                inventoryAmount: total_project_inventory,
                sparePartInventory: total_project_sparepart_inventory,
                consumablesInventory: total_project_consumable_inventory,
                materialRequisitionAmount: total_requisitions,
                totalApprovedMaterial: total_approved_materials,
                mivAmount: total_miv_inventory,
                mivConsumables: total_miv_consumable_inventory,
                mivSperePart: total_miv_sparepart_inventory,
                materialReceivedAmount: total_items_received,
                materialReceivedPercent: percentage_change,
              },
            ]);

            setIsUIReady(true);
          }
        }
      } catch (error: any) {
        setIsUIReady(true);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          error?.message ||
          "Unknown error";
        toast.error(`${errorMessage}`);
      }
    };

    handleFetchData();
  }, [user,year, month, router]);

  if (!isUIReady) {
    return (
      <div className="h-screen flex  justify-center items-center">
         <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div> 
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "rgb(244,245,246)",
      }}
      className="p-2"
    >
      {/* gilter section start */}

      <div className="flex flex-row justify-end items-center space-x-2 mb-4">
        <Image
          src={"/icons/filterPic.png"}
          alt="filter"
          className="w-[27px] h-[30px]"
          width={27}
          height={30}
          objectFit="contain"
        />
        <select
          onChange={e => setMonth(e.target.value)}
          name=""
          id=""
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3"
        >
          <option value={""}>month</option>
          {months.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          onChange={e => e.target.value}
          name=""
          id=""
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3"
        >
          <option value="">Year</option>
          <option value={"2024"}>2024</option>
        </select>
      </div>

      {/* filter section ends */}
      {/* card sectio starts */}
      <div className="mb-4">
        {dashboardData.length > 0 && <DashboardCard {...dashboardData[0]} />}
      </div>
      {/* card section ends */}

      {/* chart section starts */}

      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 lg:col-span-8 gap-4">
          <div className="grid grid-cols-12 gap-4 mb-[8px]">
            <div className="col-span-12 lg:col-span-6 min-h-[45vh]  rounded-[23px] p-2 border-[1.2px] border-slate-300">
              {inventoryOverTime && (
                <LineAndbarchart inventoryOverTime={inventoryOverTime} />
              )}
            </div>
            <div className="col-span-12 lg:col-span-6  rounded-[23px] p-2 border-[1.2px] border-slate-300">
              <Areachart
                requisitionApprovedByMonth={requisitionApprovedByMonth}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className=" col-span-12 lg:col-span-6 min-h-[45vh]   rounded-[23px] p-2 border-[1.2px] border-slate-300">
              {consumableCounts && sparePartCounts && (
                <Barchart
                  consumable_counts={consumableCounts}
                  spare_part_counts={sparePartCounts}
                />
              )}
            </div>
            <div className="col-span-12 lg:col-span-6 min-h-[45vh]   rounded-[23px] p-2 border-[1.2px] border-slate-300">
              {categoryCounts && (
                <InventoryRequisitionAnalysis categoryCounts={categoryCounts} />
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 min-h-[45vh]   lg:col-span-4 gap-4  rounded-[23px] p-2 border-[1.2px] border-slate-300">
        
          {
          mostUsedInvory &&  <TopTenInnventories
              data={ 
                mostUsedInvory
           }
        /> 
          }
        </div>
      </div>

      {/* chart sectio ends */}
    </div>
  );
};

export default Page;
