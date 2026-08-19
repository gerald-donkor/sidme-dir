"use client";

import { useRouter } from "next/navigation";

import { DirectoryError } from "@/components/directory/directory-error";

/**
 * The error state as it appears on /design-system.
 *
 * The reference page renders the real DirectoryError rather than a description
 * of it, so a change to the component — its copy, its digest line, its button —
 * shows up here. DirectoryError takes a `retry` function, which a Server
 * Component cannot pass across the boundary, so this client leaf owns it.
 *
 * `router.refresh()` re-fetches and re-renders the route, which is the closest
 * honest equivalent of what `retry` does inside a real boundary. The button is
 * live, not decorative.
 */
const SAMPLE_DIGEST = "3f0a91c2b7d45e68";

function DirectoryErrorPreview() {
  const router = useRouter();

  return (
    <DirectoryError
      title="The directory could not be loaded"
      description="The people service did not respond. Nothing was lost. Try again, and if it keeps failing the service is likely down."
      digest={SAMPLE_DIGEST}
      retry={() => router.refresh()}
    />
  );
}

export { DirectoryErrorPreview };
