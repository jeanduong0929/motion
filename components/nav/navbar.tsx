"use client";
import { CommandIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import NavLogin from "./nav-login";
import NavRegister from "./nav-register";

const Navbar = () => {
  const pathname = usePathname();

  if (pathname === "/login") return <NavLogin />;

  if (pathname === "/register") return <NavRegister />;

  return (
    <>
      <nav className="flex items-center justify-between px-20 py-10">
        <Link href={"/"} className="flex items-center gap-2">
          <CommandIcon size={"24"} />
          <h1 className="font-bold text-2xl">Motion</h1>
        </Link>
        <Link href={"/login"}>
          <Button>Login</Button>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
