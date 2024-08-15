import {
  chooseClientData,
  chooseVendor,
  countries,
  RFQTypeDataArray,
} from "@/utils/data";
import Image from "next/image";
import React, { useState } from "react";
import Flag from "react-world-flags";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus } from "react-icons/fa";
import { FaRegFolderClosed } from "react-icons/fa6";

function ProcurementAddRequestModal() {
  /* 
"OEM Specific"|"3rd Party Vendors"| "Internal Procurement"
*/
  const [startDate, setStartDate] = useState(new Date());

  const [RFQType, setRFQType] = useState("OEM Specific");

  const [RFQHeading, setRFQHeading] = useState("");


 const [list, setList] = useState([])

  const [amount, setAmount] = useState<string | null>(null);

  return (
    <div className="flex flex-row py-8 space-x-12">
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
                  onChange={(e) => setRFQType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  {chooseClientData.map((item, index) => {
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
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor/OEM
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setRFQType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  {chooseVendor.map((item, index) => {
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
                  onChange={(e) => setRFQType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  {chooseClientData.map((item, index) => {
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
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor Category
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setRFQType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  {chooseVendor.map((item, index) => {
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
                  onChange={(e) => setRFQType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  {chooseClientData.map((item, index) => {
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
              </div>

              <div className="mt-2">
                <p className="text-black text-lg font-normal font-['Inter']">
                  Choose Vendor Category
                </p>
                <select
                  name=""
                  id=""
                  onChange={(e) => setRFQType(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-[332px] mb-2"
                >
                  {chooseVendor.map((item, index) => {
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
                className="flex-1 h-[40px] px-1 border-0"
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
        <div className="flex flex-row items-center space-x-12">
          <input
            name=""
            id=""
            onChange={e => setRFQHeading(e.target.value)}
            placeholder="Input RFQ title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-3 w-full"
          />
          <div className="w-44 h-[46px] bg-[#d9d9d9] rounded-[10px] border justify-center items-center flex flex-row space-x-1 cursor-pointer">
            <FaPlus />
            <p className="text-black text-xl font-normal font-['Inter']">
              Add More
            </p>
          </div>
        </div>
        {
            list.length > 0 ?    
            <div>
            list now
          </div> :  <div className="flex flex-col justify-center items-center  mt-8">
          <div className="flex w-full justify-center items-center">
                <FaRegFolderClosed className="text-4xl" />
              </div>
              <div className="mt-5 flex flex-col justify-center items-center">
                <p className="font-medium text-[#475467]">
                  No RFQ
                </p>
                <p className="font-normal text-sm mt-3 text-center">
                  Click “add ” button to get started in doing your
                  <br /> first transaction on the platform
                </p>
              </div>
          </div>
        }
      </div>
    </div>
  );
}

export default ProcurementAddRequestModal;
