"use client";
import { Loader } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

const Loading = () => {
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`fixed w-full h-full ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        } z-20 backdrop-blur-lg bg-opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      />
      <div className="fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader size={64} className="animate-spin" />
      </div>
    </>
  );
};

export default Loading;
