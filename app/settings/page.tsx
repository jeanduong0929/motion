"use client";
import Loading from "@/components/loading";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/sidebar";
import { AuthContext } from "@/contexts/session-provider";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Settings = () => {
  const [delayLoading, setDelayLoading] = React.useState<boolean>(true);
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!session && !auth) {
      redirect("/login");
    }

    const timer = setTimeout(() => {
      if (status !== "loading" && !loading) setDelayLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [status, loading, auth, session]);

  if (delayLoading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="flex py-10 settings-container mx-auto max-w-screen-xl">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full pl-10 pr-20">
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
