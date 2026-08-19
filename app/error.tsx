"use client";

import { useEffect } from "react";

import { Container } from "@/components/chrome/container";
import { DirectoryError } from "@/components/directory/directory-error";

/**
 * The outer net: a throw in the page shell itself, outside the results
 * boundary. A failure inside the list is caught by DirectoryBoundary, which
 * keeps the toolbar mounted.
 */
export default function DirectoryErrorBoundary({
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
    <main id="content" className="flex-1 pb-16">
      <Container className="pt-12">
        <DirectoryError
          title="The directory could not be loaded"
          description="The people service did not respond. Nothing was lost. Try again, and if it keeps failing the service is likely down."
          digest={error.digest}
          retry={retry}
        />
      </Container>
    </main>
  );
}
