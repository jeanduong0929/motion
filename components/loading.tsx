"use client";
import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="bg-slate-900 w-full h-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-opacity-40 backdrop-blur-md" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    </>
  );
};

export default Loading;
