"use client";

import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const router = useRouter();
  return (
    <div className="h-screen flex justify-center items-center bg-gray-300 w-full">
      <div className="w-2/4 h-2/5 flex flex-col justify-center items-center rounded-md bg-white shadow-2xl">
        <p className="text-2xl text-center text-gray-600  font-bold">
          QA/QC submitted successfully
        </p>
        <p className="mt-3">Keep checking you mail for the next steps</p>

        {/* <button
          className="mt-6 px-4 py-2  bg-blue-600 text-white rounded-md"
          onClick={() => {
            router.push('/');
          }}
        >
          Go Home
        </button> */}
      </div>
    </div>
  );
}

export default Page;
