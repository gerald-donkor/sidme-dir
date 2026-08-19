import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shaped like the list it replaces — same grid at small widths, same row rhythm
 * at md and up — so the layout does not jump when the data lands.
 */
function DirectorySkeleton({ rows = 8 }: { rows?: number }) {
  const items = Array.from({ length: rows }, (_, index) => index);

  return (
    <div aria-hidden>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        {items.map((item) => (
          <div
            key={item}
            className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-24 rounded-4xl" />
          </div>
        ))}
      </div>

      <div className="hidden flex-col rounded-xl bg-card ring-1 ring-foreground/10 md:flex">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 border-b px-4 py-3.5 last:border-b-0"
          >
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-52" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="hidden h-4 w-28 lg:block" />
            <Skeleton className="hidden h-5 w-24 rounded-4xl xl:block" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { DirectorySkeleton };
