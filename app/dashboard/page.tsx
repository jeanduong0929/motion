"use client";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "@/contexts/session-provider";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import instance from "@/lib/axios-config";
import MySession from "@/models/session";
import Link from "next/link";
import Todo from "@/models/todo";
import Navbar from "@/components/nav/navbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoItem from "@/components/todo/todo-item";

const Dashboard = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [pageLoading, setPageLoading] = React.useState<boolean>(false);
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
                    setTodos={setTodos}
                  />
                ))}
            </div>
          </DndProvider>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
