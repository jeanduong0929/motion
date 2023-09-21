import Todo from "@/models/todo";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoItemProps {
  todo: Todo;
  index: number;
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
  loadingTodoId: string;
}
import Link from "next/link";

const TodoItem = ({ todo, index, moveTodo, loadingTodoId }: TodoItemProps) => {
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

  return (
    <div
      key={todo._id}
      ref={ref}
      className="flex items-center justify-between border px-5 py-4"
    >
      {loadingTodoId === todo._id ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <h1
          style={{
            textDecorationLine: todo.completed ? "line-through" : "",
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
            {todo.completed ? "Undone" : "Done"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href={`/dashboard/edit/${todo._id}`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => (setOpenDialog(true), setDeleteTodoId(todo._id))}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TodoItem;
