import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  await connectDB();

  const existingUser = await UserEntity.findOne({ email });

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    return NextResponse.json({}, { status: 401 });
  }

  const token = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    },
  );

  return NextResponse.json(
    {
      id: existingUser.id,
      email: existingUser.email,
      token,
    },
    { status: 200 },
  );
};
