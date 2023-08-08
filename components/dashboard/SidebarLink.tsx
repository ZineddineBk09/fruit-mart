import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import Link from "next/link";

type Props = {
  title: string;
  Icon: any;
  href: string;
};

const SidebarLink = ({ title, Icon, href }: Props) => {
  const router = useRouter();
  const path = usePathname();
  const active = path === href;

  return (
    <Tooltip title={title}>
      <Link
        className={`h-14 flex flex-col items-center justify-evenly w-full transition-all duration-250 rounded-md mx-2 md:mx-0 md:my-2  hover:cursor-pointer 
      ${
        active
          ? "bg-green-500 text-white font-semibold"
          : "text-gray-400 bg-white hover:bg-green-500 hover:text-white"
      } sm:h-16 md:h-24 shadow`}
        href={active ? "" : href}
      >
        <>
          <Icon className={`h-8 w-8 sm:h-9 sm:w-9`} />
          <p className={`text-xs text-center md:block md:text-sm`}>{title}</p>
        </>
      </Link>
    </Tooltip>
  );
};

export default SidebarLink;
