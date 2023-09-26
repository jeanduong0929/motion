import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Handles POST requests for user authentication.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} - A response object with the status of the operation and a JWT token if successful.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting user credentials from the request body
    const { email, password } = await req.json();

    // Connecting to the database
    await connectDB();

    // Fetching the existing user from the database
    const existingUser = await UserEntity.findOne({ email });

    // Validating the provided credentials
    if (!areValidCredentials(existingUser, password)) {
      return NextResponse.json({}, { status: 401 });
    }

    // Generating a JWT token for the authenticated user
    const token = generateToken(existingUser);

    return NextResponse.json(
      {
        id: existingUser.id,
        email: existingUser.email,
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    // Logging any unexpected errors
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
};

/**
 * Validates the provided user credentials.
 * @async
 * @param {any} existingUser - The existing user object from the database.
 * @param {string} password - The password provided by the user.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the validity of the provided credentials.
 */
const areValidCredentials = async (
  existingUser: any,
  password: string,
): Promise<boolean> => {
  // Checking if the existing user is found and the provided password matches the stored password
  return (
    existingUser &&
    password.trim() &&
    (await bcrypt.compare(password, existingUser.password))
  );
};

/**
 * Generates a JWT token for the authenticated user.
 * @param {any} user - The authenticated user object.
 * @returns {string} - A JWT token.
 */
const generateToken = (user: any): string => {
  // Defining the payload for the JWT token
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Signing and returning the JWT token
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
