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
const [accessToken, setAccessToken] = useState<null | string>()

const dispatch = useDispatch()

console.log("this is the accessToken", accessToken)
 const handleBidVerification = async() => {
    if(!accessToken){
        toast.error("Access token is requred")
        return
    }    
    try {

        console.log("token sent",accessToken)
        dispatch(toggleLoading(true))
        // setshowModal(false)
        const response =  await verifyBidAccessTokenApi(accessToken)
        console.log("this is the response from access", response)
      
       
    } catch (error) {
        const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        "Unknown error";
      toast.error(`${errorMessage}`);
      dispatch(toggleLoading(false))
    }
 }


// useEffect(() => {

// }, [])



console.log("this is the acessToken", accessToken)
const handleCloseModal = () => {
    setshowModal(!showModal)

}

if(showModal){
    return  <Modal
    isOpen={showModal}
    title={""}
    onClose={handleCloseModal}
    maxWidth="960px"
  >
    <div className="flex flex-col items-center justify-center rounded-xl bg-white mx-auto">
    <h2 className='text-2xl text-center text-black font-[inter] font-bold'>
    Create a Bid
   </h2>

   {/*  */}

   <p className='text-xl my-6 text-center text-gray-500 font-[inter]'>
   Please enter the unique ID sent to your email to start creating a bid.
   </p>

    <input
       onChange={(e) => setAccessToken(e.target.value)}
    type="number"
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
<div className=" flex flex-row items-center justify-center px-4 pb-8">
   

   <div className="absolute left-8">
   <Image src="/bongs.svg" alt="the product logo" width="48" height="48" />
   </div>


   <p className='text-xl text-gray-600 font-[inter] font-bold'>
   Bid Submission Form
   </p>

     

   </div>

   <div
   className=" border border-slate-200   mb-6"
   />

{/* header section ends */}


    
    </div>
  )
}

export default page