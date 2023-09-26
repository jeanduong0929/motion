import TodoEntity, { TodoDocumnet } from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to fetch all Todos for a user by user ID.
 * @async
 * @param {NextRequest} _ - The Next.js request object.
 * @param {Object} context - The context object containing parameters.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation and the fetched Todos if successful.
 */
export const GET = async (
  _: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse> => {
  const { id } = context.params;

  try {
    // Connecting to the database
    await connectDB();

    // Fetching and sorting all Todos for the user by user ID
    const todos = await fetchTodosByUserId(id);

    return NextResponse.json(todos, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred while getting todos by user ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/**
 * Fetches and sorts all Todos for a user by user ID.
 * @async
 * @param {string} userId - The ID of the user whose Todos are to be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of sorted Todos.
 */
const fetchTodosByUserId = async (userId: string): Promise<TodoDocumnet[]> => {
  return await TodoEntity.find({ user: userId }).sort({ order: 1 }).exec();
};
