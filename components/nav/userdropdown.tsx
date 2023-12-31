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
import MySession from "@/models/session";

const UserDropdown = () => {
  // Session
  const { data: session } = useSession();
  const mySession = session ? (session as MySession) : null;

  /**
   * Get initials from session email
   *
   * @param email
   * @returns string - initials
   */
  const getInitials = (email: string) => {
    if (!email) {
      return;
    }

    return (email[0] + email[1]).toUpperCase();
  };

  /**
   * Handle sign out
   *
   * @returns void
   */
  const handleSignOut = () => {
    session && signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback>
              {getInitials(mySession?.user?.email as string)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
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
