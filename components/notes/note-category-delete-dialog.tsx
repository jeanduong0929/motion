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
import { Loader2, TrashIcon } from "lucide-react";
import NoteCategory from "@/models/note-category";
import instance from "@/lib/axios-config";
import { useToast } from "../ui/use-toast";

interface NoteCategoryDeleteDialogProps {
  dialog: boolean;
  setDialog: (open: boolean) => void;
  category: NoteCategory;
}

const NoteCategoryDeleteDialog = ({
  dialog,
  setDialog,
  category,
}: NoteCategoryDeleteDialogProps) => {
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await instance.delete(`/notes/category/${category._id}`);
      toast({
        description: "Category deleted successfully",
        className: "bg-green-500",
      });
      setDialog(false);
    } catch (error: any) {
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialog} onOpenChange={() => setDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this category?
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="hover:bg-slate-700"
              onClick={() => setDialog(false)}
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

export default NoteCategoryDeleteDialog;
