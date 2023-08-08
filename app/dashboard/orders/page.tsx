"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { searchOrders } from "@/lib/search";
import { Order } from "@/interfaces/orders";
import TitleAndDate from "@/components/dashboard/Title&Date";
import { fetchOrders } from "@/utils";
const OrdersTable = dynamic(
  () => import("@/components/dashboard/orders/OrdersTable"),
  { ssr: false }
);

const OrdersPage = () => {
  // get Orders from firestore
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshTable = async () => {
    setOrders([]);
    await fetchOrders(setOrders);
  };

  useEffect(() => {
    const refresh = async () => {
      await fetchOrders(setOrders);
    };
    refresh();
  }, []);

  const handlesearchOrders = (search: string) => {
    if (search === "") {
      refreshTable();
      return;
    }
    // search inside shipments array
    const filteredOrders: any = searchOrders(orders, search);
    setOrders(filteredOrders);
  };


  return (
    <div className="flex flex-col w-11/12 mx-auto items-start justify-between mt-8">
      {/* Title & Date */}
      <TitleAndDate
        title="الطلبات"
        handleSearch={handlesearchOrders}
        noSearch={false}
      />

      {/* Orders */}
      <OrdersTable
        orders={orders ? orders : []}
        isLoading={false}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default OrdersPage;
