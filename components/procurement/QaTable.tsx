import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface ApprovePOProps {
  selectedQA: number;
  // setOpenApprovePO: (isOpen: boolean) => void;
  fetchQAData: () => void;
}

const QaTable: React.FC<ApprovePOProps> = ({
  selectedQA,
  // setOpenApprovePO,
  fetchQAData,
}) => {
  const user = useSelector((state: any) => state.user.user);
  const [tableData, setTableData] = useState([]);
  const [QA, setQA] = useState<any>({});
  const dispatch = useDispatch();
  const fetchQA = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const response = await axios.get(
        `${process.env.BASEURL}/procurement/quality-assurance/${selectedQA}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log('Approve Response:', response);
      const qualityAssuranceData = response?.data?.data;
      console.log('quality', qualityAssuranceData);
      setQA(qualityAssuranceData);
      setTableData(qualityAssuranceData?.bid?.bid_items);

      // Check if the user is a signatory and if they have signed
      //   const userSignatory = memoData?.signatories.find(
      //     (signatory: any) => signatory?.email === user?.email
      //   );

      //   if (userSignatory) {
      //     setIsSignatory(true);
      //     setHasSigned(userSignatory?.hasSigned);
      //   }
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
  }, [dispatch, selectedQA, user?.token]);

  useEffect(() => {
    fetchQA();
  }, [fetchQA]);
  return (
    <div>
      <div className="mt-3">
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  S/N
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
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
              {tableData?.length > 0 &&
                tableData.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item.name}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {/* Render attachments if any */}
                      {/* {item?.attachements?.length > 0 ? (
                        <div className="flex gap-2">
                          {item?.attachements.map(
                            (file: any, fileIndex: number) => {
                              console.log('file', file);
                              return (
                                <div
                                  key={fileIndex}
                                  className="relative h-[30px] w-[30px]"
                                >
                                  {file?.attachement?.type.startsWith(
                                    'image/'
                                  ) ? (
                                    <Image
                                      src={getPreviewUrl(file.attachement)}
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
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      const newAttachments =
                                        item.attachements.filter(
                                          (_: any, i: number) => i !== fileIndex
                                        );
                                      setTableData(
                                        tableData.map((data, idx) =>
                                          idx === index
                                            ? {
                                                ...data,
                                                attachments: newAttachments,
                                              }
                                            : data
                                        )
                                      );
                                    }}
                                  >
                                    &times;
                                  </button>
                                </div>
                              );
                            }
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
                          approve
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
        <div className="mt-2">
          {/* <div className="flex justify-end">
            <button
              type="button"
              className={`bg-blue-600 text-white p-3 rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
              onClick={() => {
                setOpenReqModal(true);
                handleClose();
              }}
            >
              Request
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default QaTable;
