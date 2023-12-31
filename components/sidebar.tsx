"use client";
import { FileIcon, ListTodo, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

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
      <div
        className={
          "hidden md:flex flex-col items-start gap-2 w-[245px] container-fade-in"
        }
      >
        {options.map((option) => (
          <Link key={option.id} href={option.href} className="w-full">
            <Button
              className="flex items-center justify-start gap-2 w-full"
              variant={`${option.selected ? "secondary" : "ghost"}`}
            >
              {option.icon} <p>{option.name}</p>
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
