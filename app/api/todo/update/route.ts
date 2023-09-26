import TodoEntity, { TodoDocumnet } from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles PATCH requests to update the order of Todo items.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation.
 */
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting todos from the request body
    const { todos } = await req.json();

    // Connecting to the database
    await connectDB();

    // Updating the order of each Todo item
    await updateTodosOrder(todos);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred while updating todo items:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/**
 * Updates the order of the provided Todo items.
 * @async
 * @param {Array<TodoDocument>} todos - An array of Todo items to be updated.
 * @returns {Promise<void>} - A promise that resolves when all Todo items have been updated.
 */
const updateTodosOrder = async (todos: TodoDocumnet[]): Promise<void> => {
  await Promise.all(
    todos.map(async (todo, index) => {
      await TodoEntity.findByIdAndUpdate(
        { _id: todo._id },
        { order: index },
        { new: true },
      );
    }),
  );
};
