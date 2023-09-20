import Sidebar from "@/components/sidebar";
import React from "react";

const Settings = () => {
  return (
    <>
      <div className="flex w-full border-t py-10">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full px-20">
          <h1>Settings</h1>
        </div>
      </div>
    </>
  );
};

export default Settings;
