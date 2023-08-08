"use client";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Link from "next/link";

type Props = {
  title: string;
  value: number;
  href: string;
};

const DashboardStatsCard = ({ title, value,href }: Props) => {
  return (
    <div className="h-28 w-full ml-auto flex flex-col justify-between items-start bg-white shadow rounded-md p-3">
      <p className="font-light">{title}</p>
      <div className="w-full flex items-center justify-between">
        <h3 className="text-3xl font-medium">{value}</h3>
        <Link href={href} prefetch>
          <KeyboardArrowLeftIcon className="text-light-dark-3 border border-light-dark-3 p-1 rounded-full hover:border-light-dark-4 hover:text-light-dark-4 hover:cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default DashboardStatsCard;
