"use client";
import { CommandIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import NavLogin from "./nav-login";

const Navbar = () => {
  const pathname = usePathname();

  if (pathname === "/login") return <NavLogin />;

  return (
    <>
      <nav className="flex items-center justify-between px-20 py-10">
        <div className="flex items-center gap-2">
          <CommandIcon size={"24"} />
          <h1 className="font-bold text-2xl">Motion</h1>
        </div>
        <Link href={"/login"}>
          <Button>Login</Button>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
