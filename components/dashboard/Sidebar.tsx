"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArchiveBoxIcon,
  ChartPieIcon,
  CircleStackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
const SidebarLink = dynamic(() => import("./SidebarLink"), { ssr: false });

const Sidebar = () => {
  const sidebarLinks = [
    {
      title: "لوحة التحكم",
      Icon: ChartPieIcon,
      href: "/dashboard",
    },
    {
      title: "المنتجات",
      Icon: CircleStackIcon,
      href: "/dashboard/products",
    },
    {
      title: "الطلبات",
      Icon: ArchiveBoxIcon,
      href: "/dashboard/orders",
    },
    {
      title: "المشرفين",
      Icon: UsersIcon,
      href: "/dashboard/admins",
    },
  ];
  const router = useRouter();
  // Get current page height to set sidebar height
  const [height, setHeight] = useState<number>(0);

  return (
    <div
      className={`bg-white shadow-md w-16  rounded-md px-2 py-3 ml-3 transition-all duration-500 
    ${
      height > 0
        ? `${'h-[' + document.documentElement.clientHeight + 'px]'}`
        : 'h-fit'
    }
    min-h-max w-full sm:px-3 md:w-40  md:px-5 lg:px-7 lg:min-w-[200px] lg:w-52`}
    >
      <div className='w-full h-full flex items-center md:flex-col'>
        {sidebarLinks.map((link, index) => (
          <SidebarLink {...link} key={index} />
        ))}
      </div>
    </div>
  )
};

export default Sidebar;
