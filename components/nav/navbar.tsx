"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Components
import UserDropdown from "./userdropdown";
import { ModeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

// Icons
import { CommandIcon } from "lucide-react";

/* ##############################NavbarContainer ############################## */

/**
 * Container component for the navbar.
 *
 * @param {React.FC<NavbarContainerProps>} props - Props for the NavbarContainer component.
 */
interface NavbarContainerProps {
  children: React.ReactNode;
}
const NavbarContainer = ({ children }: NavbarContainerProps) => {
  return (
    <div className="w-full border-b container-fade-in">
      <nav className="flex items-center justify-between py-5 mx-auto w-11/12 max-w-screen-xl">
        <Link href={"/"} className="flex items-center gap-2">
          <CommandIcon size={"24"} />
          <h1 className="font-bold text-2xl">Motion</h1>
        </Link>

        <div className="flex items-center gap-10">
          <ModeToggle />
          {children}
        </div>
      </nav>
    </div>
  );
};

/* ##############################Navbar ############################## */

/**
 * The main Navbar component.
 */
const Navbar = () => {
  const { data: session, status } = useSession();

  // If the session status is still loading, return null to avoid rendering the navbar prematurely.
  if (status === "loading") return null;

  // If there's no session, render a login button.
  if (!session) {
    return (
      <>
        <NavbarContainer>
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
        </NavbarContainer>
      </>
    );
  }

  // If a session exists, render the UserDropdown component.
  if (session) {
    return (
      <>
        <NavbarContainer>
          <UserDropdown />
        </NavbarContainer>
      </>
    );
  }
};

export default Navbar;
