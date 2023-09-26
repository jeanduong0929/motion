import UserEntity from "@/entities/user-entity";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

/**
 * Handles PATCH requests to update user passwords.
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<NextResponse>} - A response object with the status of the operation.
 */
export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Extracting user details from the request body
    const { email, currentPassword, newPassword } = await req.json();

    // Connecting to the database
    await connectDB();

    // Fetching the existing user from the database
    const existingUser = await UserEntity.findOne({ email });

    // Validating the provided details
    if (!isValidDetails(existingUser, currentPassword, newPassword)) {
      return NextResponse.json({}, { status: 400 });
    }

    // Updating the user's password
    await updateUserPassword(existingUser, newPassword);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    // Logging any unexpected errors
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
};

/**
 * Validates the provided user details.
 * @async
 * @param {any} existingUser - The existing user object from the database.
 * @param {string} currentPassword - The current password provided by the user.
 * @param {string} newPassword - The new password provided by the user.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the validity of the provided details.
 */
const isValidDetails = async (
  existingUser: any,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> => {
  // Checking if the existing user is found, the new password is valid,
  // the current and new passwords are not the same, and the current password matches the stored password
  return (
    existingUser &&
    isValidPassword(newPassword) &&
    currentPassword !== newPassword &&
    (await bcrypt.compare(currentPassword, existingUser.password))
  );
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
 * Updates the user's password in the database.
 * @async
 * @param {any} user - The user object whose password is to be updated.
 * @param {string} newPassword - The new password to update.
 * @returns {Promise<void>} - A promise that resolves when the password has been updated.
 */
const updateUserPassword = async (
  user: any,
  newPassword: string,
): Promise<void> => {
  // Generating a new salt for password hashing
  const salt = await bcrypt.genSalt(10);

  // Hashing the new password with the generated salt
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Updating the user's password in the database
  await UserEntity.findOneAndUpdate(
    { _id: user._id },
    { password: hashedPassword },
    { new: true },
  );
};
