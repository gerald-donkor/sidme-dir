"use client";

import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * The shared body of every error boundary in the app.
 *
 * `retry` is the Next 16.3 prop and it re-runs the failed render — unlike
 * `reset`, which only clears the error state and would show the same failure
 * again. The message says what went wrong without leaking a stack trace.
 *
 * `digest` is the only part of a Server Component error that survives Next's
 * production redaction, so it is the only identifier worth showing: it is what
 * matches this screen to a line in the server log. The HTTP status carried by
 * UserApiError does not cross the boundary in production and is deliberately
 * not rendered.
 */
function DirectoryError({
  title,
  description,
  digest,
  retry,
}: {
  title: string;
  description: string;
  digest?: string;
  retry: () => void;
}) {
  return (
    <Empty className="border bg-card py-16" role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
        {digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            Reference {digest}
          </p>
        ) : null}
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={() => retry()}>
          <RotateCwIcon data-icon="inline-start" />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { DirectoryError };
