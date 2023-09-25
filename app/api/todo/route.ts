import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * The purpose of this endpoint is to create a new todo.
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {NextResponse} - The outgoing response object
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { title, userId } = await req.json();

  // If the title is empty, return a 400 Bad Request response.
  if (!title.trim()) {
    return NextResponse.json({}, { status: 400 });
  }

  try {
    await connectDB();

    // Get the list of todos from the database sorted by order
    const todos = await TodoEntity.find({ user: userId })
      .sort({ order: 1 })
      .exec();

    // Split the list of todos into two lists: completed and incomplete
    const completedTodos = todos.filter((todo) => todo.completed);
    const incompleteTodos = todos.filter((todo) => !todo.completed);

    let newOrder = incompleteTodos.length;

    // Add the new todo order to the end of the list.
    await TodoEntity.create({
      title,
      order: newOrder,
      user: userId,
    });

    // Update the completed todos order by downshifting them by one.
    for (const todo of completedTodos) {
      await TodoEntity.findByIdAndUpdate(todo._id, {
        order: todo.order + 1,
      });
    }
  } catch (error: any) {
    console.log("Error when creating todo: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return a 201 Created response.
  return NextResponse.json({}, { status: 201 });
};
