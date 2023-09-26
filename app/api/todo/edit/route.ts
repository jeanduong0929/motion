import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles PATCH requests to update the title of a Todo by ID.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation.
 */
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting id and title from the request body
    const { id, title } = await req.json();

    // Validating the provided title
    if (!title.trim()) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }

    // Connecting to the database
    await connectDB();

    // Updating the title of the specified Todo
    await updateTodoTitle(id, title);

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred while updating the todo title:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

/**
 * Updates the title of a Todo by ID.
 * @async
 * @param {string} id - The ID of the Todo to be updated.
 * @param {string} title - The new title of the Todo.
 * @returns {Promise<void>} - A promise that resolves when the Todo has been updated.
 */
const updateTodoTitle = async (id: string, title: string): Promise<void> => {
  await TodoEntity.findOneAndUpdate({ _id: id }, { title }, { new: true });
};
