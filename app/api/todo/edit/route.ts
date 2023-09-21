import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { id, title } = await req.json();

  try {
    await connectDB();
    await TodoEntity.findOneAndUpdate({ _id: id }, { title }, { new: true });
  } catch (error: any) {
    console.log("Error updating todo", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
};
