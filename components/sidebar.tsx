"use client";
import { ListTodo, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  const options = [
    {
      id: "1",
      name: "Todo",
      href: "/dashboard",
      icon: <ListTodo size={24} />,
      selected: pathname === "/dashboard",
    },
    {
      id: "2",
      name: "Profile",
      href: "/profile",
      icon: <UserIcon size={24} />,
      selected: pathname === "/profile",
    },
    {
      id: "3",
      name: "Settings",
      href: "/settings",
      icon: <SettingsIcon size={24} />,
      selected: pathname === "/settings",
    },
  ];

  return (
    <>
      <div className="flex flex-col items-start pl-20 w-[350px] gap-2">
        {options.map((option) => (
          <Link
            key={option.id}
            href={option.href}
            className={`flex items-center gap-2 w-full px-2 py-2 hover:bg-slate-200 rounded-md ${
              option.selected && "bg-slate-200"
            }`}
          >
            {option.icon}
            <p>{option.name}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
