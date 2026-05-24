"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border p-1 text-sm">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`rounded px-2 py-1 ${resolvedTheme === "light" ? "bg-primary text-primary-foreground" : ""}`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`rounded px-2 py-1 ${resolvedTheme === "dark" ? "bg-primary text-primary-foreground" : ""}`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
