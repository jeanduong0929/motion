import TodoEntity from "@/entities/todo-entity";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { title, userId } = await req.json();

  if (!title.trim()) {
    return NextResponse.json({}, { status: 400 });
  }

  await TodoEntity.create({
    title,
    user: userId,
  });

  return NextResponse.json({}, { status: 201 });
};
