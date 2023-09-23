import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SaveIcon } from "lucide-react";
import Link from "next/link";

const EditorDropdown = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <SaveIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="font-bold cursor-pointer">
            Save
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href={"/notes"}>
            <DropdownMenuItem className="cursor-pointer">Back</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default EditorDropdown;
