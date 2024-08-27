"use client";
import React, { useState } from "react";
import { creactNewBidApi, verifyBidAccessTokenApi } from "@/utils/apiServices/procurementApi";
import { toggleLoading } from "@/provider/redux/modalSlice";
import Modal from "../dashboard/Modal";
import Image from "next/image";
import { MdCancel } from "react-icons/md";
import {useDispatch} from "react-redux"
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";


function BidAccessComp() {
  const [showModal, setshowModal] = useState(true);
  const [accessToken, setAccessToken] = useState<null | string>(null);

  const [loader, setLoader] = useState(false);

 



  const [formData, setFormData] = useState<{
    rfqId: string;
    subscriberId: string;
    vendorEmail: string;
    vendorName: string;
    bidItems:
     any[]
  }>({
    rfqId: "",
    subscriberId: "",
    vendorEmail: "",
    vendorName: "",
    bidItems: [],
  });

  const [files, setFiles] = useState< {
    file: string,
    index: number,
    originalFile: any
  }[]>([]);

  const validImageTypes = ["image/jpeg", "image/png"] as const;
  type ValidImageType = (typeof validImageTypes)[number];

  const [cost, setCost] = useState("");

  const [paymentTerms, setPaymentTerms] = useState("");
  const [validityPeriodTo, setValidityPeriodTo] = useState("");
  const [validityPeriodFrom, setValidityPeriodFrom] = useState("");

  const [deliveryScheduleFrom, setDeliveryScheduleFrom] = useState("");
  const [deliveryScheduleTo, setDeliveryScheduleTo] = useState("");
  
 const dispatch = useDispatch()

  const handleImageUpload = async (file: any) => {
    console.log("seleted file", file)
    const maxSize = 1 * 1024 * 1024; // 1 MB in bytes
    if (file.size > maxSize) { 
      toast("File size greated the 1MB please reduce file size")
      return
    }
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setFiles([...files, {
        file: imgUrl,
        index: files.length,
        originalFile: file
      }]);
    }

    
  };

  console.log("this is the form data", formData);
  const handleBidVerification = async () => {
    if (!accessToken) {
      toast.error("Access token is requred");
      return;
    }
    try {
      dispatch(toggleLoading(true));
      setLoader(true);

      const response = await verifyBidAccessTokenApi(accessToken);
      console.log("this is the response from access", response);
      const { message, data } = response;
      const { rfq_id, subscriber_id, vendor_email, vendor_name, bid_items } =
        data;
      const newBid = bid_items.map((bid: any, index: number) => {
        return {
          id: index,
          name: bid.name,
          quantity: bid.quantity,
          unitPrice: null,
        };
      });
      setFormData({
        rfqId: rfq_id,
        subscriberId: subscriber_id,
        vendorName: vendor_name,
        vendorEmail: vendor_email,
        bidItems: newBid,
      });

      toast.success(message);
      handleCloseModal();
      setLoader(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
      dispatch(toggleLoading(false));
      setLoader(false);
    }
  };

  const handleCloseModal = () => {
    return setshowModal(!showModal);
  };

  if (showModal) {
    return (
      <Modal
        isOpen={showModal}
        title={""}
        onClose={handleCloseModal}
        maxWidth="860px"
      >
        {loader && (
          <div className="w-screen h-screen flex justify-center items-center absolute bottom-0 top-0 left-0 bg-black bg-opacity-50">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center rounded-xl bg-white mx-auto">
          <h2 className="text-2xl text-center text-black font-[inter] font-bold">
            Create a Bid
          </h2>

          <p className="text-xl my-6 text-center text-gray-500 font-[inter]">
            Please enter the unique ID sent to your email to start creating a
            bid.
          </p>

          <input
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter Unique ID"
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/5 p-3 mx-auto"
          />

          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={() => {
                handleBidVerification();
              }}
              className="text-white bg-blue-700 font-[inter] w-24 py-2 rounded-xl"
            >
              Continue
            </button>
            {/* <button
           className="bg-white text-blue-700 font-[inter] border border-blue-700 rounded-xl w-24 py-2"
        >Back</button> */}
          </div>
        </div>
      </Modal>
    );
  }


  const handleCreateBid= async () => {
    if (!formData.subscriberId) {
      toast.error("subscriber is required");
      return;
    }
    if (!formData.rfqId) {
      toast.error("request fro qoutation Id is required");
      return;
    }
    if (!formData.vendorEmail) {
      toast.error("vendor email is required");
      return;
    }
    if (!formData.vendorName) {
      toast.error("vendor name is required");
      return;
    }
    if (formData.bidItems.length > 0) {
      let error; 
      const result = formData.bidItems.filter(bid => bid.unitPrice === null)
      if(result.length > 0){
        toast.error("All qoutation unit price must be greater than zero");
        return;
      }
    
     
    }
    if (!paymentTerms) {
      toast.error("payment terms is required");
      return;
    }
    if (!validityPeriodFrom) {
      toast.error("validity period from is required");
      return;
    }
    if (!validityPeriodTo) {
      toast.error("validity period to is required");
      return;
    }

    if (!deliveryScheduleTo) {
      toast.error("validity schedule to is required");
      return;
    }

    if (!deliveryScheduleFrom) {
      toast.error("delivery schedule from is required");
      return;
    }
    if (files.length === 0) {
      toast.error("file to upload is required");
      return;
    }

    if (!cost) {
      toast.error("cost price is required");
      return;
    }


    try {
      dispatch(toggleLoading(true));
  
     const bidList = formData.bidItems.map(bid => {
      return {
      name: bid.name,
      qauntity: bid.quantity,
      unitPrice: bid.unitPrice
      }})
      const response = await creactNewBidApi(
        {
           cost: Number(cost),
           currency: "NGN",
           bid_files: files.map(data => data.file),
           payment_term:paymentTerms,
           subscriber_id:Number(formData.subscriberId),
           request_for_qoutation_id: Number(formData.rfqId),
           vendor_email: formData.vendorEmail,
           vendor: formData.vendorName,
           bid_items: bidList ,
           deleivery_date: deliveryScheduleTo,
           from_delivery_date: deliveryScheduleFrom,
           validity_period_from: validityPeriodFrom,
           validity_period_to: validityPeriodTo

        });
      console.log("this is the response from access", response);
      const { message, data } = response;
      const { rfq_id, subscriber_id, vendor_email, vendor_name, bid_items } =
        data;
      const newBid = bid_items.map((bid: any, index: number) => {
        return {
          id: index,
          name: bid.name,
          quantity: bid.quantity,
          unitPrice: null,
        };
      });
      setFormData({
        rfqId: rfq_id,
        subscriberId: subscriber_id,
        vendorName: vendor_name,
        vendorEmail: vendor_email,
        bidItems: newBid,
      });

      toast.success(message);
      handleCloseModal();
      setLoader(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
      dispatch(toggleLoading(false));
      setLoader(false);
    }
  };
  return (
    <div className="">
      {/* header sectin ends */}
      <div className=" mt-12 flex flex-row items-center justify-center px-4 w-3/4 mx-auto relative">
        <div className="absolute left-0">
          <Image
            src="/bongs.svg"
            alt="the product logo"
            width="52"
            height="52"
          />
        </div>

        <p className="text-2xl text-center text-gray-600 font-[inter] font-bold">
          Bid Submission Form
        </p>
      </div>

      <div className=" border border-slate-200 mt-8 w-full" />

      {/* header section ends */}

      <div className="mx-auto mt-8 w-full  flex items-center justify-center">
        <form>
          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] text-bold">RFQID:</span>
            <input
              readOnly
              value={formData.rfqId}
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
            />
          </div>

          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">Vendor:</span>
            <input
              readOnly
              value={formData.vendorName}
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
            />
          </div>
          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">
              Vendor Email:
            </span>
            <input
              readOnly
              value={formData.vendorEmail}
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
            />
          </div>

          <div>
            <h2 className="text-center my-3  mb-1 text-lg text-bold">
              Qoutation List
            </h2>
            <table>
              <thead>
                <tr>
                  <td className="text-center">S/N</td>
                  <td className="text-center">Items</td>
                  <td className="text-center">Quantity</td>
                  <td className="text-center">Unit Price</td>
                </tr>
              </thead>
              <tbody>
                {formData.bidItems.map((bid, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{bid.name}</td>
                      <td className="text-center">{bid.quantity}</td>
                      <td className="text-center">
                        <input
                          type="number"
                          name=""
                          id=""
                          onChange={(e) => {
                      const result =      formData.bidItems.map((bid) => {
                              if (bid.id === index) {
                                return {
                                  id: index,
                                  name: bid.name,
                                  quantity: bid.quantity,
                                  unitPrice:Number(e.target.value),
                                };
                              }
                              return bid
                            });
                            setFormData({
                              ...formData,
                              bidItems: result
                            })
                          }}
                          placeholder="Enter Price"
                          className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-3 "
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-row items-center space-x-4 mb-3 mt-3">
            <span className="text-gray-900 text-[16px] bold">Cost:</span>
            <input
              value={cost}
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
              onChange={(e) => {
                if (e.target.value === null) return;
                setCost(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">
              Payment Terms:
            </span>
            <input
            value={paymentTerms}
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
              onChange={(e) => setPaymentTerms(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">
              Validity Period From:
            </span>
            <input
              type="date"
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
              onChange={(e) => setValidityPeriodFrom(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">
              Validity Period To:
            </span>
            <input
              type="date"
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
              onChange={(e) => setValidityPeriodTo(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">
              Delivery Schedule From:
            </span>
            <input
              type="date"
              placeholder="Delivery schedule from "
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
              onChange={(e) => setDeliveryScheduleFrom(e.target.value)}
            />
          
          </div>

          <div className="flex flex-row items-center space-x-4 mb-3">
            <span className="text-gray-900 text-[16px] bold">
              Delivery Schedule To:
            </span>
            <input
              type="date"
              className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
              onChange={(e) => setDeliveryScheduleTo(e.target.value)}
            />
          
          </div>
        
          <div className="flex flex-row items-center space-x-4 mb-3 ">
          <span className="text-gray-900 text-[16px] bold">
              File:
            </span>
          <div className="px-4 py-2 rounded-lg bg-gray-400 relative flex justify-center items-center">
           <label
              htmlFor="file"
              className="flex sm:flex-row flex-col space-x-1 cursor-pointer"
            >
              <IoMdAdd />
              <p className="text-black text-sm text-center font-medium font-['Inter'] leading-tight">
                Add new file
              </p>
            
            </label>
            <input
              id="file"
              type="file"
              className="hidden"
              onChange={(e) => {
                let files = e.target.files;

                if (files && files[0]) {
                  if (
                    !validImageTypes.includes(files[0].type as ValidImageType)
                  ) {
                    toast.error(
                      "Please upload a valid image file (JPEG or PNG)."
                    );
                    return;
                  }

                  handleImageUpload(files[0]);
                }
              }}
            />
           </div>


          </div>

          {/* image list start */}
        <div className="flex flex-row items-center space-x-2 mb-3">
          {
            files.map((fileObj, index) => <div  
          
            className={`relative w-24 h-24`}   
             key={index}>
              
               <Image
               src={fileObj.file} 
               alt="Uploaded"
              layout="fill"
             />
              <MdCancel
              size={24}
              onClick={() => {
                const filterImage = files.filter(image=> image.index !== fileObj.index)
                setFiles([...filterImage])
              }}
              color="red"
              className="absolute right-2 top-2 "
              />
            </div>)
          }
        </div>

          {/* image list ends */}
         


        </form>
      </div>
    </div>
  );
}

export default BidAccessComp;
