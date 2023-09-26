"use client";
import NavCreate from "@/components/nav/nav-create";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-config";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

/**
 * Component for editing a Todo item.
 * @param {Object} params - The parameters object containing the ID of the Todo to be edited.
 * @returns {JSX.Element} - The rendered component.
 */
const EditTodo = ({ params }: { params: { id: string } }): JSX.Element => {
  const [title, setTitle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { id } = params;
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      getTodoById();
    }
  }, [session]);

  /**
   * Handles the form submission to edit the Todo.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await instance.patch("/todo/edit", { id, title });
      toast({
        description: "Todo updated successfully",
        className: "bg-slate-800 text-white",
      });
      router.push("/dashboard");
    } catch (error: any) {
      handleFormError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles errors during form submission.
   * @param {any} error - The error object.
   */
  const handleFormError = (error: any) => {
    if (error.response && error.response.status === 400) {
      toast({
        variant: "destructive",
        description: "You cannot create an empty todo",
        className: "text-white",
      });
    }
  };

  /**
   * Fetches the Todo by ID and sets the title in the state.
   */
  const getTodoById = async () => {
    try {
      const { data } = await instance.get(`/todo/${id}`);
      setTitle(data.title);
    } catch (error: any) {
      console.error("Error fetching todo by ID:", error); // Changed to console.error for error logging
    }
  };

  return (
    <>
      <NavCreate />
      <form
        className="flex flex-col items-start gap-5 px-[350px] container-fade-in"
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
