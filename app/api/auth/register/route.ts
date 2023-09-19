import UserEntity from "@/entities/user-entity";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  await connectDB();

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return NextResponse.json({}, { status: 400 });
  }

  if (await UserEntity.findOne({ email })) {
    return NextResponse.json({}, { status: 409 });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await UserEntity.create({
    email,
    password: hashedPassword,
  });

  return NextResponse.json({}, { status: 201 });
};

const isValidEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const isValidPassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password,
  );
};
