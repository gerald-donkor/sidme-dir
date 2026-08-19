import { Container } from "@/components/chrome/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main id="content" className="flex-1 pb-16" aria-hidden>
      <Container className="flex flex-col gap-6 pt-6">
        <Skeleton className="h-7 w-40" />

        <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Skeleton className="size-20 rounded-full sm:size-24" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-5 w-32 rounded-4xl" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((card) => (
            <div
              key={card}
              className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <Skeleton className="h-5 w-28" />
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 flex-1 max-w-64" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
