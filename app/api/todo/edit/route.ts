import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { _id, title } = await req.json();
  await connectDB();
  await TodoEntity.updateOne({ _id, title });
  return NextResponse.json({}, { status: 204 });
};
