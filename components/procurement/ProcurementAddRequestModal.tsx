import {
  RFQTypeDataArray,
} from "@/utils/data";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FaPlus } from "react-icons/fa";
import {  FaRegFolderClosed } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDepartmentDataApi,
  fetchAllProjectDataApi,
  fetchAllVendorCategoryDataApi,
  fetchAllVendorsDataApi,
  updateRFQDataApi,
} from "@/utils/apiServices/procurementApi";
import { toast } from "react-toastify";
import {
  populateAllCategory,
  populateAllDepartments,
  populateAllProjects,
  populateAllVendors,
  populateAllVendorsCateroy,
} from "@/provider/redux/procurementSlice";
import { toggleLoading } from "@/provider/redux/modalSlice";

function ProcurementAddRequestModal() {

  const { title, draftList, procurementType, subscriber, subscriberId, procurementId, id } = useSelector(
    (state: any) => state.procurement.draftProcurementState
  );


 
  
  const {
    allCategory: allCateryFromRedux,
    allProjects: allProjectsFromRedux,
    allVendors: allVendorsFromRedux,
    allDepartments: allDepartmentsFromRedux,
    allVendorsCategory: allVendorsCategoryFromRedux,
  } = useSelector((state: any) => state.procurement);

  const dispatch = useDispatch();

  const [allProject, setAllProject] = useState<
     {
        projectName: string;
      }[]
  >(allProjectsFromRedux);
  const [allVendorsCategory, setAllVendorsCategory] = useState<
     {
        vendorCategoryName: string;
        vendorCategoryId: number
      }[]
  >(allVendorsCategoryFromRedux);




  const [allVendors, setAllVendors] = useState<
  {
     vendorName: string;
     vendorId: number
   }[]

>(allVendorsFromRedux);

  const [allDepartment, setAllDepartment] = useState<
     {
        departmentName: string;
      }[]
  >(allDepartmentsFromRedux);




  const [selectedVendor, setSelectedVendor] = useState("");

  const [selectedProject, setSelectedProject] = useState("");

  const [selectedClient, setSelectedClient] = useState("");

  const [selectedCategory, setSelectedCategory] = useState('');

  const [selectedVendorCategory, setSelectedVendorCategory] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [startDate, setStartDate] = useState("");

  const [RFQType, setRFQType] = useState("");

  const [RFQHeading, setRFQHeading] = useState("");

  const [amount, setAmount] = useState<number | null>(null);

  const [isUIReady, setIsUIReady] = useState(true);




 

  const fetchProcurementsDataForDraft = useCallback(async () => {
    
  
    if (
      allCateryFromRedux.length !== 0 &&
      allVendorsFromRedux.length !==  0 &&
      allProjectsFromRedux.length !==  0 &&
      allDepartmentsFromRedux.length !==  0 &&
      allVendorsCategoryFromRedux.length !==  0 
      
    )
      return;
      dispatch(toggleLoading(true))
    try {
      const [allProjectsData, vendorCategoryData, vendorsData, departmentData, ] =
        await Promise.all([
          fetchAllProjectDataApi(),
          fetchAllVendorCategoryDataApi(),
          fetchAllVendorsDataApi(),
          fetchAllDepartmentDataApi()
        ]);



        dispatch(toggleLoading(false))
    const vendorsList = vendorsData.data.data.map((vendor: any) => {
   return {
    vendorName: vendor.vendor_name,
    vendorId: vendor.id
   }
    })

    dispatch(populateAllVendors(vendorsList));
    setAllVendors(vendorsList)

  
      const projectList = allProjectsData.data.data.map((project: any) => {
        return {
          projectName: project.project_name,
        };
      });
      dispatch(populateAllProjects(projectList));

      setAllProject(projectList);

      const vendorsCategoryList =  vendorCategoryData.data.data.map(
        (vendorCategory: { name: string , id: number}) => {
          return {
            vendorCategoryId:vendorCategory.id,
            vendorCategoryName: vendorCategory.name,
          };
        }
      );

      setAllVendorsCategory(vendorsCategoryList);
      dispatch(populateAllVendorsCateroy(vendorsCategoryList));
      
      // const categoryList = vendorCategoryData.data.data.map(
      //   (category: { name: string, id: number }) => {
      //     return {
      //       categoryName: category.name,
      //       categoryId: category.id
      //     };
      //   }
      // );

      // setAllCategory(categoryList);
      // dispatch(populateAllCategory(categoryList));

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
      dispatch(toggleLoading(false))
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
    
      fetchProcurementsDataForDraft();
  
  }, [fetchProcurementsDataForDraft]);



const handleUpdateRfq = async () => {
    try {
      if(!RFQType){
        toast.error("procurement type is required")
        return
      }
  if(allVendors.length  === 0){
    toast.error("vendor is required")
    return
  }
  if(allVendorsCategory.length  === 0){
    toast.error("vendor caegory is required")
    return
  }
      if(!amount ){
        toast.error("budget is required")
        return
      }

      if( amount < 0 || amount == 0){
        toast.error("budget can not be negative value")
        return
      }

    
      if(!startDate){
        toast.error("bidding deadline  is required")
        return
      }

let rfqUpdeteData : any;
const requiredFields = {
 
  title,
   subscriber_id:subscriberId, 
   procurement_id:procurementId,
   bidding_deadline: startDate,
   budget: amount,
   procurement_type: RFQType,
   currency: "NGN"
   
    
}


  if(RFQType === "OEM Specific"){
    if( !selectedClient){
      toast.error("Marhant is required")
      return
    }
    if( !selectedVendorCategory){
      toast.error("Vendor category is required")
      return 
    }
    rfqUpdeteData = {
      id,
      rfqUpdateData: {
        ...requiredFields,
        client_project_department: selectedClient,
        vendors : [selectedVendor],
        
      }
     }
      
  }

  if(RFQType === "3rd Party Vendors"){
    if( !selectedProject){
      toast.error("project is required")
      return
    }
    if( !selectedCategory){
      toast.error("vendor category is required")
      return
    }

    rfqUpdeteData = {
      id,
      rfqUpdateData: {
        ...requiredFields,
        client_project_department: selectedProject,
        vendor_category_id : Number(selectedCategory)
      }
     }
  
  }


  if(RFQType === "Internal Procurement"){
    if(!selectedCategory){
      toast.error("vendor category is required")
      return
    }
    if( !selectedDepartment){
      toast.error("department is required")
    }

    if( !selectedVendor){
      toast.error("Vendor is required")
    }

    rfqUpdeteData = {
      id,
      rfqUpdateData: {
        ...requiredFields,
        vendors : [selectedVendor],
        client_project_department: selectedDepartment,
        vendor_category_id : Number(selectedCategory)
      }
     }
   
  }

    dispatch(toggleLoading(true))
    console.log("data sent update", rfqUpdeteData)


   const response =   await updateRFQDataApi(rfqUpdeteData)
   
      dispatch(toggleLoading(false))
      toast.success("Procurement made successfully")
    
    } catch (error: any) {
      dispatch(toggleLoading(false))
      console.error("Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
     
    } finally {
      dispatch(toggleLoading(false))
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
           <option className=" text-black text-sm font-normal font-['Inter']">
                  Select procurement type
                  </option>
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

          

          {RFQType == "OEM Specific" && (
            <div>
              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                 Marchant/Customer
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                   Select marchant
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
                    Select OEM
                  </option>
                  {allVendors?.map((item, index) => {
                    return (
                      <option
                        value={item.vendorId}
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
                   Select project
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
                  Select vendor category
                  </option>
                  {allVendorsCategory.map((item, index) => {
                    return (
                      <option
                        value={item.vendorCategoryId}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.vendorCategoryName}
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
                   Select department
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
                  Select vendor category
                  </option>
                  {allVendorsCategory.map((item, index) => {
                    return (
                      <option
                        value={item.vendorCategoryId}
                        key={index}
                        className=" text-black text-sm font-normal font-['Inter']"
                      >
                        {item.vendorCategoryName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor 
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  <option className=" text-black text-sm font-normal font-['Inter']">
                  Select vendor 
                  </option>
                   {allVendors.map((item, index) => {
                    return (
                      <option
                        value={item.vendorId}
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
              min={1}
                className="flex-1 h-[40px] px-1 border-0 border-none focus:outline-none no-spinner"
                onChange={(e) => {
                        const data = Number(e.target.value)
                       
                  setAmount(data)
                }}
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
           <input type="date"
           onChange={(e) => setStartDate(e.target.value)}
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
                        className={` text-white text-sm  ${
                          procurementType == "draft"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                         <Image src={"/icons/upload.png"} 
                     alt="upload"
                     width={14}
                     height={14}
                   
                     
                     />
                    
                      </button>
                      <button
                        disabled={procurementType == "draft" ? true : false}
                        className={`  ${
                          procurementType == "draft"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                       <Image src={"/icons/delete.png"} 
                      alt="delete"
                     width={14}
                     height={14}
                     
                     />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-row justify-end mt-8">
              <button
              onClick={() => handleUpdateRfq()}
              className="rounded-xl bg-blue-900 text-white py-2 px-4">
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
