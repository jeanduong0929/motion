"use client";
import Ace from "@/components/notes/ace-editor";
import React from "react";

const Editor = () => {
  return (
    <>
      <div className="flex w-full h-full">
        <Ace />
        <div className="w-1/2 h-screen bg-white" />
      </div>
    </>
  );
};

export default Editor;
