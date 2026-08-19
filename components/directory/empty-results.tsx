import Link from "next/link";
import { UserRoundSearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/** No matches is a normal outcome, not a failure. It gets a way out. */
function EmptyResults({ query }: { query: string }) {
  return (
    <Empty className="border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserRoundSearchIcon />
        </EmptyMedia>
        <EmptyTitle>No one matches &ldquo;{query}&rdquo;</EmptyTitle>
        <EmptyDescription>
          Search matches names, usernames and email addresses. Try a shorter
          term, or check the spelling.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Show everyone
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export { EmptyResults };
