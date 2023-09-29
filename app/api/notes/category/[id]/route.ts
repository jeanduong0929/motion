import NoteCategoryEntity from "@/entities/note-category-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  context: { params: { id: string } },
) => {
  const { id } = context.params;
  await connectDB();
  const notes = await NoteCategoryEntity.find({ user: id }).exec();
  return NextResponse.json(notes, { status: 200 });
};

export const DELETE = async (
  _: NextRequest,
  context: { params: { id: string } },
) => {
  const { id } = context.params;

  try {
    await connectDB();
    await NoteCategoryEntity.findByIdAndDelete({ _id: id }).exec();
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
};
