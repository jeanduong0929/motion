"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import instance from "@/lib/axios-config";
import { CommandIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GithubButton from "@/components/auth/github-button";
import GoogleButton from "@/components/auth/google-button";
import FormInput from "@/components/form/form-input";
import FormButton from "@/components/form/form-button";
import { Button } from "@/components/ui/button";

/**
 * Component for rendering the registration page.
 * @returns {JSX.Element} - The rendered component.
 */
const Register = (): JSX.Element => {
  return (
    <>
      <NavRegister />
      <div className="flex items-center w-full h-full container-fade-in">
        <div className="w-1/2 bg-slate-800 h-screen" />
        <RegisterForm />
      </div>
    </>
  );
};

/**
 * Component for rendering the registration form.
 * @returns {JSX.Element} - The rendered component.
 */
const RegisterForm = (): JSX.Element => {
  // Form states
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Form errors
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  // Loading states
  const [signUploading, setSignUpLoading] = React.useState<boolean>(false);

  // Hooks
  const { toast } = useToast();

  /**
   * Handles the email input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);

    if (!e.target.value.trim()) {
      setEmailError("Email is required");
    } else if (!isValidEmail(e.target.value)) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  };

  /**
   * Handles the password input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object.
   * @returns {void}
   */
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);

    if (!e.target.value.trim()) {
      setPasswordError("Password is required");
    } else if (!isValidPassword(password)) {
      setPasswordError("Password is invalid");
    } else {
      setPasswordError("");
    }
  };

  /**
   * Handles the form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   * @returns {Promise<void>}
   */
  const handleForm = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setSignUpLoading(true);

    try {
      await instance.post("/auth/register", {
        email,
        password,
      });
      toast({
        description: "We've created your account for you.",
        className: "bg-slate-800 text-white",
      });
      useRouter().push("/login");
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        setEmailError("Email is already taken");
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  /**
   * Checks if the email is valid.
   * @param {string} email - The email to check.
   * @returns {boolean} - Whether the email is valid.
   */
  const isValidEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  /**
   * Checks if the password is valid.
   * @param {string} password - The password to check.
   * @returns {boolean} - Whether the password is valid.
   */
  const isValidPassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );
  };

  return (
    <>
      <form
        className="flex flex-col items-center text-center mx-auto gap-3 max-w-screen-xl w-[400px]"
        onSubmit={handleForm}
      >
        <CommandIcon size={30} />
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-slate-500">
          Enter your email below to create your account
        </p>

        <FormInput
          placeholder={"name@example.com"}
          type={"email"}
          value={email}
          handleValue={handleEmail}
          error={emailError}
        />

        <FormInput
          placeholder={"Password"}
          type={"password"}
          value={password}
          handleValue={handlePassword}
          error={passwordError}
        />

        <FormButton
          label={"Sign Up with Email"}
          loading={signUploading}
          type="submit"
        />

        <RegisterFooter />
      </form>
    </>
  );
};

/**
 * Component for rendering the login footer.
 * @returns {JSX.Element} - The rendered component.
 */
const RegisterFooter = (): JSX.Element => {
  const [githubLoading, setGithubLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState<boolean>(false);

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <hr className="w-full" />
        <p>OR</p>
        <hr className="w-full" />
      </div>

      <GithubButton loading={githubLoading} setLoading={setGithubLoading} />
      <GoogleButton loading={googleLoading} setLoading={setGoogleLoading} />

      <Link href={"/register"}>
        <p className="text-sm">
          By clicking continue, you agree to our{" "}
          <Link href={"/terms"} className="underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href={"/privacy"} className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </Link>
    </>
  );
};

/**
 * Component for rendering the registration navigation.
 * @returns {JSX.Element} - The rendered component.
 */
const NavRegister = (): JSX.Element => {
  return (
    <>
      <nav className="absolute flex items-center top-0 right-0  px-20 py-10">
        <Link href={"/login"} className="px-5 py-2 rounded-md">
          <Button variant={"ghost"}> Login</Button>
        </Link>
      </nav>
    </>
  );
};

export default Register;
