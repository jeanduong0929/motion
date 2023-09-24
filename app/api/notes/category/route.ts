import NoteCategoryEntity from "@/entities/note-category-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, user } = await req.json();
  await connectDB();

  if (!name.trim()) {
    return NextResponse.json({}, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  if (await NoteCategoryEntity.findOne({ name })) {
    return NextResponse.json({}, { status: 409 });
  }

  await NoteCategoryEntity.create({ name, user });

  return NextResponse.json({}, { status: 201 });
};
