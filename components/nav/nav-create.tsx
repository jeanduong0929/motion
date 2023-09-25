import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavCreate = () => {
  return (
    <>
      <nav className="flex items-center justify-between px-10 py-5">
        <div>
          <Link
            href={"/dashboard"}
            className="flex items-center hover:bg-slate-200 px-5 py-2 rounded-md"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavCreate;
