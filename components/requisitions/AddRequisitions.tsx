import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../dashboard/Modal';
import ReqViewForm from './ReqViewForm';
interface FormData {
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
  barge_asset_id: string;
  attachements: File[];
  inventoryable_id: number | null;
}
interface AddRequisitionsModalProps {
  handleClose: () => void;
  fetchData: () => void;
  setOpenReqModal: (open: boolean) => void;
  tableData: FormData[]; // Replace `any[]` with the specific type of tableData if known
  setTableData: React.Dispatch<React.SetStateAction<FormData[]>>;
}

const AddRequisitions: React.FC<AddRequisitionsModalProps> = ({
  handleClose,
  fetchData,
  setOpenReqModal,
  tableData,
  setTableData,
}) => {
  const dispatch = useDispatch();
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);

  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  // const inventoryType = useSelector((state: any) => state.modal.inventoryType);
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    uom_id: 0,
    stock_quantity: 0 as number | string,
    critical_level: '',
    part_number: '',
    model_number: '',
    description: '',
    type: 'sparepart',
    remark: '',
    barge_category: '',
    barge_asset: '',
    barge_asset_id: '',
    attachements: [] as File[],
    inventoryable_id: null,
  });

  const [displayData, setDisplayData] = useState({});

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        type: bargeValues.type,
        uom_id: bargeValues.uom_id,
        stock_quantity: bargeValues.stock_quantity,
        critical_level: bargeValues.critical_level,
        part_number: bargeValues.part_number,
        model_number: bargeValues.model_number,
        description: bargeValues.description,
        remark: bargeValues.remark,
        barge_category: bargeValues.barge_category,
        barge_asset: '',
        barge_asset_id: '',
        attachements: bargeValues.attachements,
        inventoryable_id: bargeValues.inventoryable_id,
      });
    }
  }, [bargeValues]);
  const [loading, setLoading] = useState(false);

  const [engineTypes, setEngineTypes] = useState([]);
  const [decks, setDecks] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [uom, setUom] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [bEquipment, setBEquipment] = useState([]);
  const fetchSparepartData = useCallback(async () => {
    dispatch(toggleLoading(true));
    try {
      const [
        projectsResponse,
        decksResponse,
        uomResponse,
        storeOnBoardResponse,
        locationResponse,
        vendorResponse,
        bEquipmentResponse,
      ] = await Promise.all([
        axios.get(`${process.env.BASEURL}/getProjects`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(`${process.env.BASEURL}/deck`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(`${process.env.BASEURL}/uom`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(`${process.env.BASEURL}/keystore`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(`${process.env.BASEURL}/location`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(`${process.env.BASEURL}/getVendors`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
        axios.get(`${process.env.BASEURL}/getBargeComponentCategories`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }),
      ]);
      console.log('project', storeOnBoardResponse?.data?.data?.data);
      setProjects(projectsResponse?.data?.data?.data);
      setDecks(decksResponse?.data?.data?.data);
      setUom(uomResponse?.data?.data?.data);
      setStoreItems(storeOnBoardResponse?.data?.data?.data);
      setLocations(locationResponse?.data?.data?.data);
      setVendors(vendorResponse?.data?.data?.data);
      setBEquipment(bEquipmentResponse?.data?.data?.data);
      //   setEngineTypes(sparepartResponse?.data?.data?.data);
      // You can similarly setStoreItems if needed
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
  }, [dispatch, user]);

  useEffect(() => {
    fetchSparepartData();
  }, [fetchSparepartData]);

  const [bargeAssets, setBargeAssets] = useState([]);

  useEffect(() => {
    const fetchBargeAssets = async () => {
      const { type, barge_category } = formData;

      let endpoint = '';

      if (type === 'sparepart') {
        switch (barge_category) {
          case 'engine':
            endpoint = 'sparepart-engine-category';
            break;
          case 'deck':
            endpoint = 'sparepart-deck-category';
            break;
          case 'safety':
            endpoint = 'safety-category';
            break;
          case 'hospital':
            endpoint = 'sparepart-hospital-category';
            break;
          default:
            endpoint = 'sparepart-engine-category';
            break;
        }
      } else if (type === 'consumable') {
        // You can define the endpoints for consumable categories here
        switch (barge_category) {
          case 'engine':
            endpoint = 'consumable/getEngineCategories';
            break;
          case 'deck':
            endpoint = 'consumable/getDeckCategories';
            break;
          case 'safety':
            endpoint = 'consumable/getSafetyCategories';
            break;
          case 'hospital':
            endpoint = 'consumable/getHospitalCategories';
            break;
          default:
            endpoint = 'consumable/getGalleyLaundryCategories';
            break;
        }
      }

      try {
        const response = await axios.get(`${process.env.BASEURL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        // handle the fetched data
        setBargeAssets(response?.data?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchBargeAssets();
  }, [user, formData]);

  const [previews, setPreviews] = useState<any>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      const displayAttachments = files.map((file) => ({ attachement: file }));
      // Update attachments in formData
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        attachements: [...prevFormData.attachements, ...displayAttachments],
      }));

      // Generate preview URLs for each file and update previews state
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews: any) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemovePreview = (index: number) => {
    // Remove the preview and corresponding file
    setPreviews((prev: any) => prev.filter((_: any, i: number) => i !== index));
    setFormData({
      ...formData,
      attachements: formData.attachements.filter((_, i) => i !== index),
    });
  };
  // Function to get a preview URL for a file
  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const addItem = () => {
    setTableData((prevData) => [...prevData, formData]);

    setFormData({
      uom_id: 0,
      stock_quantity: 0 as number | string,
      critical_level: '',
      part_number: '',
      model_number: '',
      description: '',
      type: 'sparepart',
      remark: '',
      barge_category: '',
      barge_asset: '',
      barge_asset_id: '',
      attachements: [] as File[],
      inventoryable_id: null,
    });
    setPreviews([]);
  };

  return (
    <div>
      <section>
        <div className="grid grid-cols-2 gap-5 mb-2">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 cursor-pointer">
              <input
                id="bordered-radio-1"
                type="radio"
                value="sparepart"
                name="inventory_type"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                checked={formData.type === 'sparepart'}
                onChange={() => setFormData({ ...formData, type: 'sparepart' })}
              />
              <label
                htmlFor="bordered-radio-1"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900 cursor-pointer"
              >
                Spare Parts
              </label>
            </div>
            <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 cursor-pointer">
              <input
                id="bordered-radio-2"
                type="radio"
                value="consumable"
                name="inventory_type"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                checked={formData.type === 'consumable'}
                onChange={() =>
                  setFormData({ ...formData, type: 'consumable' })
                }
              />
              <label
                htmlFor="bordered-radio-2"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900 cursor-pointer"
              >
                Consumeables
              </label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div>
            {/* {!user?.subscriber_id && (
              <div className="mb-4">
                <label
                  htmlFor="subscriber"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Subscriber
                </label>
                <select
                  id="subscriber"
                  name="subscriber_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.subscriber_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscriber_id: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Select Subscriber</option>
                  {subscribers?.map((subscriber: any) => (
                    <option value={subscriber.id} key={subscriber.id}>
                      {subscriber.name}
                    </option>
                  ))}
                </select>
              </div>
            )} */}

            <div className="mb-4">
              <label
                htmlFor="barge_category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Barge Category
              </label>
              <select
                id="barge_catgory"
                name="barge_catgory"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.barge_category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    barge_category: e.target.value,
                  })
                }
              >
                <option value="">Select Category</option>
                <option value="safety">Safety</option>
                <option value="engine">Engine</option>
                <option value="deck">Deck</option>
                {formData.type === 'consumable' && (
                  <option value="galley">Galley Laundry</option>
                )}
                <option value="hospital">Hospital</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="project_description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                id="project_description"
                name="project_description"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Input project description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="mb-4">
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="stock_quantity"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    id="stock_number"
                    name="stock_number"
                    placeholder="Input Stock quantity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    value={formData.stock_quantity}
                    min="0"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="sparepart_type"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Barge Asset
              </label>
              <select
                id="sparepart_type"
                name="sparepart_type"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.barge_asset_id}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    barge_asset_id: e.target.value,
                    barge_asset: e.target.selectedOptions[0].text,
                  });
                }}
              >
                <option value="">Select Category</option>
                {bargeAssets?.map((engineType: any) => (
                  <option value={engineType.id} key={engineType.id}>
                    {engineType.name
                      .split(' ')
                      .map(
                        (word: any) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="part_number"
                className="block mb-2 text-sm font-medium"
              >
                Part Number
              </label>
              <input
                type="text"
                id="part_number"
                name="part_number"
                placeholder="Input Part Number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.part_number}
                onChange={(e) =>
                  setFormData({ ...formData, part_number: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="subscriber"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Critical Level
              </label>
              <select
                id="subscriber"
                name="subscriber_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.critical_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    critical_level: e.target.value,
                  })
                }
              >
                <option value="">Select Level</option>
                <option value="low">Low</option>
                <option value="mid">Mid</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="project_description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Remarks
              </label>
              <textarea
                id="project_description"
                name="project_description"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Input remarks"
                value={formData.remark}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remark: e.target.value,
                  })
                }
              ></textarea>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="uom"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Unit of Measurement
              </label>
              <select
                id="uom"
                name="uom"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.uom_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    uom_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select UoM</option>
                {uom?.map((unit: any) => (
                  <option value={unit.id} key={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="model_number"
                className="block mb-2 text-sm font-medium"
              >
                Model Number
              </label>
              <input
                type="text"
                id="model_number"
                name="model_number"
                placeholder="Input model number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.model_number}
                onChange={(e) =>
                  setFormData({ ...formData, model_number: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="attachments"
                className="block mb-2 text-sm font-medium"
              >
                Attachments
              </label>
              <label
                htmlFor="file-input"
                className="cursor-pointer text-blue-600 underline"
              >
                Add File
              </label>
              <input
                type="file"
                id="file-input"
                name="attachments"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </div>
            {/* File Previews */}
            {previews.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {previews.map((preview: string, index: number) => (
                  <div
                    key={index}
                    className="relative w-[50px] h-[50px] border border-gray-200 rounded p-2 flex items-center justify-center"
                  >
                    <Image
                      src={preview}
                      alt={`Attachment ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                    <button
                      onClick={() => handleRemovePreview(index)}
                      className="absolute top-0 right-0 bg-red-500 text-[10px] text-white p-1 rounded"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className={`bg-blue-600 text-white p-3 rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
            onClick={addItem}
          >
            Add
          </button>
        </div>
      </section>

      <div className="mt-3">
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
              {tableData?.length > 0 &&
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
                      {item?.attachements?.length > 0 ? (
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
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded"
                          type="button"
                          onClick={() => {
                            setTableData(
                              tableData.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </button>
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
          <div className="flex justify-end">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRequisitions;
