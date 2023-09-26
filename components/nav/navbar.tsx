"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";

// Components
import UserDropdown from "./userdropdown";
import { ModeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

// Icons
import { CommandIcon } from "lucide-react";

/**
 * Component for rendering the navbar container.
 * @returns {JSX.Element} The navbar container component.
 */
const Navbar = (): JSX.Element => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <div className="w-full border-b container-fade-in">
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
  );
};

export default Navbar;
