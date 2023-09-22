"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommandIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import instance from "@/lib/axios-config";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/contexts/session-provider";
import NavRegister from "@/components/nav/nav-register";
import GithubButton from "@/components/auth/github-button";
import GoogleButton from "@/components/auth/google-button";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const [signUploading, setSignUpLoading] = React.useState<boolean>(false);
  const [githubLoading, setGithubLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState<boolean>(false);
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
      router.push("/login");
    } catch (error: any) {
      if (error) {
        if (error.response.status === 409) {
          setEmailError("Email is already taken");
        }
      }
    } finally {
      setSignUpLoading(false);
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
      <NavRegister />
      <div className="flex items-center w-full h-full register-container">
        <div className="w-1/2 bg-slate-800 h-screen" />
        <form
          className="flex flex-col items-center text-center xl:w-[16vw] lg:w-[30vw]  mx-auto gap-3"
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

          <Button className="w-full" type="submit" disabled={signUploading}>
            {signUploading && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
            Sign Up with Email
          </Button>

          <div className="flex items-center gap-2 w-full">
            <hr className="w-full" />
            <p>Or</p>
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
        </form>
      </div>
    </>
  );
};

export default Register;
