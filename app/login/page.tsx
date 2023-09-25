"use client";
import GithubButton from "@/components/auth/github-button";
import GoogleButton from "@/components/auth/google-button";
import NavLogin from "@/components/nav/nav-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommandIcon, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";
import React from "react";

const Login = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [signInLoading, setSignInLoading] = React.useState<boolean>(false);
  const [githubLoading, setGithubLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState<boolean>(false);
  const [pageLoading = false, setPageLoading] = React.useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      redirect("dashboard");
    } else {
      setPageLoading(false);
    }
  });

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInLoading(true);

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "http://localhost:3000/dashboard",
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

  if (pageLoading) return null;

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
        </form>

        <div className="flex items-center gap-2 w-full">
          <hr className="w-full" />
          <p>Or</p>
          <hr className="w-full" />
        </div>

        <GithubButton loading={githubLoading} setLoading={setGithubLoading} />
        <GoogleButton loading={googleLoading} setLoading={setGoogleLoading} />
        <Link href={"/register"}>
          <p className="underline underline-offset-4">
            Don&apos;t have an account? Sign Up
          </p>
        </Link>
      </div>
    </>
  );
};

export default Login;
