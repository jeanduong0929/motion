import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const NavLogin = () => {
  return (
    <>
      <nav className="flex items-center px-20 py-10">
        <Link href={"/"}>
          <Button variant={"ghost"} className="text-md">
            <ChevronLeft size={20} className="mr-2" />
            Back
          </Button>
        </Link>
      </nav>
    </>
  );
};

export default NavLogin;
