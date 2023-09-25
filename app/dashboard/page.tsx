"use client";

// External Libraries and Dependencies
import React from "react";
import Link from "next/link";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import debounce from "lodash.debounce";

// Next.js and Next-Auth
import { useSession } from "next-auth/react";

// Custom Components
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/nav/navbar";
import TodoItem from "@/components/todo/todo-item";

// Models and Data
import MySession from "@/models/session";
import Todo from "@/models/todo";

// API and Network
import instance from "@/lib/axios-config";

// Icons and Graphics
import { PlusIcon } from "lucide-react";

const Dashboard = () => {
  // State variables
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  /* ############################## METHODS ############################## */

  /**
   * The purpose of this hook is to get the todos from the database
   * when the component mounts
   *
   * @returns {void}
   */
  React.useEffect(() => {
    getTodos();
  }, [session]);

  /**
   * The purpose of this function is to get the todos from the database
   *
   * @returns {Promise<void>}
   */
  const getTodos = async (): Promise<void> => {
    try {
      if (mySession) {
        // Get the todos from the response data
        const { data } = await instance.get(`/todo/user/${mySession!.id}`);

        // Set the todos
        setTodos(data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * The purpose of this function is to move a todo from one index to another
   *
   * @param {number} fromIndex - The index of the todo to move
   * @param {number} toIndex - The index to move the todo to
   * @returns {Promise<void>}
   */
  const moveTodo = async (
    fromIndex: number,
    toIndex: number,
  ): Promise<void> => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos];
      const [movedTodo] = updatedTodos.splice(fromIndex, 1);
      updatedTodos.splice(toIndex, 0, movedTodo);
      updateOrder(updatedTodos);
      return updatedTodos;
    });
  };

  /**
   * The purpose of this function is to update the order of the Todos
   * in the database after a drag and drop event
   *
   * @param {Todo[]} updatedTodos - The updated todos
   * @returns {Promise<void>}
   */
  const updateOrder = debounce(async (updatedTodos: Todo[]): Promise<void> => {
    const prevTodos = [...todos];
    try {
      instance.patch("/todo/update", {
        todos: updatedTodos,
      });
    } catch (error: any) {
      console.log(error);
      setTodos(prevTodos);
    }
  }, 1000);

  /* ############################## RENDER ############################## */

  return (
    <>
      <Navbar />
      <div className="flex py-10 max-w-screen-xl mx-auto w-11/12 container-fade-in">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full pl-10">
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

          <ScrollArea className="h-[50vh] w-full">
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
                      updateOrder={updateOrder}
                    />
                  ))}
              </div>
            </DndProvider>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
