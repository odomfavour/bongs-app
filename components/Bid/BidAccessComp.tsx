'use client';
import React, { useState, useEffect } from 'react';
import {
  creactNewBidApi,
  verifyBidAccessTokenApi,
} from '@/utils/apiServices/procurementApi';
import { toggleLoading } from '@/provider/redux/modalSlice';
import Modal from '../dashboard/Modal';
import Image from 'next/image';
import { MdCancel } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { IoMdAdd } from 'react-icons/io';
import { FaFilePdf } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { percentageData, warrantyData } from '@/utils/data';
import { currencyFormatter } from '@/utils/usefulFunc';

function BidAccessComp() {
  const [showModal, setshowModal] = useState(true);
  const [accessToken, setAccessToken] = useState<null | string>(null);

  const [loader, setLoader] = useState(false);

  const router = useRouter();
  const [formData, setFormData] = useState<{
    rfqId: string;
    subscriberId: string;
    vendorEmail: string;
    vendorName: string;
    vendor_id: string;
    bidItems: any[];
  }>({
    rfqId: '',
    subscriberId: '',
    vendorEmail: '',
    vendorName: '',
    vendor_id: '',
    bidItems: [],
  });
  const [updatedData, setUpdatedData] = useState<any>({});
  const [minDate, setMinDate] = useState('');
 

  const [files, setFiles] = useState<
    {
      file: string;
      index: number;
      originalFile: any;
    }[]
  >([]);

  const [excelType, setExcelType] = useState<
    {
      fileName: string;
      index: number;
      originalFile: any;
    }[]
  >([]);

  const validImageTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ] as const;
  type ValidImageType = (typeof validImageTypes)[number];

  const [cost, setCost] = useState<null | number>(null);

  useEffect(() => {
    const totalCost = formData.bidItems.reduce((acc, item) => {
      const itemCost = Number(item.unitPrice) * Number(item.quantity);
      return acc + (isNaN(itemCost) ? 0 : itemCost);
    }, 0);
    setCost(totalCost);
  }, [formData.bidItems]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  const [pdfType, setPdfType] = useState<
    {
      fileName: string;
      index: number;
      originalFile: any;
    }[]
  >([]);

  const [docType, setDocType] = useState<
    {
      fileName: string;
      index: number;
      originalFile: any;
    }[]
  >([]);

  const [paymentTerms, setPaymentTerms] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState(0);
  const [validityPeriodTo, setValidityPeriodTo] = useState('');

  const [deliveryScheduleFrom, setDeliveryScheduleFrom] = useState('');
  const [deliveryScheduleTo, setDeliveryScheduleTo] = useState('');

  const handleImageUpload = async (file: any) => {
    const maxSize = 1 * 1024 * 1024; // 1 MB in bytes
    if (file.size > maxSize) {
      toast('File size greated the 1MB please reduce file size');
      return;
    }


    if (
      file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setExcelType([
        ...excelType,
        {
          fileName: file.name,
          index: excelType.length,
          originalFile: file,
        },
      ]);

      return;
    }
    if (file.type === 'application/msword') {
      setDocType([
        ...docType,
        {
          fileName: file.name,
          index: docType.length,
          originalFile: file,
        },
      ]);

      return;
    }

    if (file.type === 'application/pdf') {
      setPdfType([
        ...pdfType,
        {
          fileName: file.name,
          index: pdfType.length,
          originalFile: file,
        },
      ]);

      return;
    }
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setFiles([
        ...files,
        {
          file: imgUrl,
          index: files.length,
          originalFile: file,
        },
      ]);
    }
  };

  const calculateSubTotal = () => {
    if (paymentTerms && cost) {
      const result = Number(paymentTerms) * cost;
      return result;
    } else {
      return null;
    }
  };

  // useEffect(() => {
  //   if (updatedData.id) {
  //     let pay = (Number(updatedData.payment_term) * 10).toString();

  //     setPaymentTerms(pay);
  //     setDeliveryScheduleFrom(updatedData.from_delivery_date);
  //     setDeliveryScheduleTo(updatedData.delivery_date);
  //     setWarrantyPeriod(updatedData.warranty);
  //     const days = parseInt(
  //       updatedData.quote_validity_period.split(' ')[0],
  //       10
  //     ); // Extract the number part, e.g., "2"

  //     // Get today's date
  //     const today = new Date();

  //     // Add the number of days
  //     const validityDate = new Date(today);
  //     validityDate.setDate(today.getDate() + days); // Add the extracted days

  //     // Format the date as 'YYYY-MM-DD'
  //     const formattedDate = validityDate.toISOString().split('T')[0];

  //     // Inject the date back into the state
  //     setValidityPeriodTo(formattedDate);
  //   }
  // }, [updatedData]);

  const subtotal = calculateSubTotal();

  const balance = cost && subtotal ? cost - subtotal : null;
  const handleBidVerification = async () => {
    if (!accessToken) {
      toast.error('Access token is requred');
      return;
    }
    try {
      setLoader(true);
      const response = await verifyBidAccessTokenApi(accessToken);
      const { message, data } = response;

      const {
        id,
        rfq_id,
        subscriber_id,
        vendor_email,
        vendor_name,
        bid_items,
        vendor_id,
      } = data;
      if (id) {
        setUpdatedData(data);
      }

      console.log('response from bid', response);

      const newBid = bid_items.map((bid: any, index: number) => {
        return {
          item_id: bid.item_id,
          name: bid.name,
          quantity: bid.quantity,
          unitPrice: null,
          unit_of_measurement: bid.unit_of_measurement,
        };
      });
      setFormData({
        rfqId: id ? data?.request_for_quotation_id : rfq_id,
        subscriberId: id ? data?.subscriber_id : subscriber_id,
        vendorName: id ? data.vendor : vendor_name,
        vendorEmail: id ? data.vendor_email : vendor_email,
        vendor_id: id ? data.vendor_id : vendor_id,
        bidItems: id ? data?.bid_items : newBid,
      });

      toast.success(message);
      handleCloseModal();
      setLoader(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
      setLoader(false);
    }
  };


  useEffect(() => {
    if (updatedData) {
      setFormData({
        rfqId: updatedData.request_for_quotation_id?.toString() || '',
        subscriberId: updatedData.subscriber_id?.toString() || '',
        vendorEmail: updatedData.vendor_email || '',
        vendorName: updatedData.vendor || '',
        vendor_id: updatedData.vendor_id?.toString() || '',
        bidItems: updatedData.bid_items?.map((item: any) => ({
          item_id: item.item_id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          unit_of_measurement: item.unit_of_measurement,
        })) || [],
      });
      setCost(updatedData.cost || 0);
      setPaymentTerms(updatedData.payment_term?.toString() || '');
      setWarrantyPeriod(updatedData.warranty || 0);
      setDeliveryScheduleFrom(updatedData.from_delivery_date || '');
      setDeliveryScheduleTo(updatedData.delivery_date || '');
      
      // Calculate validity period date
      const validityPeriodString = updatedData.quote_validity_period || '';
      const daysMatch = validityPeriodString.match(/\d+/);
      if (daysMatch) {
        const days = parseInt(daysMatch[0], 10);
        const validityDate = new Date();
        validityDate.setDate(validityDate.getDate() + days);
        const formattedDate = validityDate.toISOString().split('T')[0];
        setValidityPeriodTo(formattedDate);
      } else {
        setValidityPeriodTo('');
      }
    }
  }, [updatedData]);

  const handleCloseModal = () => {
    return setshowModal(!showModal);
  };

  const handleCreateBid = async () => {
    console.log(formData)
    if (!formData.subscriberId) {
      toast.error('subscriber is required');
      return;
    }
    if (!formData.rfqId) {
      toast.error('request fro qoutation Id is required');
      return;
    }
    if (!formData.vendorEmail) {
      toast.error('vendor email is required');
      return;
    }
    if (!formData.vendorName) {
      toast.error('vendor name is required');
      return;
    }
    if (!subtotal) {
      toast.error('subtotal is required');
      return;
    }
    if (!balance) {
      toast.error('balance is required');
      return;
    }
    if (formData.bidItems.length > 0) {
      let error;
      const result = formData.bidItems.filter((bid) => bid.unitPrice === null);
      if (result.length > 0) {
        toast.error('All qoutation unit price must be greater than zero');
        return;
      }
    }
    if (!paymentTerms) {
      toast.error('payment terms is required');
      return;
    }

    if (!validityPeriodTo) {
      toast.error('validity period to is required');
      return;
    }

    if (!deliveryScheduleTo) {
      toast.error('delivery schedule to is required');
      return;
    }

    if (!deliveryScheduleFrom) {
      toast.error('delivery schedule from is required');
      return;
    }
    /* if (files.length === 0) {
      toast.error("file to upload is required");
      return;
    } */

    if (!cost) {
      toast.error('cost price is required');
      return;
    }

    try {
      const bidList = formData.bidItems.map((bid) => {
    
        return {
          item_id: bid.item_id,
          name: bid.name,
          quantity: bid.quantity,
          unit_price: bid.unitPrice,
          unit_of_measurement: bid.unit_of_measurement,
        };
      });

      const imageArray = files.map((data) => data.originalFile);
      const pdfArray = pdfType.map((data) => data.originalFile);
      const docArray = docType.map((data) => data.originalFile);
      const excelArray = excelType.map((data) => data.originalFile);

      // console.log('files sent', [...imageArray, ...pdfArray]);
      //   files.map((data) => data.originalFile)
      // return
      setLoader(true);
      const response = await creactNewBidApi({
        cost: Number(cost),
        currency: 'NGN',
        bid_files: [...imageArray, ...pdfArray, ...docArray, ...excelArray],
        payment_term: Number(paymentTerms),
        warranty: Number(warrantyPeriod),
        subscriber_id: Number(formData.subscriberId),
        vendor_id: Number(formData.vendor_id),
        request_for_quotation_id: Number(formData.rfqId),
        vendor_email: formData.vendorEmail,
        vendor: formData.vendorName,
        bid_items: bidList,
        delivery_date: deliveryScheduleTo,
        from_delivery_date: deliveryScheduleFrom,
        balance: Number(balance),
        subTotal: Number(subtotal),
        validity_period_to: validityPeriodTo,
      });

      const { message, data } = response;
      toast.success(message);

      setLoader(false);
      router.push('/bid-submission-success');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      console.log(error.response);
      toast.error(`${errorMessage}`);

      setLoader(false);
    }
  };

  if (showModal) {
    return (
      <Modal
        isOpen={showModal}
        title={''}
        onClose={handleCloseModal}
        maxWidth="860px"
        hidden={true}
      >
        {loader && (
          <div className="w-screen h-screen flex justify-center items-center absolute bottom-0 top-0 left-0 bg-black bg-opacity-50">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center rounded-xl bg-white mx-auto">
          <h2 className="text-2xl text-center text-black  font-bold">
            Create a Bid
          </h2>

          <p className="text-xl my-6 text-center text-gray-500 ">
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
              className="text-white bg-blue-700  w-24 py-2 rounded-xl"
            >
              Continue
            </button>
            {/* <button
           className="bg-white text-blue-700  border border-blue-700 rounded-xl w-24 py-2"
        >Back</button> */}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div className="relative">
      {/* loader section start */}
      {loader && (
        <div className="flex justify-center items-center absolute bottom-0 top-0 left-0 right-0 bg-black bg-opacity-50 z-30">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {/* loader setion ends */}
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

        <p className="text-2xl text-center text-gray-600  font-bold">
          Bid Submission Form
        </p>
      </div>

      <div className=" border border-slate-200 mt-8 w-full" />

      {/* header section ends */}

      <div className="mx-auto mt-8 w-[500px] ">
        <div className="flex flex-row items-center  justify-between mb-3">
          <span className="text-gray-900 text-[16px] text-bold">RFQID:</span>
          <input
            readOnly
            value={formData.rfqId}
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
          />
        </div>

        <div className="flex flex-row items-center justify-between mb-3">
          <span className="text-gray-900 text-[16px] bold">Vendor:</span>
          <input
            readOnly
            value={formData.vendorName}
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
          />
        </div>
        <div className="flex flex-row items-center justify-between mb-3">
          <span className="text-gray-900 text-[16px] bold">Vendor Email:</span>
          <input
            readOnly
            value={formData.vendorEmail}
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
          />
        </div>

        <div>
          <h2 className="text-center my-3  mb-1 text-lg text-bold">
            Quotation List
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
                    value={bid.unitPrice || ''}
                    onChange={(e) => {
                      const newBidItems = [...formData.bidItems];
                      newBidItems[index] = {
                        ...newBidItems[index],
                        unitPrice: e.target.value,
                      };
                      setFormData({
                        ...formData,
                        bidItems: newBidItems,
                      });
                    }}
                    placeholder="Enter Price"
                    className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-3"
                  />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-row items-center justify-between mb-3 mt-3">
          <span className="text-gray-900 text-[16px] bold">Cost:</span>
          <input
            readOnly
            value={cost ? currencyFormatter(parseFloat(cost.toFixed(2))) : ''}
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
          />
        </div>
        <div className="flex flex-row items-center justify-between   mb-3">
          <span className="text-gray-900 text-[16px] bold">
            Payment Terms(%):
          </span>
          <select
            name=""
            id=""
            value={ Number(paymentTerms)
            }
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
            onChange={(e) => setPaymentTerms(e.target.value)}
          >
            <option value="">Select Payment term</option>
            {percentageData.map((data, index) => (
              <option
                className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
                value={data}
                key={index}
              >
                {data}%
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center justify-between   mb-3">
          <span className="text-gray-900 text-[16px] bold">
            Warranty (month(s)):
          </span>
          <select
            name=""
            id=""
            value={ warrantyPeriod}
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
            onChange={(e) => setWarrantyPeriod(Number(e.target.value))}
          >
            <option value="">Select Warranty Period</option>
            {warrantyData.map((monthNumber, index) => (
              <option
                className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px]"
                value={monthNumber}
                key={index}
              >
                {monthNumber} month{monthNumber === 1 ? '' : "'s"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row items-center justify-between   mb-3">
          <span className="text-gray-900 text-[16px] bold">Subtotal:</span>

          <span className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px] min-h-10">
            {subtotal && currencyFormatter(parseFloat(subtotal.toFixed(2)))}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between   mb-3">
          <span className="text-gray-900 text-[16px] bold">Balance:</span>

          <span className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3  w-[300px] min-h-10">
            {balance && currencyFormatter(parseFloat(balance.toFixed(2)))}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between  mb-3">
          <span className="text-gray-900 text-[16px] bold">Valid Until:</span>
          <input
            type="date"
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 w-[300px]"
            value={validityPeriodTo}
            min={minDate}
            onChange={(e) => setValidityPeriodTo(e.target.value)}
          />
        </div>

        <div className="flex flex-row items-center justify-between mb-3">
          <span className="text-gray-900 text-[16px] bold">
            Delivery Schedule From:
          </span>
          <input
            type="date"
            placeholder="Delivery schedule from "
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 w-[300px]"
            value={deliveryScheduleFrom}
            onChange={(e) => setDeliveryScheduleFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-row items-center justify-between mb-3">
          <span className="text-gray-900 text-[16px] bold">
            Delivery Schedule To:
          </span>
          <input
            min={deliveryScheduleFrom}
            type="date"
            value={deliveryScheduleTo}
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-3 w-[300px]"
            onChange={(e) => setDeliveryScheduleTo(e.target.value)}
          />
        </div>

        <div className="flex flex-row items-center justify-between mb-3 ">
          <span className="text-gray-900 text-[16px] bold">File:</span>
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
                      'Please upload a pdf, doc file or a valid image file (JPEG or PNG).'
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
        <div className="flex flex-row items-start space-x-2 mb-3">
          {files.map((fileObj, index) => (
            <div className={`w-24`} key={index}>
              <div className={`relative w-24 h-24`}>
                <Image src={fileObj.file} alt="Uploaded" layout="fill" />
                <MdCancel
                  size={24}
                  onClick={() => {
                    const filterImage = files.filter(
                      (image) => image.index !== fileObj.index
                    );
                    setFiles([...filterImage]);
                  }}
                  color="red"
                  className="absolute right-2 top-2 "
                />
              </div>
              <span className="text-sm  block text-wrap ">{fileObj.file}</span>
            </div>
          ))}

          {pdfType.map((pdf, index) => {
            // console.log("pdf created", pdf)
            return (
              <div key={index} className={`w-24`}>
                <div className={`relative w-24 h-24`}>
                  <Image src={'/icons/pdf.jpeg'} alt="Uploaded" layout="fill" />

                  <MdCancel
                    size={24}
                    onClick={() => {
                      const pdfArray = pdfType.filter(
                        (pdfList) => pdfList.index !== pdf.index
                      );
                      setPdfType([...pdfArray]);
                    }}
                    color="red"
                    className="absolute right-2 top-2 "
                  />
                </div>

                <span className="text-sm w-24 text-wrap z-50">
                  {pdf.fileName}
                </span>
              </div>
            );
          })}
          {/* doctype starts */}
          {docType.map((mydoc, index) => {
            // console.log("pdf created", pdf)
            return (
              <div key={index} className={`w-24`}>
                <div className={`relative w-24 h-24`}>
                  <Image
                    src={'/icons/wordDoc.jpeg'}
                    alt="Uploaded"
                    layout="fill"
                  />

                  <MdCancel
                    size={24}
                    onClick={() => {
                      const docArray = docType.filter(
                        (docList) => docList.index !== mydoc.index
                      );
                      setDocType([...docArray]);
                    }}
                    color="red"
                    className="absolute right-2 top-2 "
                  />
                </div>

                <span className="text-sm w-24 text-wrap z-50">
                  {mydoc.fileName}
                </span>
              </div>
            );
          })}
          {/* doctype ends */}
          {/* excel section */}

          {excelType.map((myexcel, index) => {
            // console.log("pdf created", pdf)
            return (
              <div key={index} className={`w-24`}>
                <div className={`relative w-24 h-24`}>
                  <Image
                    src={'/icons/excelImage.jpeg'}
                    alt="Uploaded"
                    layout="fill"
                  />

                  <MdCancel
                    size={24}
                    onClick={() => {
                      const excelArray = excelType.filter(
                        (excelList) => excelList.index !== myexcel.index
                      );
                      setExcelType([...excelArray]);
                    }}
                    color="red"
                    className="absolute right-2 top-2 "
                  />
                </div>

                <span className="text-sm w-24 text-wrap z-50">
                  {myexcel.fileName}
                </span>
              </div>
            );
          })}
        </div>

        {/* image list ends */}

        <div className="flex flex-row justify-end mb-4 cursor-pointer">
          <div
            onClick={() => {
              handleCreateBid();
            }}
            className="bg-blue-700 rounded-lg px-3 py-2 text-white ml-auto"
          >
            <span className="text-white text-lg">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidAccessComp;
