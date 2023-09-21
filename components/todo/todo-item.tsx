import Todo from "@/models/todo";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import instance from "@/lib/axios-config";
import TodoDeleteDialog from "./todo-delete-dialog";

interface TodoItemProps {
  todo: Todo;
  index: number;
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoItem = ({ todo, index, moveTodo, setTodos }: TodoItemProps) => {
  const [loadingTodoId, setLoadingTodoId] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  const [, dragRef] = useDrag({
    type: "TODO",
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: "TODO",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const ref = (node: any) => {
    dragRef(node);
    dropRef(node);
  };

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

  return (
    <>
      <div
        key={todo._id}
        ref={ref}
        className="flex items-center justify-between border px-5 py-4"
      >
        {loadingTodoId === todo._id ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div>
            <h1
              style={{
                textDecorationLine: todo.completed ? "line-through" : "",
                textDecorationThickness: todo.completed ? "1.5px" : "",
              }}
              className={"font-bold"}
            >
              {todo.title}
            </h1>
            <TodoDeleteDialog
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              setTodos={setTodos}
              todoId={todo._id}
            />
          </div>
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
      </div>
    </>
  );
};

export default TodoItem;
