"use client";

import React from "react";
import { useRouter, redirect } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, CommandIcon, Loader2 } from "lucide-react";
import GithubButton from "@/components/auth/github-button";
import GoogleButton from "@/components/auth/google-button";

/**
 * Component for rendering the login page.
 * @returns {JSX.Element} - The rendered component.
 */
const Login = (): JSX.Element => {
  // Form states
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Error states
  const [error, setError] = React.useState<string>("");

  // Loading states
  const [signInLoading, setSignInLoading] = React.useState<boolean>(false);

  // Session
  const { data: session } = useSession();

  // Hooks
  const router = useRouter();

  /**
   * Redirects to dashboard if session exists.
   */
  React.useEffect(() => {
    if (session) {
      redirect("dashboard");
    }
  });

  /**
   * Handles the form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   * @returns {Promise<void>} - A promise.
   */
  const handleForm = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setSignInLoading(true);

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (data && data.error) {
        setError("Incorrect email or password");
        return;
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.log(error);
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <>
      <NavLogin />
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3 login-container mx-auto max-w-screen-xl w-[400px]">
        <form
          className="flex flex-col items-center justify-center text-center gap-3 w-full"
          onSubmit={handleForm}
        >
          <CommandIcon size={30} />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-slate-500">
            Enter your email to sign in to your account
          </p>

          <div className="flex flex-col items-start gap-1 w-full">
            <Input
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" type="submit" disabled={signInLoading}>
            {signInLoading && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
            Sign In with Email
          </Button>

          <LoginFooter />
        </form>
      </div>
    </>
  );
};

/**
 * Component for rendering the login footer.
 * @returns {JSX.Element} - The rendered component.
 */
const LoginFooter = (): JSX.Element => {
  // Loading states
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
        <p className="underline underline-offset-4">
          Don&apos;t have an account? Sign Up
        </p>
      </Link>
    </>
  );
};

/**
 * Component for rendering the login navigation.
 * @returns {JSX.Element} - The rendered component.
 */
const NavLogin = (): JSX.Element => {
  return (
    <>
      <nav className="flex items-center px-20 py-5">
        <Link href={"/"}>
          <Button variant={"ghost"} className="text-md">
            <ChevronLeft size={20} className="mr-2" />
            Back
          </Button>
        </Link>
      </nav>
    </>
  );
};

export default Login;
