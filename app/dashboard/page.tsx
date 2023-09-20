"use client";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "@/contexts/session-provider";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import instance from "@/lib/axios-config";
import MySession from "@/models/session";

const Dashboard = () => {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);
  const mySession = session as MySession;

  const todos = [
    {
      id: "1",
      title: "Todo 1",
    },
    {
      id: "2",
      title: "Todo 2",
    },
    {
      id: "3",
      title: "Todo 3",
    },
  ];

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    if (session || auth) {
      await instance.get(`/todo/${mySession ? mySession!.id : auth!.id}`);
    }
  };

  if (status == "loading" || loading) return <Loading />;

  if (!session && !auth) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex w-full border-t py-10">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full px-20">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-4xl font-bold">Todos</h1>
              <h3 className="text-slate-500 text-lg">
                Create and manage your todos
              </h3>
            </div>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              New todo
            </Button>
          </div>

          <div className="w-full">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between border px-5 py-4"
              >
                <h1 className="font-bold">{todo.title}</h1>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 cursor-pointer"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => setOpenDialog(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this post?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="hover:bg-slate-700"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button className="bg-red-500 text-black hover:bg-red-800">
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
