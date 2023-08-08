"use client";
import {
  countFirestoreOrders,
  countFirestoreProducts,
  countFirestoreUsers,
} from "@/utils";
import dynamic from "next/dynamic";
const DashboardStatsCard = dynamic(() => import("./DashboardStatsCard"), {
  ssr: false,
});

const DashboardStats = async () => {
  const stats = [
    {
      title: "المنتجات",
      value: await countFirestoreProducts(),
    },
    {
      title: "الطلبات",
      value: await countFirestoreOrders(),
    },
    {
      //users
      title: "المستخدمين",
      value: await countFirestoreUsers(),
    },
  ];

  // get the number of products and orders from firestore
  return (
    <section className="grid grid-cols-1 gap-4 w-full mx-auto sm:grid-cols-3">
      {stats &&
        stats.map((stat, index) => (
          <DashboardStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            href={
              stat.title === "المنتجات"
                ? "/products"
                : stat.title === "الطلبات"
                ? "/orders"
                : "#"
            }
          />
        ))}
    </section>
  );
};

export default DashboardStats;
