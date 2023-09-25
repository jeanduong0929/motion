"use client";
import { CommandIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import UserDropdown from "./userdropdown";
import Loading from "../loading";
import { ModeToggle } from "./theme-toggle";

const Navbar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <>
      <div className="w-full border-b">
        <nav className="flex items-center justify-between py-5 mx-auto w-11/12 max-w-screen-xl">
          <Link href={"/"} className="flex items-center gap-2">
            <CommandIcon size={"24"} />
            <h1 className="font-bold text-2xl">Motion</h1>
          </Link>

          <div className="flex items-center gap-10">
            <ModeToggle />
            {session ? (
              <UserDropdown />
            ) : (
              <Link href={"/login"}>
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
