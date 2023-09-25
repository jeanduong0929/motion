import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const PATCH = async (req: NextRequest) => {
  const { email, currentPassword, newPassword } = await req.json();
  await connectDB();

  const existingUser = await UserEntity.findOne({ email });

  if (
    !existingUser ||
    !isValidPassword(newPassword) ||
    currentPassword === newPassword ||
    !(await bcrypt.compare(currentPassword, existingUser.password))
  ) {
    return NextResponse.json({}, { status: 400 });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await UserEntity.findOneAndUpdate(
    { _id: existingUser._id },
    { password: hashedPassword },
    { new: true },
  );
  return NextResponse.json({}, { status: 200 });
};

const isValidPassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password,
  );
};
