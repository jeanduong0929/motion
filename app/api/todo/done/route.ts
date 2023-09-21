import TodoEntity from "@/entities/todo-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { id, completed } = await req.json();

  try {
    await connectDB();
    await TodoEntity.findOneAndUpdate(
      { _id: id },
      { completed },
      { new: true },
    );
  } catch (error: any) {
    console.error("An error occureed:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
};
