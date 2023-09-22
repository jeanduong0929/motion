"use client";
import { CommandIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import UserDropdown from "./userdropdown";
import Loading from "../loading";
import { AuthContext } from "@/contexts/session-provider";
import { ModeToggle } from "./theme-toggle";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);

  if (status === "loading" || loading) return <Loading />;

  return (
    <>
      <nav className="flex items-center justify-between py-10 lg:px-96">
        <Link href={"/"} className="flex items-center gap-2">
          <CommandIcon size={"24"} />
          <h1 className="font-bold text-2xl">Motion</h1>
        </Link>

        <div className="flex items-center gap-10">
          <ModeToggle />
          {session || auth ? (
            <UserDropdown />
          ) : (
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
