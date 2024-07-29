'use client';
import React from 'react';
import { useSelector } from 'react-redux';

const Page = () => {
  const user = useSelector((state: any) => state.user.user);
  console.log('user', user);
  const cards = [{ id: 1 }, { id: 2 }, { id: 3 }];
  return (
    <div>
      <h3>Dashboard</h3>
      <div className="grid grid-cols-4 gap-5">
        {cards.map((item) => (
          <div className="shadow-md rounded-md h-[300px] p-6" key={item.id}>
            <h3>Dashboard</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
