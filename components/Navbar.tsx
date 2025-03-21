"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useSession, signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {Menu, X} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const {data: session} = useSession();

  const navItems = session?.user.isAdmin
    ? [
        {name: "Challenges", href: "/challenges"},
        {name: "Leaderboard", href: "/leaderboard"},
        {name: "Team", href: "/team"},
        {name: "Admin", href: "/admin/challenges"},
      ]
    : [
        {name: "Challenges", href: "/challenges"},
        {name: "Leaderboard", href: "/leaderboard"},
        {name: "Team", href: "/team"},
      ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
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

        <div className="flex items-center space-x-4">
          <nav className="flex items-center">
            {session ? (
              <Button
                variant="ghost"
                className="text-sm hover:text-primary"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-primary"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="text-sm">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu with transition */}
      <div
        className={`transform transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 pb-3 pt-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
