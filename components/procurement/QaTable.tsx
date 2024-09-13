import { toggleLoading } from "@/provider/redux/modalSlice";
import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface ApprovePOProps {
  selectedQA: number;
  fetchQAData: () => void;
}

const QaTable: React.FC<ApprovePOProps> = ({
  selectedQA,
  fetchQAData,
}) => {
  const user = useSelector((state: any) => state.user.user);
  const [tableData, setTableData] = useState<any[]>([]);
  const [QA, setQA] = useState<any>({});
  const dispatch = useDispatch();

  const fetchQA = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement/quality-assurance/${selectedQA}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Approve Response:", response);
      const qualityAssuranceData = response?.data?.data;
      setQA(qualityAssuranceData);
      setTableData(qualityAssuranceData?.bid?.bid_items);
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [dispatch, selectedQA, user?.token]);

  useEffect(() => {
    fetchQA();
  }, [fetchQA]);

  const handleInputChange = (index: number, field: string, value: any) => {
    setTableData((prevTableData) =>
      prevTableData.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="w-1/4">
          <p>Vendor</p>
          <p>Crown Energy Nigeria Enterprises</p>
          <p>03, Gbenga Ademulegun Lane, Parkview, Ikoyi, Lagos, Nigeria.</p>

          <div className="mt-5">
            <p>Attachments:</p>
          </div>
          <div className="mt-2">
          <Link href="#" className="text-blue-400 text-sm">View Delivery History</Link>
          </div>
        </div>
        {/* <div className="w-1/4"></div> */}
        <div className="w-1/2">
          <div className="flex gap-3">
            <div className="flex gap-3 items-center mb-4">
              <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">
                Acknowledge Delivery
              </label>
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <p>2/08/2024</p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-3 items-center mb-4">
              <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">
                Recognize Delivery
              </label>
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <p>2/08/2024</p>
          </div>
         

          <div className="flex gap-3">
            <div className="flex items-center ps-4 border border-gray-200 rounded">
              <input
                id="bordered-radio-1"
                type="radio"
                value=""
                name="bordered-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="bordered-radio-1" className="w-full pl-4 ms-2 text-sm font-medium text-gray-900">
               Complete Delivery
              </label>
            </div>
            <div className="flex items-center ps-4 border border-gray-200 rounded">
              <input
                checked
                id="bordered-radio-2"
                type="radio"
                value=""
                name="bordered-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="bordered-radio-2" className="w-full pl-4 ms-2 text-sm font-medium text-gray-900">
               Partial Delivery
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Requested Quantity</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Awaiting</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Spec Match</th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length > 0 && tableData?.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">{item.name}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">
                    <input
                      type="text"
                      value={item.delivered_quantity}
                      onChange={(e) => {
                        const newDelivered = parseInt(e.target.value) || 0;
                        handleInputChange(index, "delivered_quantity", newDelivered);
                        handleInputChange(index, "remaining_quantity", item.quantity - newDelivered >= 0 ? item.quantity - newDelivered : 0);
                      }}
                      className="border p-2 rounded"
                    />
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">{item.remaining_quantity}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={item.spec_match === 1}
                      onChange={(e) => handleInputChange(index, "spec_match", e.target.checked ? 1 : 0)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">
                    <input
                      type="text"
                      value={item.comment || ""}
                      onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                      className="border p-2 rounded"
                    />
                  </td>
                </tr>
              ))}
              {tableData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-3 text-center text-gray-500">No data available. Please add items to the table.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-end mt-3">
            <button className="p-2 rounded bg-blue-500 text-white">
              Update Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QaTable;
