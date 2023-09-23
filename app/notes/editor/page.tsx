"use client";
import Ace from "@/components/notes/ace-editor";
import EditorDropdown from "@/components/notes/editor-dropdown";
import React from "react";

const Editor = () => {
  return (
    <>
      <div className="flex w-full h-full">
        <Ace />
        <div className="w-1/2 h-screen bg-slate-800">
          <div className="absolute top-5 right-10">
            <EditorDropdown />
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
