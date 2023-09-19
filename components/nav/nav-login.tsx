import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavLogin = () => {
  return (
    <>
      <nav className="flex items-center px-20 py-10">
        <Link
          href={"/"}
          className="flex items-center hover:bg-slate-200 px-5 py-2 rounded-md"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </Link>
      </nav>
    </>
  );
};

export default NavLogin;
