import axios from 'axios';
import Image from 'next/image';
import React, { FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ReqViewFormProps {
  tableData: {
    uom_id: number;
    stock_quantity: number | string;
    critical_level: string;
    part_number: string;
    model_number: string;
    description: string;
    type: string;
    remark: string;
    barge_category: string;
    barge_asset: string;
    barge_asset_id: string; // Adjust if it should be a number
    attachements: File[];
  }[];

  handleClose: () => void;
}

const ReqViewForm: React.FC<ReqViewFormProps> = ({ tableData }) => {
  console.log('taag', tableData);
  const [title, setTitle] = useState('');
  const user = useSelector((state: any) => state.user.user);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log('data', tableData);

    e.preventDefault();
    // Add your form submission logic here

    const formDataToSend = new FormData();
    // Append title and user data
    formDataToSend.append('requisition_title', title);
    formDataToSend.append('subscriber_id', user?.subscriber_id || '');
    formDataToSend.append('department_id', user?.department_id || 1);

    // Append requisition data as a JSON string
    formDataToSend.append('requisition', JSON.stringify(tableData));
    try {
      const response = await axios.post(
        `${process.env.BASEURL}/procurement-requisition`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(`${response?.data?.message}`);

      //   setFormData({
      //     uom_id: 0,
      //     stock_quantity: 0 as number | string,
      //     critical_level: '',
      //     part_number: '',
      //     model_number: '',
      //     description: '',
      //     subscriber_id: user?.subscriber_id || ('' as string | number),
      //     type: 'sparepart',
      //     remark: '',
      //     barge_category: '',
      //     barge_asset: '',
      //     barge_asset_id: '',
      //     attachements: [] as File[],
      //   });
      // dispatch(toggleAddEngineModal(''));
      //    fetchData();
      //    handleClose();
      // Handle success (e.g., close modal, show success message)
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
      // Handle error (e.g., show error message)
    } finally {
      //    setLoading(false);
    }
  };

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="model_number"
            placeholder="Input title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                    S/N
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                    Attachments
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 &&
                  tableData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-3 border-b text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 border-b text-sm text-gray-700">
                        {item.stock_quantity}
                      </td>
                      <td className="px-6 py-3 border-b text-sm text-gray-700">
                        {item.description}
                      </td>
                      <td className="px-6 py-3 border-b text-sm text-gray-700">
                        {/* Render attachments if any */}
                        {item.attachements.length > 0 ? (
                          <div className="flex gap-2">
                            {item?.attachements.map(
                              (file: any, fileIndex: number) => (
                                <div
                                  key={fileIndex}
                                  className="relative h-[30px] w-[30px]"
                                >
                                  {file.type.startsWith('image/') ? (
                                    <Image
                                      src={getPreviewUrl(file)}
                                      alt={`Attachment ${index + 1}`}
                                      layout="fill"
                                      objectFit="cover"
                                      className="rounded"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 border border-gray-300 rounded">
                                      <span className="text-xs text-gray-600">
                                        File
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          'No attachments'
                        )}
                      </td>
                      <td className="px-6 py-3 border-b text-sm text-gray-700">
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-2 py-1 rounded"
                            type="button"
                          >
                            Attach File
                          </button>
                          {/* <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded"
                            type="button"
                            onClick={() => {
                              setTableData(
                                tableData.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            Remove
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                {tableData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-3 text-center text-gray-500"
                    >
                      No data available. Please add items to the table.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-blue-600 text-white p-3 rounded-lg ${
              !title ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!title}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReqViewForm;
