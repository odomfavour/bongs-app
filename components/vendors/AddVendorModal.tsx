'use client';
import { BsXLg } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { toggleVendorModal } from '@/provider/redux/modalSlice';

interface Subscriber {
  id: number;
  name: string;
}

interface User {
  token: string;
}

interface AddVendorModalProps {
  subscribers: Subscriber[];
  user: User;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({
  subscribers,
  user,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_website: '',
    vendor_country: '',
    vendor_category: '',
    vendor_phone_number: '',
    vendor_founded_at: '',
    vendor_email: '',
    vendor_description: '',
    vendor_address: '',
    subscriber_id: '' as string | number,
  });

  return (
    <div className="z-50 top-0 min-h-screen bg-[#101010c8] fixed w-full flex justify-center items-center text-veriDark">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="lg:w-3/5 w-11/12 bg-white rounded-[5px] shadow-authModal p-8"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-2xl">Add New Vendor</p>
          <BsXLg
            className="cursor-pointer text-primary"
            role="button"
            onClick={() => dispatch(toggleVendorModal())}
          />
        </div>

        <form action="">
          <div className="grid grid-cols-3 gap-5">
            <div>
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
                  {subscribers.map((subscriber) => (
                    <option value={subscriber.id} key={subscriber.id}>
                      {subscriber.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_category"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Vendor Category
                </label>
                <select
                  id="vendor_category"
                  name="vendor_category"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vendor_category: e.target.value,
                    })
                  }
                >
                  <option value="">Select Vendor Category</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_name"
                  className="block mb-2 text-sm font-medium"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="vendor_name"
                  name="vendor_name"
                  placeholder="Input company name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_name}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="vendor_email"
                  name="vendor_email"
                  placeholder="Input email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_email}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_phone_number"
                  className="block mb-2 text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="vendor_phone_number"
                  name="vendor_phone_number"
                  placeholder="Input phone number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_phone_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vendor_phone_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_website"
                  className="block mb-2 text-sm font-medium"
                >
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="vendor_website"
                  name="vendor_website"
                  placeholder="Input website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_website}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_website: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_country"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Country
                </label>
                <select
                  id="vendor_country"
                  name="vendor_country"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_country}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_country: e.target.value })
                  }
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_founded_at"
                  className="block mb-2 text-sm font-medium"
                >
                  Year Founded (Optional)
                </label>
                <input
                  type="date"
                  id="vendor_founded_at"
                  name="vendor_founded_at"
                  placeholder="Input year founded"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_founded_at}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vendor_founded_at: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_address"
                  className="block mb-2 text-sm font-medium"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="vendor_address"
                  name="vendor_address"
                  placeholder="Input address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  value={formData.vendor_address}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_address: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vendor_description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Description
                </label>
                <textarea
                  id="vendor_description"
                  name="vendor_description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Input Description"
                  value={formData.vendor_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vendor_description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              {/* <div className="mb-4">
                <label
                  htmlFor="vendor_status"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Status
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    name="vendor_status"
                    checked={formData.vendor_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor_status: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Active
                  </span>
                </label>
              </div> */}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="text-white bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendorModal;
