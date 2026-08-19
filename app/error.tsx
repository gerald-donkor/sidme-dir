"use client";

import { Container } from "@/components/chrome/container";
import { DirectoryError } from "@/components/directory/directory-error";

export default function DirectoryErrorBoundary({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main id="content" className="flex-1 pb-16">
      <Container className="pt-12">
        <DirectoryError
          title="The directory could not be loaded"
          description="The people service did not respond. Nothing was lost. Try again, and if it keeps failing the service is likely down."
          retry={retry}
        />
      </Container>
    </main>
  );
}
