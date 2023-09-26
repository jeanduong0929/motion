import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

/**
 * Handles POST requests for user registration.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} - A response object with the status of the operation.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting user details from the request body
    const { email, password } = await req.json();

    // Connecting to the database
    await connectDB();

    // Validating the provided email and password
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return NextResponse.json({}, { status: 400 });
    }

    // Checking if a user with the provided email already exists
    if (await UserEntity.findOne({ email })) {
      return NextResponse.json({}, { status: 409 });
    }

    // Creating a new user with the provided details
    await createUser(email, password);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    // Logging any unexpected errors
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
};

/**
 * Validates the structure of the provided email.
 * @param {string} email - The email to validate.
 * @returns {boolean} - A boolean indicating whether the email is valid.
 */
const isValidEmail = (email: string): boolean => {
  // Defining the regex pattern for a valid email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Testing the provided email against the pattern
  return emailRegex.test(email);
};

/**
 * Validates the structure of the provided password.
 * @param {string} password - The password to validate.
 * @returns {boolean} - A boolean indicating whether the password is valid.
 */
const isValidPassword = (password: string): boolean => {
  // Defining the regex pattern for a valid password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Testing the provided password against the pattern
  return passwordRegex.test(password);
};

/**
 * Creates a new user with the provided email and password.
 * @async
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<void>} - A promise that resolves when the user has been created.
 */
const createUser = async (email: string, password: string): Promise<void> => {
  // Generating a new salt for password hashing
  const salt = await bcrypt.genSalt(10);

  // Hashing the provided password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creating a new user entity with the hashed password
  await UserEntity.create({ email, password: hashedPassword });
};
