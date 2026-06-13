"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
        <Link href="/" className="text-foreground hover:opacity-90">
          <SiteBrandTitle />
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/posts" className="hover:text-foreground">
            Articles
          </Link>
          {loggedIn && (
            <>
              <Link href="/me/posts" className="hover:text-foreground">
                My posts
              </Link>
              <Link href="/posts/new" className="hover:text-foreground">
                New post
              </Link>
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
