'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  toggleAddConsumeablesModal,
  toggleAddEngineModal,
  toggleAddProjectModal,
  toggleLoading,
} from '@/provider/redux/modalSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
  name: string;
  subscriber_id: number;
  id: number;
}

interface AddProjectModalProps {
  handleClose: () => void;
  fetchData: () => void;
  inventoryType: string;
}

const AddConsumablesModal: React.FC<AddProjectModalProps> = ({
  handleClose,
  fetchData,
  inventoryType,
}) => {
  const dispatch = useDispatch();
  const subscribers = useSelector((state: any) => state.modal.subscribers);
  const user = useSelector((state: any) => state.user.user);
  const bargeValues = useSelector((state: any) => state.modal.bargeValues);
  // const inventoryType = useSelector((state: any) => state.modal.inventoryType);
  const [formData, setFormData] = useState({
    project_id: null as number | null,
    deck_id: 0,
    keystore_id: 0,
    unit_of_measurement_id: 0,
    location_id: 0,
    vendor_id: 0,
    safety_category_id: null,
    barge_component_category_id: 0,
    stock_quantity: 0,
    threshold: 0,
    critical_level: '',
    part_number: '',
    model_grade: '',
    description: '',
    date_acquired: '',
    waranty_period: '',
    subscriber_id: user?.subscriber_id as string | number,
    status: false,
    status_condition: '',
    oil_and_lubricant_type_id: null as number | null,
    consumable_engine_category_id: null,
    consumable_deck_category_id: null,
    consumable_hospital_category_id: null,
    consumable_safety_category_id: null,
    consumable_category_id: null,
    added_by: user?.id,
    remark: '',
  });

  useEffect(() => {
    if (Object.keys(bargeValues).length > 0) {
      setFormData({
        project_id: bargeValues.project_id,
        subscriber_id: bargeValues.subscriber_id,
        deck_id: bargeValues.deck_id,
        keystore_id: bargeValues.keystore_id,
        unit_of_measurement_id: bargeValues.unit_of_measurement_id,
        location_id: bargeValues.location_id,
        vendor_id: bargeValues.vendor_id,
        safety_category_id: bargeValues.safety_category_id,
        barge_component_category_id: bargeValues.barge_component_category_id,
        stock_quantity: bargeValues.stock_quantity,
        threshold: bargeValues.threshold,
        critical_level: bargeValues.critical_level,
        part_number: bargeValues.part_number,
        model_grade: bargeValues.model_grade,
        description: bargeValues.description,
        date_acquired: bargeValues.date_acquired,
        waranty_period: bargeValues.waranty_period,
        remark: bargeValues.remark,
        status: bargeValues.status === 'active',
        status_condition: bargeValues.status_condition,
        oil_and_lubricant_type_id: bargeValues.oil_and_lubricant_type_id,
        consumable_engine_category_id:
          bargeValues.consumable_engine_category_id,
        consumable_safety_category_id:
          bargeValues.consumable_safety_category_id,
        consumable_category_id: bargeValues.consumable_category_id,
        consumable_deck_category_id: bargeValues.consumable_deck_category_id,
        consumable_hospital_category_id:
          bargeValues.consumable_hospital_category_id,
        added_by: user?.id,
      });
    }
  }, [bargeValues, user?.id]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    try {
      setLoading(true);
      const url =
        Object.keys(bargeValues).length > 0
          ? `${process.env.BASEURL}/consumable/${
              inventoryType === 'Engine'
                ? 'engine'
                : inventoryType === 'Deck'
                ? 'deck'
                : inventoryType === 'Safety'
                ? 'safety'
                : inventoryType === 'Hospital'
                ? 'hospital'
                : 'galleylaundry'
            }/update/${bargeValues.id}`
          : `${process.env.BASEURL}/consumable/${
              inventoryType === 'Engine'
                ? 'engine'
                : inventoryType === 'Deck'
                ? 'deck'
                : inventoryType === 'Safety'
                ? 'safety'
                : inventoryType === 'Hospital'
                ? 'hospital'
                : 'galleylaundry'
            }/create`;
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
        location_id: 0,
        vendor_id: 0,
        safety_category_id: null,
        barge_component_category_id: 0,
        stock_quantity: 0,
        threshold: 0,
        critical_level: '',
        part_number: '',
        model_grade: '',
        description: '',
        date_acquired: '',
        waranty_period: '',
        remark: '',
        subscriber_id: user?.subscriber_id || ('' as string | number),
        status: false,
        status_condition: '',
        oil_and_lubricant_type_id: null as number | null,
        consumable_engine_category_id: null,
        consumable_deck_category_id: null,
        consumable_safety_category_id: null,
        consumable_hospital_category_id: null,
        consumable_category_id: null,
        unit_of_measurement_id: 0,
        added_by: user?.id,
      });
      fetchData();
      handleClose();
      // dispatch(toggleAddConsumeablesModal(''));
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
  const pathname = usePathname();
  const fetchConsumablesData = useCallback(async () => {
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
        sparepartResponse,
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
        axios.get(
          `${process.env.BASEURL}/${
            inventoryType === 'Engine'
              ? 'consumable/getEngineCategories'
              : inventoryType === 'Deck'
              ? 'consumable/getDeckCategories'
              : inventoryType === 'Safety'
              ? 'consumable/getSafetyCategories'
              : inventoryType === 'Hospital'
              ? 'consumable/getHospitalCategories'
              : 'consumable/getGalleyLaundryCategories'
          }`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        ),
      ]);
      console.log('project', sparepartResponse, vendorResponse);
      setProjects(projectsResponse?.data?.data?.data);
      setDecks(decksResponse?.data?.data?.data);
      setUom(uomResponse?.data?.data?.data);
      setStoreItems(storeOnBoardResponse?.data?.data?.data);
      setLocations(locationResponse?.data?.data?.data);
      setVendors(vendorResponse?.data?.data?.data);
      setBEquipment(bEquipmentResponse?.data?.data?.data);
      setEngineTypes(sparepartResponse?.data?.data?.data);
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
  }, [dispatch, inventoryType, user?.token]);

  useEffect(() => {
    fetchConsumablesData();
  }, [fetchConsumablesData]);

  const increaseQuantity = () => {
    setFormData((prev) => ({
      ...prev,
      stock_quantity: prev.stock_quantity + 1,
    }));
  };

  const decreaseQuantity = () => {
    setFormData((prev) => ({
      ...prev,
      stock_quantity: prev.stock_quantity > 0 ? prev.stock_quantity - 1 : 0,
    }));
  };

  const increaseThreshold = () => {
    setFormData((prev) => ({
      ...prev,
      threshold: prev.threshold + 1,
    }));
  };

  const decreaseThreshold = () => {
    setFormData((prev) => ({
      ...prev,
      threshold: prev.threshold > 0 ? prev.threshold - 1 : 0,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            {pathname !== '/miv-inventories' && (
              <div className="mb-4">
                <label
                  htmlFor="subscriber"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Project
                </label>
                <select
                  id="subscriber"
                  name="subscriber_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={
                    formData.project_id !== null
                      ? formData.project_id.toString()
                      : ''
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_id: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                >
                  <option value="">Select Project</option>
                  {projects?.map((project: any) => (
                    <option
                      value={project.id}
                      key={project.id}
                      className="capitalize"
                    >
                      {project.project_name
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
            )}
            <div className="mb-4">
              <label
                htmlFor="deck"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Deck
              </label>
              <select
                id="deck"
                name="deck"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.deck_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deck_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Deck</option>
                {decks?.map((deck: any) => (
                  <option value={deck.id} key={deck.id}>
                    {deck.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="mb-4">
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
                  {subscribers?.map((subscriber) => (
                    <option value={subscriber.id} key={subscriber.id}>
                      {subscriber.name}
                    </option>
                  ))}
                </select>
              </div> */}
            <div className="mb-4">
              <label
                htmlFor="subscriber"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Store - on - Board
              </label>
              <select
                id="keystore"
                name="keystore"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.keystore_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    keystore_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Store on Board</option>
                {storeItems?.map((storeItem: any) => (
                  <option value={storeItem.id} key={storeItem.id}>
                    {storeItem.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="bargeEquipment"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Barge Equipment
              </label>
              <select
                id="bargeEquipment"
                name="bargeEquipment"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.barge_component_category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    barge_component_category_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Barge equipment</option>
                {bEquipment?.map((equipment: any) => (
                  <option value={equipment.id} key={equipment.id}>
                    {equipment.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="subscriber"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                OAL Type
              </label>
              <select
                id="subscriber"
                name="subscriber_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.oil_and_lubricant_type_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oil_and_lubricant_type_id: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
              >
                <option value="">Select OAL Type</option>
                {bEquipment?.map((equipment: any) => (
                  <option value={equipment.id} key={equipment.id}>
                    {equipment.name}
                  </option>
                ))}
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
          </div>
          <div>
            <div className="mb-4">
              <label
                htmlFor="subscriber"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                {inventoryType === 'Engine'
                  ? 'Engine'
                  : inventoryType === 'Deck'
                  ? 'Deck'
                  : inventoryType === 'Safety'
                  ? 'Safety'
                  : inventoryType === 'Hospital'
                  ? 'Hospital'
                  : 'Galleylaundry'}{' '}
                Category
              </label>
              <select
                id="engineType"
                name="engineType"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={
                  inventoryType === 'Engine'
                    ? formData.consumable_engine_category_id || ''
                    : inventoryType === 'Deck'
                    ? formData.consumable_deck_category_id || ''
                    : inventoryType === 'Safety'
                    ? formData.consumable_safety_category_id || ''
                    : inventoryType === 'Hospital'
                    ? formData.consumable_hospital_category_id || ''
                    : formData.consumable_category_id || ''
                }
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || '';
                  const key =
                    inventoryType === 'Engine'
                      ? 'consumable_engine_category_id'
                      : inventoryType === 'Deck'
                      ? 'consumable_deck_category_id'
                      : inventoryType === 'Safety'
                      ? 'consumable_safety_category_id'
                      : inventoryType === 'Hospital'
                      ? 'consumable_hospital_category_id'
                      : 'consumable_category_id';

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
                    : inventoryType === 'Hospital'
                    ? 'Hospital'
                    : 'Galleylaundry'}
                  Category
                </option>
                {engineTypes?.map((engineType: any) => (
                  <option value={engineType.id} key={engineType.id}>
                    {engineType.name}
                  </option>
                ))}
              </select>
            </div>

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
                value={formData.unit_of_measurement_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit_of_measurement_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Unit</option>
                {uom?.map((unit: any) => (
                  <option value={unit.id} key={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mb-4">
                <label
                  htmlFor="project_name"
                  className="block mb-2 text-sm font-medium"
                >
                  Part Number
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  placeholder="Input project name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.part_number}
                  onChange={(e) =>
                    setFormData({ ...formData, part_number: e.target.value })
                  }
                />
              </div> */}
            <div className="mb-4">
              <label
                htmlFor="model_grade"
                className="block mb-2 text-sm font-medium"
              >
                Model Grade
              </label>
              <input
                type="text"
                id="model_grade"
                name="model_grade"
                placeholder="Input model grade"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.model_grade}
                onChange={(e) =>
                  setFormData({ ...formData, model_grade: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Location
              </label>
              <select
                id="location"
                name="location"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.location_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Location</option>
                {locations?.map((location: any) => (
                  <option value={location.id} key={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="subscriber"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Vendor
              </label>
              <select
                id="subscriber"
                name="subscriber_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.vendor_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vendor_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Vendor</option>
                {vendors?.map((vendor: any) => (
                  <option value={vendor.id} key={vendor.id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-3">
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
                      id="stock_quantity"
                      name="stock_quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-3 text-center"
                      value={formData.stock_quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock_quantity: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="threshold"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Threshold
                    </label>

                    <input
                      type="number"
                      id="threshold"
                      name="threshold"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-3 text-center"
                      value={formData.threshold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          threshold: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="project_name"
                className="block mb-2 text-sm font-medium"
              >
                Date Acquired
              </label>
              <input
                type="date"
                id="project_name"
                name="project_name"
                placeholder="Input project name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.date_acquired}
                onChange={(e) =>
                  setFormData({ ...formData, date_acquired: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="warranty_period"
                className="block mb-2 text-sm font-medium"
              >
                Warranty Period
              </label>
              <input
                type="date"
                id="warranty_period"
                name="warranty_period"
                placeholder="Input warranty date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.waranty_period}
                onChange={(e) =>
                  setFormData({ ...formData, waranty_period: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="status_condition"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Status Condition
              </label>
              <select
                id="status_condition"
                name="status_condition_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                value={formData.status_condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status_condition: e.target.value,
                  })
                }
              >
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="in-use">in Use</option>
                <option value="replacement">Replacement</option>
              </select>
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
                htmlFor="status"
                className="block mb-2 text-sm font-medium"
              >
                Status
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      status: e.target.checked,
                    }))
                  }
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 ">
                  {formData.status ? 'Active' : 'Inactive'}
                </span>
              </label>
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
              : `Add ${inventoryType}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddConsumablesModal;
