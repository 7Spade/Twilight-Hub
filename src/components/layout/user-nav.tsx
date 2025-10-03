/**
 * @fileoverview User navigation dropdown menu.
 * This component displays the user's avatar and, when clicked, opens a dropdown
 * with links to the user's profile, starred spaces, settings, and a logout button.
 * It retrieves user information from the `useUser` hook and profile data from a prop.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { User, Settings, LogOut, Star } from "lucide-react";

import { useAuth, useUser } from "@/firebase";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Account } from "@/lib/types";

export function UserNav({ userProfile }: { userProfile: Account | null }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!user) {
    return null;
  }

  const avatarUrl = user.photoURL || getPlaceholderImage('avatar-1').imageUrl;
  const fallbackText = user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0) : 'U');
  const profileUrl = userProfile ? `/${userProfile.slug}` : `/`;
  const starredUrl = userProfile ? `/${userProfile.slug}?tab=stars` : '/';


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={user.displayName || "User Avatar"} />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileUrl}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={starredUrl}>
            <Star className="mr-2 h-4 w-4" />
            <span>Starred Spaces</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
