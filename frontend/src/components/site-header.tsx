"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearAccessToken, getAccessToken } from "@/lib/auth";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Blog CMS";

export function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getAccessToken());
  }, []);

  function logout() {
    clearAccessToken();
    setLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          {siteName}
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link href="/posts" className="hover:text-foreground">
            Posts
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
            <button type="button" onClick={logout} className="hover:text-foreground">
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
