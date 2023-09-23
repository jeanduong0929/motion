import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Todo from "@/models/todo";
import instance from "@/lib/axios-config";

interface TodoDropdownProps {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<string>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  updateOrder: (todos: Todo[]) => void;
}

const TodoDropdown = ({
  todo,
  setTodos,
  setLoadingTodoId,
  setOpenDialog,
  updateOrder,
}: TodoDropdownProps) => {
  const handleDone = async (id: string, completed: boolean) => {
    setLoadingTodoId(id);
    try {
      await instance.patch(`/todo/done`, {
        id,
        completed,
      });

      // Put line-through completed todos and move it to the bottom of the list
      setTodos((prevTodos: Todo[]) => {
        // Get the todo to be changed
        const completedTodo = prevTodos.find((todo) => todo._id === id);

        // Get the incompleted todos
        const incompletedTodos = prevTodos.filter((todo) => todo._id !== id);

        // Set the completed todo to the new completed value
        completedTodo!.completed = completed;

        // If the todo is completed
        if (completed) {
          updateOrder([...incompletedTodos, completedTodo!]);

          // Moves the completed todo to the bottom of the list
          return [...incompletedTodos, completedTodo!];
        }

        updateOrder([completedTodo!, ...incompletedTodos]);
        // Moves the undone todo to the top of the list
        return [completedTodo!, ...incompletedTodos];
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoadingTodoId("");
    }
  };

  return (
    <>
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
            {todo.completed ? "Undone" : "Done"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href={`/dashboard/edit/${todo._id}`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => setOpenDialog(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TodoDropdown;
