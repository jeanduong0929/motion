import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="fixed w-full h-full bg-white z-20 bg-opacity-50 backdrop-blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader size={64} className="animate-spin" />
      </div>
    </>
  );
};

export default Loading;
