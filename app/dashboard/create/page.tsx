"use client";

// React and Next-Auth
import React from "react";
import { useSession } from "next-auth/react";

// Custom UI Components
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Models and Data
import MySession from "@/models/session";

// API and Network
import instance from "@/lib/axios-config";

// Custom Components
import NavCreate from "@/components/nav/nav-create";

/**
 * Component for creating a new Todo.
 * @returns {JSX.Element} - The rendered component.
 */
const TodoCreate = (): JSX.Element => {
  // State Variables
  const [title, setTitle] = React.useState<string>("");
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);

  // Session Handling
  const { data: session } = useSession();
  const mySession = session as MySession;

  // Custom Hook
  const { toast } = useToast();

  /**
   * Handles the submission of the todo form.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   * @returns {Promise<void>}
   */
  const handleForm = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setButtonLoading(true);

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
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          description: "You cannot create an empty todo",
          className: "text-white",
        });
      }
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <>
      <NavCreate />
      <form
        className="flex flex-col items-start gap-5 px-[300px] container-fade-in"
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
          disabled={buttonLoading}
        >
          {buttonLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save
        </Button>
      </form>
    </>
  );
};

export default TodoCreate;
