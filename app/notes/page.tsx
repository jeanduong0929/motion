"use client";
import Loading from "@/components/loading";
import Navbar from "@/components/nav/navbar";
import NoteCategoryDialog from "@/components/notes/note-category-dialog";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthContext } from "@/contexts/session-provider";
import instance from "@/lib/axios-config";
import NoteCategory from "@/models/note-category";
import MySession from "@/models/session";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Notes = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [delayLoading, setDelayLoading] = React.useState<boolean>(true);
  const [notesLoading, setNotesLoading] = React.useState<boolean>(false);
  const [noteCategories, setNoteCategories] = React.useState<NoteCategory[]>(
    [],
  );
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);
  const mySession = session ? (session as MySession) : null;

  const getNotes = async () => {
    setNotesLoading(true);
    try {
      const { data } = await instance.get(
        `notes/category/${mySession ? mySession!.id : auth!.id}`,
      );
      setNoteCategories(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setNotesLoading(false);
    }
  };

  React.useEffect(() => {
    if (!session && !auth) {
      redirect("/login");
    }

    getNotes();

    const timer = setTimeout(() => {
      if (status !== "loading" && !loading && !notesLoading)
        setDelayLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (delayLoading) return <Loading />;

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

      <NoteCategoryDialog
        open={open}
        setOpen={setOpen}
        session={session}
        auth={auth}
      />
    </>
  );
};

export default Notes;
