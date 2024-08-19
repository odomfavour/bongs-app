import { toggleLoading } from '@/provider/redux/modalSlice';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface AddRequisitionsModalProps {
  handleClose: () => void;
  fetchData: () => void;
  inventoryType?: string;
}

const AddRequisitions: React.FC<AddRequisitionsModalProps> = ({
  handleClose,
  fetchData,
  inventoryType,
}) => {
  const dispatch = useDispatch();
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);

  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  // const inventoryType = useSelector((state: any) => state.modal.inventoryType);
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    project_id: null as number | null,
    deck_id: 0,
    keystore_id: 0,
    uom_id: 0,
    location_id: 0,
    vendor_id: 0,
    safety_category_id: null,
    barge_equipment_id: 0,
    stock_quantity: 0 as number | string,
    threshold: 0 as number | string,
    critical_level: '',
    part_number: '',
    model_number: '',
    description: '',
    date_acquired: '',
    waranty_period: '',
    subscriber_id: user?.subscriber_id || ('' as string | number),
    status: false,
    sparepart_engine_category_id: null,
    sparepart_deck_category_id: null,
    sparepart_hospital_category_id: null,
    type: 'sparepart',
    remark: '',
    barge_category: '',
    attachements: [] as File[],
  });

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        project_id: bargeValues.project_id,
        subscriber_id: bargeValues.subscriber_id,
        deck_id: bargeValues.deck_id,
        type: bargeValues.type,
        keystore_id: bargeValues.keystore_id,
        uom_id: bargeValues.uom_id,
        location_id: bargeValues.location_id,
        vendor_id: bargeValues.vendor_id,
        safety_category_id: bargeValues.safety_category_id,
        barge_equipment_id: bargeValues.barge_equipment_id,
        stock_quantity: bargeValues.stock_quantity,
        threshold: bargeValues.threshold,
        critical_level: bargeValues.critical_level,
        part_number: bargeValues.part_number,
        model_number: bargeValues.model_number,
        description: bargeValues.description,
        date_acquired: bargeValues.date_acquired,
        waranty_period: bargeValues.waranty_period,
        remark: bargeValues.remark,
        status: bargeValues.status === 'active',
        sparepart_engine_category_id: bargeValues.sparepart_engine_category_id,
        sparepart_deck_category_id: bargeValues.sparepart_deck_category_id,
        sparepart_hospital_category_id:
          bargeValues.sparepart_hospital_category_id,
        barge_category: bargeValues.barge_category,
        attachements: bargeValues.attachements,
      });
    }
  }, [bargeValues]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    try {
      setLoading(true);
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/sparepart/${
              inventoryType === 'Engine'
                ? 'engine'
                : inventoryType === 'Deck'
                ? 'deck'
                : inventoryType === 'Safety'
                ? 'safety'
                : 'hospital'
            }/update/${bargeValues.id}`
          : `${process.env.BASEURL}/sparepart/${
              inventoryType === 'Engine'
                ? 'engine'
                : inventoryType === 'Deck'
                ? 'deck'
                : inventoryType === 'Safety'
                ? 'safety'
                : 'hospital'
            }/add`;
      const method = Object.keys(bargeValues).length > 0 ? 'PATCH' : 'POST';

      const response = await axios({
        method,
        url,
        data: {
          ...formData,
          status: formData.status ? 'active' : 'inactive',
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('Response:', response);

      toast.success(`${response?.data?.message}`);

      setFormData({
        project_id: null as number | null,
        deck_id: 0,
        keystore_id: 0,
        uom_id: 0,
        location_id: 0,
        vendor_id: 0,
        safety_category_id: null,
        barge_equipment_id: 0,
        type: 'sparepart',
        stock_quantity: 0 as number | string,
        threshold: 0 as number | string,
        critical_level: '',
        part_number: '',
        model_number: '',
        description: '',
        date_acquired: '',
        waranty_period: '',
        remark: '',
        subscriber_id: user?.subscriber_id as string | number,
        status: false,
        sparepart_engine_category_id: null,
        sparepart_deck_category_id: null,
        sparepart_hospital_category_id: null,
        barge_category: '',
        attachements: [] as File[],
      });
      // dispatch(toggleAddEngineModal(''));
      fetchData();
      handleClose();
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
      setLoading(false);
    }
  };
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

  const handleFileChange = (e: any) => {
    const files: File[] = Array.from(e.target.files);
    setFormData({ ...formData, attachements: files });

    const filePreviews = files.map((file: any) => URL.createObjectURL(file));
    setPreviews((prev: any) => [...prev, ...filePreviews]);
  };

  const handleRemovePreview = (index: number) => {
    setPreviews((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            {!user?.subscriber_id && (
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
            )}

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
                value={
                  formData.barge_category === 'engine'
                    ? formData.sparepart_engine_category_id || ''
                    : inventoryType === 'Deck'
                    ? formData.sparepart_deck_category_id || ''
                    : inventoryType === 'Safety'
                    ? formData.safety_category_id || ''
                    : formData.sparepart_hospital_category_id || ''
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || '';
                  const key =
                    inventoryType === 'Engine'
                      ? 'sparepart_engine_category_id'
                      : inventoryType === 'Deck'
                      ? 'sparepart_deck_category_id'
                      : inventoryType === 'Safety'
                      ? 'safety_category_id'
                      : 'sparepart_hospital_category_id';

                  setFormData({
                    ...formData,
                    [key]: value,
                  });
                }}
              >
                <option value="">
                  Select{' '}
                  {inventoryType === 'Engine'
                    ? 'Engine'
                    : inventoryType === 'Deck'
                    ? 'Deck'
                    : inventoryType === 'Safety'
                    ? 'Safety'
                    : 'Hospital'}{' '}
                  Category
                </option>
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
            type="submit"
            className={`bg-blue-600 text-white p-3 rounded-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading
              ? 'Submitting...'
              : Object.keys(bargeValues).length > 0
              ? `Update ${inventoryType}`
              : `Add`}
          </button>
        </div>
      </form>

      <div className="mt-3">
        <div className="overflow-x-auto">
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
              <tr>
                <td className="p-2border-b text-sm text-gray-700">1</td>
                <td className="p-2 border-b text-sm text-gray-700">12</td>
                <td className="p-2 border-b text-sm text-gray-700">testing</td>
                <td className="px-2 border-b text-sm text-gray-700"></td>
                <td className="p-2 border-b text-sm text-gray-700">
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded"
                      type="button"
                    >
                      Attach File
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded mr-2"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-600 text-white p-3 rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading
                ? 'Submitting...'
                : Object.keys(bargeValues).length > 0
                ? `Update ${inventoryType}`
                : `Request`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRequisitions;
