"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loadCart, removeItem } from "@/redux/slices/cart";
import { Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CheckOutItems = () => {
  const dispatch = useAppDispatch();

  // load cart from local storage
  //dispatch(loadCart());

  const total = useAppSelector((state) => state.cart.total);
  const numberOfItems = useAppSelector((state) => state.cart.numberOfItems);
  const items = useAppSelector((state) => state.cart.items);

  return (
    <div className="w-96 overflow-y-auto px-4 py-6">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-bold mb-3 px-3">عربة التسوق</h3>
      </div>

      <div className="mt-8 px-3 h-96 overflow-y-auto">
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {items.map((product: any) => (
              <CheckOutItem key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </div>
      {/* total */}
      <Divider />
      <li className="py-6 flex items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <span className="text-gray-500">المجموع</span>
          <span className="text-gray-900 font-bold">
            {total.toFixed(2)} <small>دينار</small>
          </span>
        </div>
      </li>
    </div>
  );
};

const CheckOutItem = ({ product }: { product: any }) => {
  const dispatch = useAppDispatch();
  return (
    <li key={product.id} className="flex py-5">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          width={20}
          height={20}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="mr-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-900">
            <h3>
              <Link href={"/"}>{product.name}</Link>
            </h3>
            <p className="mr-4">
              {product.price} <small>دينار</small>
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{product.country}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-xs">
          <p className="text-gray-500">الكمية: {product.quantity}</p>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-red-600 hover:text-red-500"
              onClick={() => dispatch(removeItem(product.id))}
            >
              إزالة
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CheckOutItems;
