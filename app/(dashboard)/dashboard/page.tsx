"use client";
import useSWR from "swr";
import React, { useCallback, useEffect, useState } from "react";
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
  signMostUsedItemProp,
  sparePartCountType,
} from "@/utils/types";
import TopTenInnventories from "@/components/dashboard/charts/TopTenInnventories";
import Image from "next/image";
import { months } from "@/utils/data";
import InventoryRequisitionAnalysis from "@/components/dashboard/charts/InventoryRequisitionAnalysis";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import MaterialRequisitionAnalysisChart from "@/components/dashboard/charts/MetarialRequisitionAnalysisChart";

const Page = () => {
  const [dashboardData, setDashboardData] = useState<DashboardCardType[] | []>(
    []
  );

  const [itemSelected, setItemSelected] = useState("one");
  const [requisitionApprovedByMonth, setRequisitionApprovedByMonth] = useState<
    string[] | []
  >([]);

  const [materialRequisitionAnalysisData, setMaterialRequisitionAnalysisData] =
    useState<{
      totalMaterialReleased: number;
      totalRequisitionReceived: number;
      totalRequisitionMade: number;
    } | null>(null);

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

  const [mostUsedInvory, setmostUsedInvory] = useState<
    signMostUsedItemProp[] | []
  >([]);

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [appMounted, setAppMounted] = useState(false);

  // const router = useRouter();

  // const handleFetchData = useCallback(async () => {
  //   try {
  //     if (user?.subscriber_id) {
  //       const response = await fetchDashboardDataApi({ year, month });

  //     }
  //   } catch (error: any) {
  //     setIsUIReady(true);
  //     const errorMessage =
  //       error?.response?.data?.message ||
  //       error?.response?.data?.errors ||
  //       error?.message ||
  //       'Unknown error';
  //     toast.error(`${errorMessage}`);
  //   }
  // }, [user?.subscriber_id, year, month]);

  const {
    data: swrResponse,
    error,
    isLoading,
  } = useSWR(
    ["inventory-data-fetch", year, month],
    async () => {
      const response = await fetchDashboardDataApi({ year, month });
      return response;
    },
    {
      revalidateOnFocus: false, // Revalidate when the window is refocused
      revalidateOnReconnect: true, // Revalidate when reconnecting after losing connection
      refreshInterval: 3, // Set to 0 if you don't want periodic revalidation
      refreshWhenHidden: false, // Set to true if you want to keep refreshing in the background
      refreshWhenOffline: false, // Set to true if you want to keep refreshing when offline
    }
  );

 

  useEffect(() => {
    if (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
    }

    if (swrResponse?.status) {
      const { data, message } = swrResponse;
      console.log("dashboard data", data);
      // toast.success(message);
      const { total_requisitions, total_approved_requisitions } =
        data.requisition_data;
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

      const { most_used_inventory } = data.most_used_inventory_data;
      setmostUsedInvory(most_used_inventory);

      setCategoryCounts(category_counts);
      setConsumableCounts(consumable_counts);
      setSparePartCounts(spare_part_counts);

      const { total_items_received, percentage_change } =
        data.total_items_received_data;
      const {
        percentage_change: percentageChangeMaterialReleased,
        total_materials,
        released_materials_by_month,
        total_released_materials,
      } = data.material_release_data;

      setRequisitionApprovedByMonth(released_materials_by_month);
      setInventoryOverTime(data.filtered_inventory_data);

      setMaterialRequisitionAnalysisData({
        totalMaterialReleased: total_materials,
        totalRequisitionReceived:total_items_received,
        totalRequisitionMade: total_requisitions,
      });
      setDashboardData([
        {
          stockCountAmount: total_inventory,
          stockCountPercent: percentage_change_total_inventory,
          inventoryAmount: total_project_inventory,
          sparePartInventory: total_project_sparepart_inventory,
          consumablesInventory: total_project_consumable_inventory,
          materialRequisitionAmount: total_materials,
          materialReleasedPercentageChange: percentageChangeMaterialReleased,
          mivAmount: total_miv_inventory,
          mivConsumables: total_miv_consumable_inventory,
          mivSperePart: total_miv_sparepart_inventory,
          materialReceivedAmount: total_items_received,
          materialReceivedPercent: percentage_change,
          totalMaterialRequisition: total_requisitions,
          totalMaterialRequisitionApproved: total_approved_requisitions,
        },
      ]);

      setAppMounted(true);
    }
  }, [error, swrResponse]);

  if (isLoading && !appMounted) {
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
      {/* header section starts */}
      <div className=" flex flex-row items-center justify-between px-4 pb-8">
        <div className="flex flex-row items-center space-x-2">
          <div
            onClick={() => {
              setItemSelected("one");
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center ${
              itemSelected === "one" ? "bg-gray-300" : ""
            }`}
          >
            <p className="text-xl text-gray-600 font-[inter] font-light ">
              All
            </p>
          </div>

          <div
            onClick={() => {
              setItemSelected("two");
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center ${
              itemSelected === "two" ? "bg-gray-300" : ""
            }`}
          >
            <p className="text-xl text-gray-600 font-[inter] font-light ">
              Project
            </p>
          </div>

          <div
            onClick={() => {
              setItemSelected("three");
            }}
            className={`px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center ${
              itemSelected === "three" ? "bg-gray-300" : ""
            }`}
          >
            <p className="text-xl text-gray-600 font-[inter] font-light ">
              MIV
            </p>
          </div>
        </div>
        <div>
          <Image
            src="/bongs.svg"
            alt="the product logo"
            width="48"
            height="48"
          />
        </div>
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
            onChange={(e) => setMonth(e.target.value)}
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
            onChange={(e) => e.target.value}
            name=""
            id=""
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3"
          >
            <option value="">Year</option>
            <option value={"2024"}>2024</option>
          </select>
        </div>
      </div>

      <div className=" border border-slate-200   mb-6" />
      {/* header section ends */}
      {/* filter section ends */}
      {/* card sectio starts */}
      <div className="mb-4">
        {dashboardData.length > 0 && <DashboardCard {...dashboardData[0]} />}
      </div>
      {/* card section ends */}

      {/* chart section starts */}

      <div className="grid grid-cols-10 gap-4 mb-4">
        

        <div className="col-span-6 grid grid-cols-12 gap-4">
          <div className="grid grid-cols-12 col-span-12 gap-4">
            <div className="col-span-6   rounded-[23px] p-2 border-[1.2px] border-slate-300 bg-white">
              {inventoryOverTime && (
                <LineAndbarchart inventoryOverTime={inventoryOverTime} />
              )}
            </div>
            <div className="col-span-6   rounded-[23px] p-2 border-[1.2px] border-slate-300 bg-white ">
              <Areachart
                requisitionApprovedByMonth={requisitionApprovedByMonth}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 col-span-12 gap-4">
            <div className=" col-span-6   rounded-[23px] p-2 border-[1.2px] border-slate-300 bg-white">
              {consumableCounts && sparePartCounts && (
                <Barchart
                  consumable_counts={consumableCounts}
                  spare_part_counts={sparePartCounts}
                />
              )}
            </div>
            <div className="col-span-6   rounded-[23px] p-2 border-[1.2px] border-slate-300 bg-white">
              {categoryCounts && (
                <InventoryRequisitionAnalysis categoryCounts={categoryCounts} />
              )}
            </div>
          </div>
        </div>
        <div className="col-span-4 gap-4">
          <div className="col-span-12 h-[55%]  rounded-[23px] p-2 border-[1.2px] border-slate-300 bg-white ">
            {mostUsedInvory && <TopTenInnventories data={mostUsedInvory} />}
          </div>
          <div className="col-span-12 mt-[16px] h-[45%]  rounded-[23px] p-2 border-[1.2px] border-slate-300 bg-white">
            <MaterialRequisitionAnalysisChart
              materialReleaseStatus={materialRequisitionAnalysisData}
            />
          </div>
        </div>
      </div>

      {/* chart sectio ends */}
    </div>
  );
};

export default Page;
