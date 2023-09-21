"use client";
import Loading from "@/components/loading";
import Navbar from "@/components/nav/navbar";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/contexts/session-provider";
import instance from "@/lib/axios-config";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Profile = () => {
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [newPassowrdError, setNewPasswordError] = React.useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] =
    React.useState<string>("");
  const [newPasswordLoading, setNewPasswordLoading] =
    React.useState<boolean>(false);
  const [delayLoading, setDelayLoading] = React.useState<boolean>(true);
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!session && !auth) {
      redirect("/login");
    }

    const timer = setTimeout(() => {
      if (status !== "loading" && !loading) setDelayLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [status, loading, auth, session]);

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

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);

    if (newPassword !== e.target.value) {
      setConfirmPasswordError("Password does not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewPasswordLoading(true);

    try {
      await instance.patch("/auth", {
        email: session ? session!.user!.email : auth ? auth!.email : "",
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

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );
  };

  if (delayLoading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="flex w-full border-t py-10 profile-container">
        <Sidebar />
        <div className="flex flex-col items-start gap-5 w-full px-20">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-4xl font-bold">Profile</h1>
            <h3 className="text-slate-500 text-lg">
              Manage your profile settings
            </h3>
          </div>

          {session ? (
            <div className="flex flex-col items-start gap-5 border px-5 py-4 w-full">
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
                <div className="flex flex-col items-start gap-1 w-full">
                  <Input
                    placeholder="Current password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="flex flex-col items-start gap-1 w-full">
                  <Input
                    placeholder="New password"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPassword}
                  />
                  {newPassowrdError && (
                    <p className="text-red-500 text-sm">{newPassowrdError}</p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-1 w-full">
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                  />
                  {confirmPasswordError && (
                    <p className="text-red-500 text-sm">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={newPasswordLoading}>
                  {newPasswordLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
