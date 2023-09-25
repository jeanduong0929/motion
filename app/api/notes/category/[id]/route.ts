import NoteCategoryEntity from "@/entities/note-category-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } },
) => {
  const { id } = context.params;
  await connectDB();
  const notes = await NoteCategoryEntity.find({ user: id }).exec();
  return NextResponse.json(notes, { status: 200 });
};
