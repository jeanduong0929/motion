"use client";
import Loading from "@/components/loading";
import NavTodoCreate from "@/components/nav/nav-todo-create";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/contexts/session-provider";
import instance from "@/lib/axios-config";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const EditTodo = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [todoEditLoading, setTodoEditLoading] = React.useState(false);
  const [delayLoading, setDelayLoading] = React.useState(true);
  const { id } = params;
  const { data: session, status } = useSession();
  const { auth, loading } = React.useContext(AuthContext);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (!session && !auth) {
      redirect("/login");
    }

    const timer = setTimeout(() => {
      if (status !== "loading" && !loading && !todoEditLoading)
        setDelayLoading(false);
    }, 300);

    if (session || auth) {
      getTodoById();
    }

    return () => clearTimeout(timer);
  }, [status, loading, session, auth]);

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await instance.patch("/todo/edit", {
        id,
        title,
      });

      toast({
        description: "Todo updated successfully",
        className: "bg-slate-800 text-white",
      });

      router.push("/dashboard");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          description: "You cannot create an empty todo",
          className: "text-white",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTodoById = async () => {
    setTodoEditLoading(true);
    try {
      const { data } = await instance.get(`/todo/${id}`);
      setTitle(data.title);
    } catch (error: any) {
      console.log(error);
    } finally {
      setTodoEditLoading(false);
    }
  };

  if (delayLoading) return <Loading />;

  return (
    <>
      <NavTodoCreate />
      <form
        className="flex flex-col items-start gap-5 px-[350px] todo-edit-container"
        onSubmit={handleForm}
      >
        <input
          placeholder="Todo title"
          value={title}
          className="border-none shadow-none focus:outline-none text-5xl placeholder-shown:font-bold font-bold bg-transparent"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          className="absolute top-10 right-20"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save
        </Button>
      </form>
    </>
  );
};

export default EditTodo;
