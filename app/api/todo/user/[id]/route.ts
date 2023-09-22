import TodoEntity from "@/entities/todo-entity";
import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } },
) => {
  const { id } = context.params;
  let todos;

  try {
    await connectDB();

    // Find existing user
    const existingUser = await UserEntity.findOne({ _id: id });

    // Find all todos for the user and sort based on order
    todos = await TodoEntity.find().sort({ order: 1 }).exec();
  } catch (error: any) {
    console.log("Error when getting todos by user id: ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(todos, { status: 200 });
};
