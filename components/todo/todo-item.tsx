import Todo from "@/models/todo";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Loader2 } from "lucide-react";
import TodoDeleteDialog from "./todo-delete-dialog";
import TodoDropdown from "./todo-dropdown";

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
        <TodoDropdown
          todo={todo}
          setTodos={setTodos}
          setLoadingTodoId={setLoadingTodoId}
          setOpenDialog={setOpenDialog}
        />
      </div>
    </>
  );
};

export default TodoItem;
