import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ApproveRequisitionProps {
  selectedReq: number;
  setOpenModal: (isOpen: boolean) => void;
  fetchData: () => void;
}

const ApproveMRequisition: React.FC<ApproveRequisitionProps> = ({
  selectedReq,
  setOpenModal,
  fetchData,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const [tableData, setTableData] = useState<any[]>([]);
  const [procurementItem, setProcurementItem] = useState({});

  const fetchReq = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement-requisition/${selectedReq}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('Approve Response:', response);

      setProcurementItem(response?.data?.data?.procurement);

      setTableData(response?.data?.data?.procurement.procurement_requisitions);
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        error?.message ||
        'Unknown error';
      toast.error(`${errorMessage}`);
    } finally {
      dispatch(toggleLoading(false));
    }
  }, [user?.token, selectedReq, dispatch]);

  useEffect(() => {
    fetchReq();
  }, [fetchReq]);

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div>
      <p>Title</p>
      <p>{procurementItem?.requisition_title} </p>
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
                      {/* {item.attachements.length > 0 ? (
                        <div className="flex gap-2">
                          {item?.attachements.map(
                            (file: any, fileIndex: number) => (
                              <div
                                key={fileIndex}
                                className="relative h-[30px] w-[30px]"
                              >
                                {file?.attachement?.type.startsWith(
                                  'image/'
                                ) ? (
                                  <Image
                                    src={getPreviewUrl(file?.attachement)}
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
                      )} */}
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
      <div className="mt-5">
        <label htmlFor="comment">Comment</label>
        <textarea
          id="remark"
          rows={4}
          placeholder="Input any comments"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
        ></textarea>
      </div>
      <div className="flex justify-end my-4">
        <div className="flex gap-4">
          <button
            className="rounded-md border border-red-700 text-red-700 py-2 px-4"
            onClick={() => setOpenModal(false)}
          >
            Decline
          </button>
          <button className="rounded-md bg-blue-700 text-white py-2 px-4">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveMRequisition;
