import React from "react";
import { patients } from "@/app/components/constants/patients";

const Patients = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10 bg-blue-800">
        {patients.map((p) => (
          <button
            key={p.id}
            className="text-black dark:text-white w-[50%]"
          >
            <h1 className='rounded-full border-2 w-12 h-fit p-2 flex items-center justify-center'>{p.init}</h1>
            <div className="text-left">
              <h2 className="font-bold">
                {p.name}{" "}
                <span className="text-right font-medium">{p.time}</span>
              </h2>
              <p className="text-xs text-gray-400">{p.type}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default Patients;
