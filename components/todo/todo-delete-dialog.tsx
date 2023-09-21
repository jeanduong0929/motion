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
import { TrashIcon } from "lucide-react";

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
  const handleDelete = async (id: string) => {
    try {
      await instance.delete(`/todo/${id}`);
      setOpenDialog(false);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error: any) {
      console.log(error);
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
              className="hover:bg-slate-700"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-800"
              onClick={() => handleDelete(todoId)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodoDeleteDialog;
