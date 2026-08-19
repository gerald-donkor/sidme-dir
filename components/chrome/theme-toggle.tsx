"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Client leaf. Owns one interaction and nothing else.
 *
 * Which icon shows is decided in CSS off the `.dark` class the provider writes
 * to <html>, not from `resolvedTheme` — that value is undefined until after
 * hydration, so reading it during render would either mismatch the server
 * output or need a mounted flag and the cascading render that comes with it.
 * The label is direction-neutral for the same reason: a button that announced
 * "switch to dark" before the theme was known would announce it wrongly.
 */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}

export { ThemeToggle };
