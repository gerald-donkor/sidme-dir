"use client";

import { useEffect } from "react";

import "./globals.css";

/**
 * The boundary for a throw in the root layout itself, which is why it renders
 * its own <html> and <body> — it replaces the layout rather than nesting in it.
 *
 * Deliberately minimal markup rather than the shared DirectoryError: the layout
 * that failed is also the file that sets the next/font variables and the theme
 * class, so the registry primitives would render without their typography and
 * without a resolved theme. Plain token-styled markup degrades honestly here.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
        <h1 className="text-lg font-medium tracking-tight">
          The app could not be loaded
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Something failed before the page could render. Try again, and if it
          keeps failing the service is likely down.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            Reference {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
