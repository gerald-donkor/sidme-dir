import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

/**
 * Page controls are real links, so they prefetch, open in a new tab, and work
 * before JavaScript arrives.
 *
 * The registry's `PaginationLink` is deliberately not used. It renders
 * `role="button"` and `tabIndex` onto an anchor — which tells a screen reader
 * this activates something rather than navigating — and its Base UI `render`
 * composition resolves `data-slot` differently on the server and the client,
 * which trips a hydration mismatch. `buttonVariants` gives the same appearance
 * over honest markup. Recorded in docs/directory.md.
 */
function PageLink({
  href,
  isActive,
  label,
  wide,
  children,
}: {
  href: string;
  isActive?: boolean;
  label: string;
  /** Previous/Next carry a word beside the chevron and need the room. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size: "icon" }),
        wide && "w-auto px-2.5"
      )}
    >
      {children}
    </Link>
  );
}

function PageEdge({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-label={label}
      aria-disabled="true"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "w-auto px-2.5 opacity-40"
      )}
    >
      {children}
    </span>
  );
}

function DirectoryPagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  // A short window around the current page: enough to move, not a wall of numbers.
  const start = Math.max(1, Math.min(page - 1, pageCount - 2));
  const pages = Array.from(
    { length: Math.min(3, pageCount) },
    (_, index) => start + index
  ).filter((candidate) => candidate <= pageCount);

  const previous = (
    <>
      <ChevronLeftIcon />
      <span className="hidden sm:inline">Previous</span>
    </>
  );
  const next = (
    <>
      <span className="hidden sm:inline">Next</span>
      <ChevronRightIcon />
    </>
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PageLink href={hrefFor(page - 1)} label="Go to previous page" wide>
              {previous}
            </PageLink>
          ) : (
            <PageEdge label="Previous page">{previous}</PageEdge>
          )}
        </PaginationItem>

        {start > 1 && (
          <PaginationItem>
            <PageLink href={hrefFor(1)} label="Go to page 1">
              1
            </PageLink>
          </PaginationItem>
        )}

        {start > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((candidate) => (
          <PaginationItem key={candidate}>
            <PageLink
              href={hrefFor(candidate)}
              isActive={candidate === page}
              label={`Go to page ${candidate}`}
            >
              {candidate}
            </PageLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          {page < pageCount ? (
            <PageLink href={hrefFor(page + 1)} label="Go to next page" wide>
              {next}
            </PageLink>
          ) : (
            <PageEdge label="Next page">{next}</PageEdge>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { DirectoryPagination };
