import TodoEntity, { TodoDocumnet } from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { todos } = await req.json();

  try {
    await connectDB();

    await Promise.all(
      todos.map(async (todo: TodoDocumnet, index: number) => {
        await TodoEntity.findByIdAndUpdate(
          { _id: todo._id },
          { order: index },
          { new: true },
        );
      }),
    );
  } catch (error: any) {
    console.log("Error when updating todo item", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 201 });
};
