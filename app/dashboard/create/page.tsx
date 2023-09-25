"use client";
import { Button } from "@/components/ui/button";
import instance from "@/lib/axios-config";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import MySession from "@/models/session";
import NavCreate from "@/components/nav/nav-create";

const TodoCreate = () => {
  const [title, setTitle] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const mySession = session as MySession;

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await instance.post("/todo", {
        title,
        userId: mySession!.id,
      });

      toast({
        description: "Todo created successfully",
        className: "bg-slate-800 text-white",
      });
      setTitle("");
    } catch (error: any) {
      if (error.response.status === 400) {
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

  return (
    <>
      <NavCreate />
      <form
        className="flex flex-col items-start gap-5 px-[300px] create-todo-container"
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

export default TodoCreate;
