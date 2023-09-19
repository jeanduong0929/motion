"use client";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import React from "react";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (!session) {
    redirect("/login");
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
