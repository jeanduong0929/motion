import TodoEntity, { TodoDocumnet } from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to create a new Todo.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting title and userId from the request body
    const { title, userId } = await req.json();

    // Validating the provided title
    if (!title.trim()) {
      return NextResponse.json({}, { status: 400 });
    }

    // Connecting to the database
    await connectDB();

    // Fetching and sorting existing todos for the user
    const todos: TodoDocumnet[] = await fetchAndSortTodos(userId);

    // Creating a new todo with the provided title and calculated order
    await createNewTodo(title, userId, todos);

    // Updating the order of completed todos
    await updateCompletedTodosOrder(todos);

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    console.error("Error when creating todo: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/**
 * Fetches and sorts todos for the provided user ID.
 * @async
 * @param {string} userId - The ID of the user whose todos are to be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of sorted todos.
 */
const fetchAndSortTodos = async (userId: string): Promise<TodoDocumnet[]> => {
  return await TodoEntity.find({ user: userId }).sort({ order: 1 }).exec();
};

/**
 * Creates a new todo with the provided title and calculated order.
 * @async
 * @param {string} title - The title of the new todo.
 * @param {string} userId - The ID of the user to whom the new todo belongs.
 * @param {Array} todos - An array of existing todos.
 * @returns {Promise<void>} - A promise that resolves when the new todo has been created.
 */
const createNewTodo = async (
  title: string,
  userId: string,
  todos: any[],
): Promise<void> => {
  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const newOrder = incompleteTodos.length;

  await TodoEntity.create({ title, order: newOrder, user: userId });
};

/**
 * Updates the order of completed todos.
 * @async
 * @param {Array} todos - An array of existing todos.
 * @returns {Promise<void>} - A promise that resolves when the order of completed todos has been updated.
 */
const updateCompletedTodosOrder = async (todos: any[]): Promise<void> => {
  const completedTodos = todos.filter((todo) => todo.completed);

  for (const todo of completedTodos) {
    await TodoEntity.findByIdAndUpdate(todo._id, { order: todo.order + 1 });
  }
};
