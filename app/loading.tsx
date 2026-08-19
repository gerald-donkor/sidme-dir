import { Container } from "@/components/chrome/container";
import { DirectorySkeleton } from "@/components/directory/directory-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main id="content" className="flex-1 pb-16">
      <Container>
        <div className="flex flex-col gap-4 pt-8 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pt-12">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-full sm:w-80" />
        </div>
        <DirectorySkeleton />
      </Container>
    </main>
  );
}
