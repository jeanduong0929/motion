import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AuthContext } from "@/contexts/session-provider";

const UserDropdown = () => {
  const { data: session } = useSession();
  const { auth, setAuth } = React.useContext(AuthContext);

  const getInitials = (email: string) => {
    if (!email) {
      return;
    }

    return (email[0] + email[1]).toUpperCase();
  };

  const handleSignOut = () => {
    signOut();
    setAuth(null);
    sessionStorage.removeItem("auth");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback>
              {getInitials(auth ? auth.email : "")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {session ? session?.user?.email : auth?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={"/dashboard"}>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
          <Link href={"/profile"}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href={"/settings"}>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserDropdown;
