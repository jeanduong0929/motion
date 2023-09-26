import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to fetch a Todo by ID.
 * @async
 * @param {NextRequest} _ - The Next.js request object.
 * @param {Object} context - The context object containing parameters.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation and the fetched Todo if successful.
 */
export const GET = async (
  _: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse> => {
  // Extracting the ID from the request parameters
  const { id } = context.params;

  try {
    // Connecting to the database
    await connectDB();

    // Fetching the todo with the provided ID
    const todo = await TodoEntity.findOne({ _id: id });

    // Returning a success response with the fetched todo
    return NextResponse.json(todo, { status: 200 });
  } catch (error: any) {
    // Returning an error response
    console.error("Error connecting to DB: ", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

/**
 * Handles DELETE requests to delete a Todo by ID.
 * @async
 * @param {NextRequest} _ - The Next.js request object.
 * @param {Object} context - The context object containing parameters.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation.
 */
export const DELETE = async (
  _: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse> => {
  // Extracting the ID from the request parameters
  const { id } = context.params;

  try {
    // Connecting to the database
    await connectDB();

    // Deleting the todo with the provided ID
    await TodoEntity.deleteOne({ _id: id });

    // Returning a success response
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    // Returning an error response
    console.error("Error deleting todo: ", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
