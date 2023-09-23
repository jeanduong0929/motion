import { AuthContext } from "@/contexts/session-provider";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

const NavCreate = () => {
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);

  if (status === "loading" || loading) return <Loading />;

  if (!session && !auth) {
    redirect("/login");
  }

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
