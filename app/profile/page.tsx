"use client";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-config";
import MySession from "@/models/session";
import { useSession } from "next-auth/react";
import React from "react";

const Profile = () => {
  return (
    <>
      <Navbar />
      <div className="flex py-10 profile-container mx-auto max-w-screen-xl w-11/12">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full pl-10 pr-20">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-4xl font-bold">Profile</h1>
            <h3 className="text-slate-500 text-lg">
              Manage your profile settings
            </h3>
          </div>

          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
};

export default Profile;

/* -------------------------------------------------------------------------- */

const ChangePasswordForm = () => {
  // Form state
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [newPassowrdError, setNewPasswordError] = React.useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] =
    React.useState<string>("");
  const [newPasswordLoading, setNewPasswordLoading] =
    React.useState<boolean>(false);

  // Error state
  const [error, setError] = React.useState<string>("");

  // Session
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  // Misc
  const { toast } = useToast();

  /**
   * The purpose of this function is to handle the new password
   *
   * @param e - The change event
   * @returns void
   */
  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);

    if (!isValidPassword(e.target.value)) {
      setNewPasswordError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      );
    } else if (currentPassword === e.target.value) {
      setNewPasswordError("New password cannot be the same as current");
    } else {
      setNewPasswordError("");
    }
  };

  /**
   * The purpose of this function is to handle the confirm password
   *
   * @param e - The change event
   * @returns void
   */
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);

    if (newPassword !== e.target.value) {
      setConfirmPasswordError("Password does not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  /**
   * The purpose of this function is to validate the password
   *
   * @param password - The password to validate
   * @returns boolean - Whether the password is valid or not
   */
  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );
  };

  /**
   * The purpose of this function is to handle saving the new password
   *
   * @param e - The submit event
   * @returns void
   */
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewPasswordLoading(true);

    try {
      await instance.patch("/auth", {
        email: session!.user!.email,
        currentPassword,
        newPassword,
      });

      toast({
        description: "Password changed successfully",
        className: "bg-slate-800 text-white",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError("Current password is incorrect");
      }
    } finally {
      setNewPasswordLoading(false);
    }
  };

  if (mySession) {
    return mySession.providerType !== "credentials" ? (
      <div className="flex flex-col items-start gap-5 border px-5 py-4 w-full">
        {/** Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold">Change password</h2>

          <p className="text-slate-500 text-sm">
            Change password via your auth provider
          </p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-start gap-5 border px-5 py-4 w-full">
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold">Change password</h2>
          <p className="text-slate-500 text-sm">
            Please enter your new password
          </p>
        </div>

        <form
          className="flex flex-col items-start gap-4 w-[400px]"
          onSubmit={handleForm}
        >
          {/** Current password */}
          <FormInput
            placeholder={"Current password"}
            type={"password"}
            value={currentPassword}
            handleValue={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentPassword(e.target.value)
            }
            error={error}
          />

          {/** New password */}
          <FormInput
            placeholder={"New password"}
            type={"password"}
            value={newPassword}
            handleValue={handleNewPassword}
            error={newPassowrdError}
          />

          {/** Confirm password */}
          <FormInput
            placeholder={"Confirm password"}
            type={"password"}
            value={confirmPassword}
            handleValue={handleConfirmPassword}
            error={confirmPasswordError}
          />

          {/** Submit button */}
          <FormButton label={"save"} loading={newPasswordLoading} />
        </form>
      </div>
    );
  }
};
