"use client";
import Loading from "@/components/loading";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/sidebar";
import { AuthContext } from "@/contexts/session-provider";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Settings = () => {
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);

  if (!session && !auth) {
    redirect("/login");
  }

  if (status === "loading" || loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="flex w-full border-t py-10">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full px-20">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-4xl font-bold">Settings</h1>
            <h3 className="text-slate-500 text-lg">Manage your settings</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
