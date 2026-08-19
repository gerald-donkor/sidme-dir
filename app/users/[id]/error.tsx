"use client";

import { Container } from "@/components/chrome/container";
import { DirectoryError } from "@/components/directory/directory-error";

export default function UserProfileErrorBoundary({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main id="content" className="flex-1 pb-16">
      <Container className="pt-12">
        <DirectoryError
          title="This profile could not be loaded"
          description="The people service did not respond. The profile still exists. Try again in a moment."
          retry={retry}
        />
      </Container>
    </main>
  );
}
