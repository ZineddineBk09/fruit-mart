import React from "react";
import dynamic from "next/dynamic";
const DashboardCharts = dynamic(
  () => import("@/components/dashboard/DashboardCharts"),
  { ssr: false }
);
const DashboardStats = dynamic(
  () => import("@/components/dashboard/DashboardStats"),
  { ssr: false }
);

const Dashboard = () => {
  return (
    <main className="w-full">
      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts */}
      <DashboardCharts />
    </main>
  );
};

export default Dashboard;
