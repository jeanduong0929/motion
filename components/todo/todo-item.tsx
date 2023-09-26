// Importing necessary libraries and components
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Loader2 } from "lucide-react";

// Importing components and models
import Todo from "@/models/todo";
import TodoDeleteDialog from "./todo-delete-dialog";
import TodoDropdown from "./todo-dropdown";

/**
 * Defining the prop types for the TodoItem component
 *
 * @param {todo} Todo - The todo object
 * @param {index} number - The index of the todo
 * @param {moveTodo} (dragIndex: number, hoverIndex: number) => void - The function to move the todo
 * @param {setTodos} React.Dispatch<React.SetStateAction<Todo[]>> - The function to set the todos
 * @param {updateOrder} (todos: Todo[]) => void - The function to update the order of the todos
 */
interface TodoItemProps {
  todo: Todo;
  index: number;
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  updateOrder: (todos: Todo[]) => void;
}

/**
 * TodoItem component represents a single todo item
 */
const TodoItem = ({
  todo,
  index,
  moveTodo,
  setTodos,
  updateOrder,
}: TodoItemProps) => {
  // State to manage the loading state of a todo item
  const [loadingTodoId, setLoadingTodoId] = React.useState<string>("");

  // State to manage the visibility of the delete dialog
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  /* #################################FUNCTIONS ################################# */

  // Setting up drag functionality for todo items
  const [, dragRef] = useDrag({
    type: "TODO",
    item: { index },
  });

  // Setting up drop functionality for todo items
  const [, dropRef] = useDrop({
    accept: "TODO",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // Ref to attach both drag and drop refs to the same component
  const ref = (node: any) => {
    dragRef(node);
    dropRef(node);
  };

  /* #################################RENDER ################################# */

  // Returning the TodoItem component
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
          <div
            className={`todo-item-container ${
              todo.completed && "line-through"
            }`}
          >
            <h1 className={"font-bold"}>{todo.title}</h1>
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
          updateOrder={updateOrder}
        />
      </div>
    </>
  );
};

export default TodoItem;
