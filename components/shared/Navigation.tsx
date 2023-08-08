"use client";
import { categories } from "@/data/categories";
import Link from "next/link";
import React, { useEffect } from "react";

const Navigation = () => {
  const links: {
    link: string;
    href: string;
  }[] = categories;

  const [active, setActive] = React.useState(0);
  useEffect(() => {
    const path = window.location.pathname;
    const activeLink = links.findIndex((link) => link.href == path);
    setActive(activeLink);
  }, []);

  return (
    <div className="w-[95%] h-fit grid grid-cols-3 items-center justify-between mx-auto my-2 shadow border rounded bg-white sm:grid-cols-6">
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          onClick={() => setActive(links.indexOf(link))}
          className={
            "w-full h-12 flex items-center justify-center text-center text-xs transition-all duration-200 hover:text-green-500 rounded-t md:text-sm" +
            " " +
            (active == links.indexOf(link)
              ? "text-green-500 border-b-2 border-green-500"
              : "text-slate-900")
          }
        >
          {link.link}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
