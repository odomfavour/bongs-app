'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Define a type for the file object, containing the actual file and its preview URL
interface FileObject {
  file: File;
  preview: string;
}

const Page: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input
  const router = useRouter();
  // State to store form data including PO, title, and files
  const [formData, setFormData] = useState<{
    purchase_order_id: number;
    title: string;
    qa_files: FileObject[];
    subscriber_id: number;
  }>({
    purchase_order_id: 0,
    title: '',
    qa_files: [],
    subscriber_id: 0,
  });

  useEffect(() => {
    const storedPurchaseOrderId = localStorage.getItem('qaVendoeDetail');

    if (storedPurchaseOrderId !== null) {
      try {
        const parsedData = JSON.parse(storedPurchaseOrderId);
        setFormData((prevData: any) => ({
          ...prevData,
          purchase_order_id: Number(parsedData.purchase_order_id),
          subscriber_id: Number(parsedData.subscriber_id),
        }));
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  // Function to handle adding files and generating previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        qa_files: [...prevFormData.qa_files, ...newFiles],
      }));

      // Clear the input value to allow re-uploading of the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Function to handle removing files and cleaning up previews
  const handleRemoveFile = (index: number) => {
    const fileToRemove = formData.qa_files[index];
    URL.revokeObjectURL(fileToRemove.preview); // Clean up URL object
    setFormData((prevFormData) => ({
      ...prevFormData,
      qa_files: prevFormData.qa_files.filter((_, i) => i !== index),
    }));
  };

  // Function to submit form data
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement/quality-assurance/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message);
      console.log('Form submitted successfully');
      localStorage.setItem('qaVendoeDetail', '');
      router.push('/qa-qc-submission-success');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    }
  };

  return (
    <div className="w-1/3">
      <p className="mb-5 text-center font-semibold text-lg">
        QA/QC Vendor Submission
      </p>
      <div className="flex gap-4 items-center justify-between mb-3">
        <label htmlFor="purchase_order_id" className="w-1/6">
          PO
        </label>
        <div className="w-5/6">
          <input
            name="purchase_order_id"
            value={formData.purchase_order_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                purchase_order_id: Number(e.target.value),
              })
            }
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mx-auto"
          />
        </div>
      </div>

      <div className="flex gap-4 items-center justify-between mb-3">
        <label htmlFor="title" className="w-1/6">
          Title
        </label>
        <div className="w-5/6">
          <input
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter Title"
            className="bg-gray-50 pl-4 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mx-auto"
          />
        </div>
      </div>

      <div className="mt-5">
        <p>Instructions</p>
        <div className="mt-4">
          <p>
            Kindly upload a video showing the loading process. Also, include
            images of all items with part numbers visible.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-3"
          />

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!formData.title || formData.qa_files.length === 0}
              className={` ${
                !formData.title || formData.qa_files.length === 0
                  ? 'bg-gray-500'
                  : 'bg-blue-700 text-white'
              } w-24 py-2 rounded-xl`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Display the uploaded image previews */}
      <div className="mt-4">
        {formData.qa_files.map((fileObj, index) => (
          <div key={index} className="flex items-center justify-between mt-2">
            <Image
              src={fileObj.preview}
              alt="preview"
              className="w-16 h-16 object-cover rounded"
              width={64}
              height={64}
            />
            <FaTrash
              onClick={() => handleRemoveFile(index)}
              className="text-red-600 cursor-pointer ml-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
