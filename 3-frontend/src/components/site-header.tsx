"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GuardedLink } from "@/components/guarded-link";
import { SiteBrandTitle } from "@/components/site-brand-title";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getAccessToken());
  }, []);

  async function onLogout() {
    await logout();
    setLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <GuardedLink href="/" className="text-foreground hover:opacity-90">
          <SiteBrandTitle />
        </GuardedLink>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <GuardedLink href="/" className="hover:text-foreground">
            Home
          </GuardedLink>
          <GuardedLink href="/posts" className="hover:text-foreground">
            Articles
          </GuardedLink>
          {loggedIn && (
            <>
              <GuardedLink href="/me/posts" className="hover:text-foreground">
                My posts
              </GuardedLink>
              <GuardedLink href="/posts/new" className="hover:text-foreground">
                New post
              </GuardedLink>
            </>
          )}
          {loggedIn ? (
            <button type="button" onClick={onLogout} className="hover:text-foreground">
              Log out
            </button>
          ) : (
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
