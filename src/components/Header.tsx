"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, Gem, Heart, LogIn, LogOut, UserPlus } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">AI Recipe Curator</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {user?.isLoggedIn && (
            <Link
              href="/favorites"
              className="hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
            >
              Favorites
            </Link>
          )}
           <Link
              href="/premium"
              className="hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
            >
              {user?.isPremium ? 'Premium Status' : 'Go Premium'}
            </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {user?.isLoggedIn ? (
            <>
              {user.isPremium && <Gem className="h-5 w-5 text-accent" title="Premium Member" />}
              <span className="hidden sm:inline text-sm text-muted-foreground">Hi, {user.name}</span>
               <Button variant="ghost" size="icon" asChild>
                <Link href="/favorites" aria-label="Favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
