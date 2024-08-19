import {
  RFQTypeDataArray,
} from "@/utils/data";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Flag from "react-world-flags";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus } from "react-icons/fa";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDepartmentDataApi,
  fetchAllProjectDataApi,
  fetchAllVendorCategoryDataApi,
  fetchAllVendorDataApi,
  updateRFQDataApi,
} from "@/utils/apiServices/procurementApi";
import { toast } from "react-toastify";
import {
  populateAllCategory,
  populateAllDepartments,
  populateAllProjects,
  populateAllVendors,
} from "@/provider/redux/procurementSlice";

function ProcurementAddRequestModal() {
  /* 
"OEM Specific"|"3rd Party Vendors"| "Internal Procurement"
*/

  const { title, draftList, procurementType, subscriber, subscriberId, procurementId, id } = useSelector(
    (state: any) => state.procurement.draftProcurementState
  );

  const {
    allCategory: allCateryFromRedux,
    allProjects: allProjectsFromRedux,
    allVendors: allVendorsFromRedux,
    allDepartments: allDepartmentsFromRedux,
  } = useSelector((state: any) => state.procurement);

  const dispatch = useDispatch();

  const [allProject, setAllProject] = useState<
    | {
        projectName: string;
      }[]
    | []
  >(allProjectsFromRedux);
  const [allVendors, setAllVendors] = useState<
    | {
        vendorName: string;
      }[]
    | []
  >(allVendorsFromRedux);

  const [allCategory, setAllCategory] = useState<
    | {
        categoryName: string;
      }[]
    | []
  >(allCateryFromRedux);

  const [allDepartment, setAllDepartment] = useState<
    | {
        departmentName: string;
      }[]
    | []
  >(allDepartmentsFromRedux);

  const [selectedVendor, setSelectedVendor] = useState("");

  const [selectedProject, setSelectedProject] = useState("");

  const [selectedClient, setSelectedClient] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [startDate, setStartDate] = useState(new Date());

  const [RFQType, setRFQType] = useState("OEM Specific");

  const [RFQHeading, setRFQHeading] = useState("");

  const [amount, setAmount] = useState<string | null>(null);

  const [isUIReady, setIsUIReady] = useState(true);

  console.log("all vendors inner hhh", allVendors);

  const fetchProcurementsDataForDraft = useCallback(async () => {
    if (
      allCateryFromRedux !== null &&
      allVendorsFromRedux !== null &&
      allProjectsFromRedux !== null &&
      allDepartmentsFromRedux !== null
    )
      return;
    setIsUIReady(false);
    try {
      const [allProjectsData, vendorCategoryData, vendorsData, departmentData] =
        await Promise.all([
          fetchAllProjectDataApi(),
          fetchAllVendorCategoryDataApi(),
          fetchAllVendorDataApi(),
          fetchAllDepartmentDataApi(),
        ]);
      setIsUIReady(true);
      console.log(
        "allProjectsData",
        allProjectsData,
        "vendorCategoryData",
        vendorCategoryData,
        "Vendor data",
        vendorsData,
        "all departmentData",
        departmentData
      );
      const projectList = allProjectsData.data.data.map((project: any) => {
        return {
          projectName: project.project_name,
        };
      });
      dispatch(populateAllProjects(projectList));

      setAllProject(projectList);

      const vendorsList = vendorsData.data.data.map(
        (vendor: { vendor_name: string }) => {
          return {
            vendorName: vendor.vendor_name,
          };
        }
      );

      setAllVendors(vendorsList);
      dispatch(populateAllVendors(vendorsList));

      const categoryList = vendorCategoryData.data.data.map(
        (category: { name: string }) => {
          return {
            categoryName: category.name,
          };
        }
      );

      setAllCategory(categoryList);
      dispatch(populateAllCategory(categoryList));

      const departmentList = departmentData.data.data.map(
        (department: { department_name: string }) => {
          return {
            departmentName: department.department_name,
          };
        }
      );

      setAllDepartment(departmentList);
      dispatch(populateAllDepartments(departmentList));

      // You can similarly setStoreItems if needed
    } catch (error: any) {
      console.error("Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
    } 
  }, []);

  useEffect(() => {
    if (procurementType === "draft") {
      fetchProcurementsDataForDraft();
    }
  }, [fetchProcurementsDataForDraft, procurementType]);



const handleUpdateRfq = async () => {
    try {
      const updateData = {
        id, 
        rfqUpdateData: {
          procurement_type: procurementType,
          subcriber_id: subscriberId,
          procurement_id: procurementId,
          title,
           
        }
      }
      await updateRFQDataApi(updateData)
     } catch (error: any) {
      console.error("Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
    } finally {
    }
}

  if (!isUIReady) {
    return (
      <div className="h-screen flex  justify-center items-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row py-8 space-x-12 w-full">
      <div className="">
        <div>
          <p className="text-black text-lg font-normal font-['Inter']">
            Choose Procurement Type
          </p>
          <select
            name=""
            id=""
            onChange={(e) => setRFQType(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
          >
          
            {RFQTypeDataArray.map((item, index) => {
              return (
                <option
                  value={item}
                  key={index}
                  className=" text-black text-sm font-normal font-['Inter']"
                >
                  {item}
                </option>
              );
            })}
          </select>

          {/* 
            
            */}

          {RFQType == "OEM Specific" && (
            <div>
              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose a Client
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                    --Select--
                  </option>
                  <option
                        value={subscriber}
                     
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {subscriber}
                      </option>
                </select>
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor/OEM
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                    --Select--
                  </option>
                  {allVendors?.map((item, index) => {
                    return (
                      <option
                        value={item.vendorName}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.vendorName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {RFQType == "3rd Party Vendors" && (
            <div>
              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose a Project
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                    --Select--
                  </option>
                  {allProject.map((item, index) => {
                    return (
                      <option
                        value={item.projectName}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.projectName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor Category
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                    --Select--
                  </option>
                  {allCategory.map((item, index) => {
                    return (
                      <option
                        value={item.categoryName}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {RFQType == "Internal Procurement" && (
            <div>
              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose a Department
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                    --Select--
                  </option>
                  {allDepartment.map((item, index) => {
                    return (
                      <option
                        value={item.departmentName}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.departmentName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor Category
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                    --Select--
                  </option>
                  {allCategory.map((item, index) => {
                    return (
                      <option
                        value={item.categoryName}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {/* budget section starts */}

          <div className="mt-2">
            <p className="text-black text-lg font-normal font-['Inter']">
              Estimated Budget
            </p>
            <div className="w-[332px] h-[54px] rounded-[10px] border border-black/50 flex items-center px-2 flex-row space-x-2">
              <div className="flex items-center space-x-1">
                <Image
                  alt="flag"
                  className="w-8 h-6 rounded"
                  width={54}
                  height={54}
                  src={"/icons/flag.jpeg"}
                />
                <span>NGN</span>
              </div>
              <input
                className="flex-1 h-[40px] px-1 border-0 border-none focus:outline-none"
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
            </div>
          </div>
          {/* budget sectio endsdiv */}

          {/* date */}
          <div className="mt-2">
            <p className="text-black text-lg font-normal font-['Inter']">
              Bidding deadline
            </p>
            <div></div>
            <DatePicker
              placeholderText="Enter Date"
              showIcon
              selected={startDate}
              onChange={(date) => {
                date && setStartDate(date);
              }}
            />
          </div>
          {/* date end */}
        </div>
      </div>
      <div className="flex-1">
        <div>
          <p className="text-black text-2xl font-normal font-['Inter']">
            Title
          </p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            readOnly={title ? true : false}
            name=""
            id=""
            value={title ? title : ""}
            onChange={(e) => setRFQHeading(e.target.value)}
            placeholder="Input RFQ title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 flex-1"
          />
          <div className=" bg-[#d9d9d9] rounded-[10px] border justify-center items-center flex flex-row space-x-1 cursor-pointer p-2">
            <FaPlus />
            <button
              disabled={procurementType == "draft" ? true : false}
              className="text-black text-xl font-normal font-['Inter']"
            >
              Add More
            </button>
          </div>
        </div>
        {draftList.length > 0 ? (
          <div className="mt-2 flex-col">
            <table className="flex-1">
              <thead>
                <tr>
                  <td className="text-center text-black">S/N</td>
                  <td className="text-center text-black">Quantity</td>
                  <td className="text-center text-black">Description</td>
                  <td className="text-center text-black">Attachment</td>
                  <td className="text-center text-black">Actions</td>
                </tr>
              </thead>
              <tbody>
                {draftList.map((list: any, index: number) => (
                  <tr key={index}>
                    <td className="text-center text-sm">{index + 1}</td>
                    <td className="text-center text-sm">
                      {list.stock_quantity}
                    </td>
                    <td className="text-center text-sm">{list.description}</td>
                    <td>
                      <div className="flex flex-row items-center space-x-1">
                        {list.attachments.map((pic: any, i: number) => (
                          <Image
                            key={i}
                            alt="attachment"
                            // src={ `${pic.attachment_uri}` }
                            width={12}
                            src={"/test"}
                            height={12}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="flex flex-row items-center justify-center space-x-2">
                      <button
                        disabled={procurementType == "draft" ? true : false}
                        className={`rounded-xl px-2 bg-blue-600 text-white text-sm  ${
                          procurementType == "draft"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        Attach file
                      </button>
                      <button
                        disabled={procurementType == "draft" ? true : false}
                        className={`rounded-xl px-2 bg-red-600 text-white text-sm  ${
                          procurementType == "draft"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-row justify-end mt-8">
              <button className="rounded-xl bg-blue-900 text-white py-2 px-4">
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center  mt-8">
            <div className="flex w-full justify-center items-center">
              <FaRegFolderClosed className="text-4xl" />
            </div>
            <div className="mt-5 flex flex-col justify-center items-center">
              <p className="font-medium text-[#475467]">No RFQ</p>
              <p className="font-normal text-sm mt-3 text-center">
                Click “add ” button to get started in doing your
                <br /> first transaction on the platform
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcurementAddRequestModal;
