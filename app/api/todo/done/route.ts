import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles PATCH requests to update the completion status of a Todo by ID.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation.
 */
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting id and completed status from the request body
    const { id, completed } = await req.json();

    // Connecting to the database
    await connectDB();

    // Updating the completion status of the specified Todo
    await updateTodoCompletionStatus(id, completed);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("An error occurred while updating the todo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/**
 * Updates the completion status of a Todo by ID.
 * @async
 * @param {string} id - The ID of the Todo to be updated.
 * @param {boolean} completed - The new completion status of the Todo.
 * @returns {Promise<void>} - A promise that resolves when the Todo has been updated.
 */
const updateTodoCompletionStatus = async (
  id: string,
  completed: boolean,
): Promise<void> => {
  await TodoEntity.findOneAndUpdate({ _id: id }, { completed }, { new: true });
};
