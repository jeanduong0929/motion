import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import instance from "@/lib/axios-config";
import Todo from "@/models/todo";
import { Loader2, TrashIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface TodoDeleteDialogProps {
  todoId: string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoDeleteDialog = ({
  todoId,
  openDialog,
  setTodos,
  setOpenDialog,
}: TodoDeleteDialogProps) => {
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await instance.delete(`/todo/${todoId}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
      toast({
        description: "Todo deleted successfully",
        className: "bg-slate-800 text-white",
      });
      setOpenDialog(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this post?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="hover:bg-slate-700"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-800"
              disabled={deleteLoading}
              type="submit"
              onClick={handleDelete}
            >
              {deleteLoading ? (
                <Loader2 className={"h-4 w-4 mr-2 animate-spin"} />
              ) : (
                <TrashIcon className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodoDeleteDialog;
