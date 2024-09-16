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

const QaTable: React.FC<ApprovePOProps> = ({ selectedQA, fetchQAData }) => {
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

  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [acknowledgedAt, setAcknowledgedAt] = useState<string>("");
  const [recognizedAt, setRecognizedAt] = useState<string>("");
  const [isRecognized, setIsRecognized] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("complete");

  const handleAcknowledgeCheckbox = () => {
    const newAcknowledgedState = !isAcknowledged;
    setIsAcknowledged(newAcknowledgedState);

    // Set the date to current date when checked
    if (newAcknowledgedState) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      setAcknowledgedAt(formattedDate);
    } else {
      setAcknowledgedAt(""); // Reset if unchecked
    }
  };

  // Handler for the Recognize checkbox
  const handleRecognizeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRecognizedState = !isRecognized;
    setIsRecognized(newRecognizedState);

    // Set the date to current date when checked
    if (newRecognizedState) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      setRecognizedAt(formattedDate);
    } else {
      setRecognizedAt(""); // Reset if unchecked
    }
  };

  const handleSubmit = async () => {
    const payload = {
      mode_of_delivery: deliveryMode, // "complete" or "partial"
      is_recognised: isRecognized,
      is_acknowledged: isAcknowledged,
      recognised_at: recognizedAt, // Date or empty string
      acknowledged_at: acknowledgedAt, // Date or empty string
      items: tableData.map((item) => ({
        name: item.name, // Assuming you have a 'name' field
        item_id: item.id, // Adjust based on your actual field names
        required_quantity: item.quantity, // Assuming 'quantity' refers to required quantity
        delivered_quantity: item.delivered_quantity || 0, // Handle empty values gracefully
        remaining_quantity: item.remaining_quantity || 0,
        spec_match: item.spec_match === 1, // Convert to boolean
        comment: item.comment || null, // Handle optional fields
      })),
    };

    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/quality-assurance/confirm-item/${selectedQA}`, // Replace with actual API endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Data submitted successfully!");
      fetchQAData(); // Optional: Refetch data after successful submission
    } catch (error: any) {
      console.error("Submission error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
    }
  };

  useEffect(() => {
    setAcknowledgedAt(QA?.acknowledged_at);
    setDeliveryMode(QA?.mode_of_delivery);
    setIsAcknowledged(QA?.is_acknowledged);
    setIsRecognized(QA?.is_recognised);
    setRecognizedAt(QA?.recognised_at);
  }, [QA]);

  return (
    <div>
      <p className="text-2xl font-bold mb-4">Quality Assurance</p>
      <div className="flex justify-between">
        <div className="w-1/4">
          <p>Vendor</p>
          <p>{QA?.bid?.vendor}</p>
          <p>{QA?.purchase_order?.delivery_address}</p>

          <div className="mt-5">
            <p>Attachments:</p>
          </div>
          <div className="mt-2">
            <Link href="#" className="text-blue-400 text-sm">
              View Delivery History
            </Link>
          </div>
        </div>
        {/* <div className="w-1/4"></div> */}
        <div className="w-1/2">
          <div className="flex gap-3">
            <div className="flex gap-3 items-center mb-4">
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Acknowledge Delivery
              </label>
              <input
                id="default-checkbox"
                type="checkbox"
                checked={isAcknowledged}
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                onChange={handleAcknowledgeCheckbox}
              />
            </div>
            <p>
              <p>{acknowledgedAt || "Not yet acknowledged"}</p>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-3 items-center mb-4">
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Recognize Delivery
              </label>
              <input
                id="default-checkbox"
                type="checkbox"
                checked={isRecognized}
                value=""
                onChange={handleRecognizeCheckbox}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <p>{recognizedAt || "Not yet recognized"}</p>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center ps-4 border border-gray-200 rounded">
              <input
                id="bordered-radio-1"
                type="radio"
                value="complete"
                name="bordered-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                checked={deliveryMode === "complete"}
                onChange={(e) => setDeliveryMode(e.target.value)}
              />
              <label
                htmlFor="bordered-radio-1"
                className="w-full p-4 ms-2 text-sm font-medium text-gray-900"
              >
                Complete Delivery
              </label>
            </div>
            <div className="flex items-center ps-4 border border-gray-200 rounded">
              <input
                id="bordered-radio-2"
                type="radio"
                value="partial"
                name="bordered-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                checked={deliveryMode === "partial"}
                onChange={(e) => setDeliveryMode(e.target.value)}
              />
              <label
                htmlFor="bordered-radio-2"
                className="w-full p-4 ms-2 text-sm font-medium text-gray-900"
              >
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
                <th className="px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  S/N
                </th>
                <th className="p-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="p-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Requested Quantity
                </th>
                <th className="p-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Delivered
                </th>
                <th className="p-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Awaiting
                </th>
                <th className="p-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Spec Match
                </th>
                <th className="p-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length > 0 &&
                tableData?.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item.name}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      <input
                        type="text"
                        value={item.delivered_quantity}
                        onChange={(e) => {
                          const newDelivered = parseInt(e.target.value) || 0;
                          handleInputChange(
                            index,
                            "delivered_quantity",
                            newDelivered
                          );
                          handleInputChange(
                            index,
                            "remaining_quantity",
                            item.quantity - newDelivered >= 0
                              ? item.quantity - newDelivered
                              : 0
                          );
                        }}
                        className="border p-2 rounded"
                      />
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item.remaining_quantity}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={item.spec_match === 1}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "spec_match",
                            e.target.checked ? 1 : 0
                          )
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-3 border-b text-sm text-gray-700">
                      <textarea
                        id="message"
                        rows={4}
                        value={item.comment || ""}
                        onChange={(e) =>
                          handleInputChange(index, "comment", e.target.value)
                        }
                        className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                        placeholder="Write your thoughts here..."
                      ></textarea>
                      {/* <input
                        type="text"
                        value={item.comment || ""}
                        onChange={(e) =>
                          handleInputChange(index, "comment", e.target.value)
                        }
                        className="border p-2 rounded"
                      /> */}
                    </td>
                  </tr>
                ))}
              {tableData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-3 text-center text-gray-500"
                  >
                    No data available. .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-end mt-3">
            <button
              className="p-2 rounded bg-blue-500 text-white"
              onClick={handleSubmit}
            >
              Update Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QaTable;
