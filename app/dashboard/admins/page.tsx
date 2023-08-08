"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { searchAdmins } from "@/lib/search";
import TitleAndDate from "@/components/dashboard/Title&Date";
import { fetchAdmins } from "@/utils";
import { Admin } from "@/interfaces/admins";
const AdminsTable = dynamic(
  () => import("@/components/dashboard/admins/AdminsTable"),
  { ssr: false }
);

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  const refreshTable = async () => {
    setAdmins([]);
    await fetchAdmins(setAdmins);
  };

  useEffect(() => {
    const refresh = async () => {
      await fetchAdmins(setAdmins);
    };
    refresh();
  }, []);

  const handleSearchAdmins = (search: string) => {
    if (search === "") {
      refreshTable();
      return;
    }
    // search inside shipments array
    const filteredAdmins: any = searchAdmins(admins, search);
    setAdmins(filteredAdmins);
  };

  return (
    <div className="flex flex-col w-11/12 mx-auto items-start justify-between mt-8">
      {/* Title & Date */}
      <TitleAndDate
        title="المشرفين"
        handleSearch={handleSearchAdmins}
        noSearch={false}
      />

      {/* admins */}
      <AdminsTable
        admins={admins ? admins : []}
        isLoading={false}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default AdminsPage;
