"use client";
import Navbar from "@/components/nav/navbar";
import NoteCategoryDialog from "@/components/notes/note-category-dialog";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import instance from "@/lib/axios-config";
import NoteCategory from "@/models/note-category";
import MySession from "@/models/session";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const Notes = () => {
  // Dialog state
  const [open, setOpen] = React.useState<boolean>(false);

  // Loading states
  const [_, setNotesLoading] = React.useState<boolean>(false);
  const [noteCategories, setNoteCategories] = React.useState<NoteCategory[]>(
    [],
  );

  // Session
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  const getNotes = async () => {
    setNotesLoading(true);
    try {
      const { data } = await instance.get(`notes/category/${mySession!.id}`);
      setNoteCategories(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setNotesLoading(false);
    }
  };

  React.useEffect(() => {
    sessionStorage.setItem("path", "/notes");
    getNotes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex py-10 max-w-screen-xl mx-auto w-11/12 notes-container">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full pl-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-4xl font-bold">Notes</h1>
              <h3 className="text-slate-500 text-lg">
                Create and manage your notes
              </h3>
            </div>

            <Button onClick={() => setOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New note
            </Button>
          </div>

          <ScrollArea className="h-[50vh] w-full">
            <div className="w-full">
              {noteCategories &&
                noteCategories.map((cat: NoteCategory) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between border px-5 py-4"
                  >
                    {cat.name}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <NoteCategoryDialog open={open} setOpen={setOpen} session={session} />
    </>
  );
};

export default Notes;
