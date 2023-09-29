import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import instance from "@/lib/axios-config";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import MySession from "@/models/session";
import { useToast } from "../ui/use-toast";

interface NoteCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  session: Session | null;
}

const NoteCategoryDialog = ({
  open,
  setOpen,
  session,
}: NoteCategoryDialogProps) => {
  const [name, setName] = React.useState<string>("");
  const [nameError, setNameError] = React.useState<string>("");
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const mySession = session ? (session as MySession) : null;
  const { toast } = useToast();

  useEffect(() => {
    setName("");
    setNameError("");
  }, [open]);

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      // Make the API call to save the category
      await instance.post("/notes/category", {
        name,
        user: mySession!.id,
      });

      // Close the dialog
      setOpen(false);

      // Display success toaster
      toast({
        description: "Category created successfully",
        className: "bg-green-500",
      });
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setNameError("Category name cannot be empty");
      } else if (error.response && error.response.status === 409) {
        setNameError("Category name already exists");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <form className="flex flex-col gap-3" onSubmit={handleForm}>
            <DialogHeader>
              <DialogTitle className="mb-2">Create a category</DialogTitle>
              <div className="flex flex-col items-start gap-2 w-full">
                <Input
                  placeholder="Category name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {nameError && (
                  <p className="text-small text-red-500">{nameError}</p>
                )}
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={"secondary"}
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveLoading}>
                {saveLoading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteCategoryDialog;
