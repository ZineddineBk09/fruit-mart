"use client";
import { WalletIcon } from "@heroicons/react/24/outline";
import { Button } from "@mui/material";
import Image from "next/image";
import React from "react";

const Wallet = () => {
  return (
    <div className="w-10/12 flex items-center justify-between mx-auto p-10 bg-white shadow-lg">
      <div className="w-full flex items-center rounded-lg">
        <WalletIcon className="w-16 h-16 text-green-500 ml-4" />
        <div className="flex flex-col items-start">
          <p className="text-3xl font-bold">الرصيد</p>
          <p className="text-xl font-semibold">
            673,678 <small>AED</small>
          </p>
        </div>
      </div>

      <button className="w-48 h-12 bg-green-500 text-white font-bold p-3 rounded transition-all duration-300 hover:bg-green-600">
        تعبئة المحفظة
      </button>
    </div>
  );
};

export default Wallet;
