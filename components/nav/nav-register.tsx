import Link from "next/link";
import React from "react";

const NavRegister = () => {
  return (
    <>
      <nav className="absolute flex items-center top-0 right-0  px-20 py-10">
        <Link
          href={"/login"}
          className="px-5 py-2 hover:bg-slate-200 rounded-md"
        >
          Login
        </Link>
      </nav>
    </>
  );
};

export default NavRegister;
