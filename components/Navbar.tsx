"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = session?.user.isAdmin
    ? [
        { name: "Challenges", href: "/challenges" },
        { name: "Leaderboard", href: "/leaderboards" },
        { name: "Team", href: "/team" },
        {
          name: "Discord",
          href: "https://discord.gg/NpV655hg97",
        },
        // {name: "Survey", href: "/survey"},
        { name: "Admin", href: "/admin" },
      ]
    : [
        { name: "Challenges", href: "/challenges" },
        { name: "Leaderboard", href: "/leaderboards" },
        { name: "Team", href: "/team" },
        {
          name: "Discord",
          href: "https://discord.gg/NpV655hg97",
        },
        { name: "Survey", href: "/survey" },
      ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SKICTF
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-2">
            {session ? (
              <Button
                variant="ghost"
                className="text-sm hover:text-primary min-w-[80px]"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-primary min-w-[80px]"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="text-sm min-w-[80px]">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded-md px-4 py-2.5 text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="sm:hidden pt-4 border-t">
                  {session ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2.5 text-sm hover:text-primary"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Link href="/auth/login" className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-2.5 text-sm hover:text-primary"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/auth/register" className="w-full">
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-2.5 text-sm hover:text-primary"
                        >
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
