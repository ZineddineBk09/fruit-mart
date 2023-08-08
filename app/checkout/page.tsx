"use client";
import React from "react";
import CheckOutItems from "@/components/checkout/CheckOutItems";
import CheckOutForm from "@/components/checkout/CheckoutForm";
import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";

const CheckoutPage = () => {
  // if cart is empty redirect to home page
  const items = useAppSelector((state: any) => state.cart.items);
  if (items.length === 0) redirect("/");
  return (
    <div className="w-full flex items-start">
      <CheckOutItems />

      <CheckOutForm />
    </div>
  );
};
export default CheckoutPage;
