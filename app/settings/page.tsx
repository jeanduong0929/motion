"use client";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/sidebar";
import React from "react";

const Settings = () => {
  return (
    <>
      <Navbar />
      <div className="flex py-10 settings-container mx-auto max-w-screen-xl w-11/12">
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
