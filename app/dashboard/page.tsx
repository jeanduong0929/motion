"use client";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "@/contexts/session-provider";
import Sidebar from "@/components/sidebar";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);

  if (status == "loading" || loading) return <Loading />;

  if (!session && !auth) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div>Dashboard</div>
      </div>
    </>
  );
};

export default Dashboard;
