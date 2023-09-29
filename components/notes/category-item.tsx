import NoteCategory from "@/models/note-category";
import { Loader2 } from "lucide-react";
import React from "react";
import NoteCategoryDropdown from "./note-category-dropdown";
import NoteCategoryDeleteDialog from "./note-category-delete-dialog";

interface CategoryItemProps {
  category: NoteCategory;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const [loadingCategoryId, setLoadingCategoryId] = React.useState<string>("");
  const [deleteDialog, setDeleteDialog] = React.useState<boolean>(false);

  return (
    <>
      <div
        key={category._id}
        className="flex items-center justify-between border px-5 py-4"
      >
        {loadingCategoryId === category._id ? (
          <Loader2 className="h-4 w-4 animate-spin container-fade-in" />
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className={"font-bold"}>{category.name}</h1>
            <NoteCategoryDropdown setDeleteDialog={setDeleteDialog} />
          </div>
        )}
      </div>

      <NoteCategoryDeleteDialog
        dialog={deleteDialog}
        setDialog={setDeleteDialog}
        category={category}
      />
    </>
  );
};

export default CategoryItem;
