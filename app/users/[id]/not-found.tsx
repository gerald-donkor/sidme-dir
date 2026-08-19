import Link from "next/link";
import { UserRoundXIcon } from "lucide-react";

import { Container } from "@/components/chrome/container";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function UserNotFound() {
  return (
    <main id="content" className="flex-1 pb-16">
      <Container className="pt-12">
        <Empty className="border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserRoundXIcon />
            </EmptyMedia>
            <EmptyTitle>No such profile</EmptyTitle>
            <EmptyDescription>
              Nobody in the directory has that id. They may have been removed,
              or the link may be wrong.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/" />}>
              Back to directory
            </Button>
          </EmptyContent>
        </Empty>
      </Container>
    </main>
  );
}
