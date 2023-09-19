"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommandIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import instance from "@/lib/axios-config";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/contexts/session-provider";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);
  const { toast } = useToast();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (!e.target.value.trim()) {
      setEmailError("Email is required");
    } else if (!isValidEmail(e.target.value)) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (!e.target.value.trim()) {
      setPasswordError("Password is required");
    } else if (!isValidPassword(password)) {
      setPasswordError("Password is invalid");
    } else {
      setPasswordError("");
    }
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await instance.post("/auth/register", {
        email,
        password,
      });
      toast({
        description: "We've created your account for you.",
        className: "bg-slate-800 text-white",
      });
      router.push("/login");
    } catch (error: any) {
      if (error.response.status === 409) {
        setEmailError("Email is already taken");
      }
    }
  };

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );
  };

  if (status === "loading" || loading) return <Loading />;

  if (session || auth) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="flex items-center w-full h-full">
        <div className="w-1/2 bg-slate-800 h-screen" />
        <form
          className="flex flex-col items-center text-center w-[30vw] mx-auto gap-3"
          onSubmit={handleForm}
        >
          <CommandIcon size={30} />
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-slate-500">
            Enter your email below to create your account
          </p>

          <div className="flex flex-col items-start gap-1 w-full">
            <Input
              placeholder="name@example.com"
              type="email"
              value={email}
              onBlur={handleEmail}
              onChange={handleEmail}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          <div className="flex flex-col items-start gap-1 w-full">
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onBlur={handlePassword}
              onChange={handlePassword}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          <Button className="w-full" type="submit">
            Sign Up with Email
          </Button>

          <div className="flex items-center gap-2 w-full">
            <hr className="w-full" />
            <p>Or</p>
            <hr className="w-full" />
          </div>

          <Button
            className="w-full"
            onClick={() =>
              signIn("github", {
                callbackUrl: "http://localhost:3000/dashboard",
              })
            }
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="github"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              className="mr-2 h-4 w-4"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              ></path>
            </svg>
            Github
          </Button>
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
        </form>
      </div>
    </>
  );
};

export default Register;
