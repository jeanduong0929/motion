"use client";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "@/contexts/session-provider";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";
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
import Link from "next/link";
import Todo from "@/models/todo";
import Navbar from "@/components/nav/navbar";

const Dashboard = () => {
  const [deleteTodoId, setDeleteTodoId] = React.useState<string>("");
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [pageLoading, setPageLoading] = React.useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = React.useState<string>("");
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);
  const mySession = session ? (session as MySession) : null;

  useEffect(() => {
    if (!session && !auth) {
      redirect("/login");
    }

    if (session || auth) {
      getTodos();
    }
  }, [status, loading, session, auth]);

  const getTodos = async () => {
    setPageLoading(true);
    try {
      const { data } = await instance.get(
        `/todo/user/${mySession ? mySession!.id : auth ? auth!.id : ""}`,
      );
      setTodos(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDone = async (id: string, completed: boolean) => {
    setLoadingTodoId(id);
    try {
      await instance.put(`/todo/done`, {
        id,
        completed,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: completed } : todo,
        ),
      );
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoadingTodoId("");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await instance.delete(`/todo/${id}`);
      setOpenDialog(false);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error: any) {
      console.log(error);
    }
  };

  if (status == "loading" || loading || pageLoading) return <Loading />;

  return (
    <>
      <Navbar />
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
            <Link href={"/dashboard/create"}>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                New todo
              </Button>
            </Link>
          </div>

          <div className="w-full">
            {todos &&
              todos.map((todo: Todo) => (
                <div
                  key={todo._id}
                  className="flex items-center justify-between border px-5 py-4"
                >
                  {loadingTodoId === todo._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <h1
                      style={{
                        textDecorationLine: todo.completed
                          ? "line-through"
                          : "",
                        textDecorationThickness: todo.completed ? "1.5px" : "",
                      }}
                      className={"font-bold"}
                    >
                      {todo.title}
                    </h1>
                  )}

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
                      <DropdownMenuItem
                        onClick={() => handleDone(todo._id, !todo.completed)}
                      >
                        Done
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/edit/${todo._id}`}>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => (
                          setOpenDialog(true), setDeleteTodoId(todo._id)
                        )}
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
            <Button
              className="bg-red-500 text-black hover:bg-red-800"
              onClick={() => handleDelete(deleteTodoId)}
            >
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
