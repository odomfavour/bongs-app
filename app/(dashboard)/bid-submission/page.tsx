"use client"
import React, {useState} from 'react'
import Image from "next/Image"
import Modal from "@/components/dashboard/Modal";
import { verifyBidAccessTokenApi } from '@/utils/apiServices/procurementApi';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"
import { toggleLoading } from "@/provider/redux/modalSlice";

function page() {
 const [showModal, setshowModal] = useState(true)
const [accessToken, setAccessToken] = useState<null | string>(null)

const [loader, setLoader] = useState(false)

const dispatch = useDispatch()

const [formData, setFormData]= useState({
  rfqId: "",
  subscriberId: "",
  vendorEmail: "",
  vendorName:""
})


console.log("this is the form data", formData)
 const handleBidVerification = async() => {
    if(!accessToken){
        toast.error("Access token is requred")
        return
    }    
    try {

        console.log("token sent",accessToken)
        dispatch(toggleLoading(true))
        setLoader(true)
        //  setshowModal(false)
        const response =  await verifyBidAccessTokenApi(accessToken)
        console.log("this is the response from access", response)
        const {message, data} = response
        const {
          rfq_id,
          subscriber_id,
          vendor_email,
          vendor_name
        } = data

setFormData({
  rfqId: rfq_id,
  subscriberId: subscriber_id,
  vendorName: vendor_name,
  vendorEmail: vendor_email
})

        toast.success(message)
       handleCloseModal()
        setLoader(false)
    } catch (error) {
        const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
      dispatch(toggleLoading(false))
      setLoader(false)
      
    }
 }






const handleCloseModal = () => {
  return  setshowModal(!showModal)

}

if(showModal){

    return  <Modal
    isOpen={showModal}
    title={""}
    onClose={handleCloseModal}
    maxWidth="960px"
  >

    {
      loader && <div className="w-screen h-screen flex justify-center items-center absolute top-0 bottom-0 top-0 left-0 bg-black bg-opacity-50">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin">
      </div>
     </div>
    }
    <div className="flex flex-col items-center justify-center rounded-xl bg-white mx-auto">
    <h2 className='text-2xl text-center text-black font-[inter] font-bold'>
    Create a Bid
   </h2>

   <p className='text-xl my-6 text-center text-gray-500 font-[inter]'>
   Please enter the unique ID sent to your email to start creating a bid.
   </p>

    <input
    onChange={(e) => setAccessToken(e.target.value)}
    placeholder="Enter Unique ID"
     className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/5 p-3 mx-auto"
    />

    <div className="flex items-center justify-center space-x-4 mt-6">
        <button
         
        onClick={() => {
           handleBidVerification()
        }}
        className="text-white bg-blue-700 font-[inter] w-24 py-2 rounded-xl"
        >Continue</button>
        {/* <button
           className="bg-white text-blue-700 font-[inter] border border-blue-700 rounded-xl w-24 py-2"
        >Back</button> */}
    </div>

  
    </div>
  </Modal>
}

  return (
    <div className="">
{/* header sectin ends */}
<div className=" mt-12 flex flex-row items-center justify-center px-4 w-3/4 mx-auto relative">
   

   <div className="absolute left-0">
   <Image src="/bongs.svg" alt="the product logo" width="52" height="52" />
   </div>


   <p className='text-2xl text-center text-gray-600 font-[inter] font-bold'>
   Bid Submission Form
   </p>

     

   </div>

   <div
   className=" border border-slate-200 mt-8 w-full"
   />

{/* header section ends */}

  <div className="mx-auto mt-8 w-full  flex items-center justify-center">
    <form>
      <div className="flex flex-row items-center space-x-4 mb-3">
        <span className="text-gray-900 text-[16px] bold">
          RFQID
        </span>
        <input
        readOnly
        value={formData.rfqId}
     className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
    />
       
      </div>
    
      <div className="flex flex-row items-center space-x-4 mb-3">
        <span className="text-gray-900 text-[16px] bold">
          Vendor
        </span>
        <input
        readOnly
        value={formData.vendorName}

     className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
    />
       
      </div>
      <div className="flex flex-row items-center space-x-4 mb-3">
        <span className="text-gray-900 text-[16px] bold">
        Vendor Email
        </span>
        <input
        readOnly
        value={formData.vendorEmail}
 
     className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 mx-auto w-[300px]"
    />
       
      </div>
    </form>
  </div>
    
    </div>
  )
}

export default page