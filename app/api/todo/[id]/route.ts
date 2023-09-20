import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } },
) => {
  const { id } = context.params;
  let todo;

  try {
    await connectDB();
    todo = await TodoEntity.findOne({ _id: id });
  } catch (error: any) {
    console.log("Error connecting to DB: ", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(todo, { status: 200 });
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
