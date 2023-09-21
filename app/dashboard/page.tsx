"use client";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import React, { LegacyRef, useEffect } from "react";
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
import instance from "@/lib/axios-config";
import MySession from "@/models/session";
import Link from "next/link";
import Todo from "@/models/todo";
import Navbar from "@/components/nav/navbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoItem from "@/components/todo/todo-item";

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
      await instance.patch(`/todo/done`, {
        id,
        completed,
      });

      // Put line-through completed todos and move it to the bottom of the list
      setTodos((prevTodos) => {
        // Get the todo to be changed
        const completedTodo = prevTodos.find((todo) => todo._id === id);

        // Get the incompleted todos
        const incompletedTodos = prevTodos.filter((todo) => todo._id !== id);

        // Set the completed todo to the new completed value
        completedTodo!.completed = completed;

        // If the todo is completed
        if (completed) {
          // Moves the completed todo to the bottom of the list
          return [...incompletedTodos, completedTodo!];
        }
        // Moves the undone todo to the top of the list
        return [completedTodo!, ...incompletedTodos];
      });
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

  const moveTodo = (fromIndex: number, toIndex: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      const [movedTodo] = updatedTodos.splice(fromIndex, 1);
      updatedTodos.splice(toIndex, 0, movedTodo);
      return updatedTodos;
    });
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

          <DndProvider backend={HTML5Backend}>
            <div className="w-full">
              {todos &&
                todos.map((todo: Todo, index: number) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    index={index}
                    moveTodo={moveTodo}
                    loadingTodoId={loadingTodoId}
                  />
                ))}
            </div>
          </DndProvider>
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
              className="bg-red-500 text-white hover:bg-red-800"
              onClick={() => handleDelete(deleteTodoId)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
