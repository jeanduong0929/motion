import TodoEntity from "@/entities/todo-entity";
import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } },
) => {
  await connectDB();

  const existingUser = await UserEntity.findOne({ _id: context.params.id });
  const todos = await TodoEntity.find({ user: existingUser });

  return NextResponse.json(todos, { status: 200 });
};

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } },
) => {
  try {
    await connectDB();
    await TodoEntity.deleteOne({ _id: context.params.id });
  } catch (error: any) {
    console.log("Error deleting todo: ", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
};
