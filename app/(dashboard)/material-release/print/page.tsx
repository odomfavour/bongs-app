'use client';
import React, { useState } from 'react';

const Page = () => {
  const [data, setData] = useState<any>([{ id: 1 }, { id: 2 }, { id: 3 }]);
  return (
    <div>
      <div className="w-2/3 mx-auto border border-gray-200">
        <h3 className="py-5 px-10 text-2xl text-bold font-semibold">
          Material Release
        </h3>
        <div className="bg-[#CCEEE4] py-10 px-10 border-t border-b">
          <div className="logo"></div>
          <div className="">
            <p className="text-base font-semibold">Westfield Subsea Limited</p>
            <p className="text-sm">
              Plot 23 Providence Street. Lekki Phase 1 Lagos, Nigeria, West
              Africa.
            </p>
          </div>
        </div>
        <div className="py-12 px-10 border-t border-b">
          <div className="grid grid-cols-3">
            <div>
              <p>Indent No</p>
              <p>MAT - 0918</p>
            </div>
            <div>
              <p>Project</p>
              <p>Westfield 2024</p>
            </div>
            <div>
              <p>Date:</p>
              <p>08/07/2024</p>
            </div>
            <div>
              <p>Name of Vessel</p>
              <p>DLB Kenenna</p>
            </div>
            <div>
              <p>Location</p>
              <p>Eko Support</p>
            </div>
            <div>
              <p>Requirement</p>
              <p>N/A</p>
            </div>
          </div>
        </div>
        <div className="py-10 px-10">
          <table className="table-auto w-full text-primary rounded-2xl mb-5">
            <thead>
              <tr className="border-b bg-[#E9EDF4]">
                <th className="text-sm text-center pl-3 py-3 rounded">S/N</th>
                <th className="text-sm text-left py-3">Equipment</th>
                <th className="text-sm text-left py-3">Quantity</th>
                <th className="text-sm text-left py-3">Model</th>
                <th className="text-sm text-left py-3">Description</th>
                <th className="text-sm text-left py-3">Part No</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 &&
                data.map((item: any, index: number) => {
                  const { id } = item;
                  return (
                    <tr className="border-b" key={id}>
                      <td className="py-2 text-center text-[#344054]">
                        {index + 1}
                      </td>

                      <td className="py-2 text-left text-sm">Main store</td>
                      <td className="py-2 text-left text-sm">Main store</td>
                      <td className="py-2 text-left text-sm">Main store</td>
                      <td className="py-2 text-left text-sm">Main store</td>
                      <td className="py-2 text-left text-sm">Main store</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="py-10 px-10">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-center text-sm">Requested By:</p>
              <div className="flex justify-center items-center">sign</div>
              <div className="bg-[#ECECEC] p-2">
                <p className="text-base font-semibold">Ogochukwu G</p>
                <p className="text-sm font-medium">General User</p>
                <p className="text-xs">2024-05-08 14:04:12</p>
              </div>
            </div>
            <div>
              <p className="text-center text-sm">Checked By:</p>
              <div className="flex justify-center items-center">sign</div>
              <div className="bg-[#ECECEC] p-2">
                <p className="text-base font-semibold">Ogochukwu G</p>
                <p className="text-sm font-medium">Chief Engineer</p>
                <p className="text-xs">2024-05-08 14:04:12</p>
              </div>
            </div>
            <div>
              <p className="text-center text-sm">Acknowledged By:</p>
              <div className="flex justify-center items-center">sign</div>
              <div className="bg-[#ECECEC] p-2">
                <p className="text-base font-semibold">Ogochukwu G</p>
                <p className="text-sm font-medium">Barge Master</p>
                <p className="text-xs">2024-05-08 14:04:12</p>
              </div>
            </div>
            <div>
              <p className="text-center text-sm">Approved By:</p>
              <div className="flex justify-center items-center">sign</div>
              <div className="bg-[#ECECEC] p-2">
                <p className="text-base font-semibold">Ogochukwu G</p>
                <p className="text-sm font-medium">Customer Rep</p>
                <p className="text-xs">2024-05-08 14:04:12</p>
              </div>
            </div>
            <div>
              <p className="text-center text-sm">Released By:</p>
              <div className="flex justify-center items-center">sign</div>
              <div className="bg-[#ECECEC] p-2">
                <p className="text-base font-semibold">Ogochukwu G</p>
                <p className="text-sm font-medium">Store Keeper</p>
                <p className="text-xs">2024-05-08 14:04:12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
