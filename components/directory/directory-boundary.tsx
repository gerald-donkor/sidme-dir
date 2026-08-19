"use client";

import { useEffect } from "react";
import { catchError, type ErrorInfo } from "next/error";

import { DirectoryError } from "@/components/directory/directory-error";

/**
 * A boundary around the results list alone.
 *
 * app/error.tsx is the segment boundary, so a failed search replaces the whole
 * page — including the search box that holds the query that failed. Scoping a
 * boundary to the results keeps the header and the toolbar mounted, so the
 * reader can edit the query instead of only retrying the same one.
 *
 * catchError is the framework's component-level boundary (stable in 16.3): its
 * retry() re-fetches inside a Transition, redirect() and notFound() pass
 * through instead of being caught, and the error clears on client navigation.
 */
function DirectoryBoundaryFallback(_props: object, { error, retry }: ErrorInfo) {
  return <FallbackBody error={error} retry={retry} />;
}

/**
 * ErrorInfo types `error` as `unknown` — the boundary catches whatever was
 * thrown, not necessarily an Error — so the digest is read defensively.
 */
function digestOf(error: unknown) {
  return error instanceof Error && "digest" in error
    ? String(error.digest)
    : undefined;
}

function FallbackBody({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DirectoryError
      title="The list could not be loaded"
      description="The people service did not respond. Your search is still here. Try again, and if it keeps failing the service is likely down."
      digest={digestOf(error)}
      retry={retry}
    />
  );
}

const DirectoryBoundary = catchError(DirectoryBoundaryFallback);

export { DirectoryBoundary };
