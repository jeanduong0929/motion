import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Notes = () => {
  return (
    <>
      <Navbar />
      <div className="flex py-10 dashboard-container max-w-screen-xl mx-auto w-11/12">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full pl-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-4xl font-bold">Notes</h1>
              <h3 className="text-slate-500 text-lg">
                Create and manage your notes
              </h3>
            </div>
            <Link href={"/notes/editor"}>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                New note
              </Button>
            </Link>
          </div>

          <ScrollArea className="h-[50vh] w-full"></ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Notes;
