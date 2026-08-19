import { DirectoryPagination } from "@/components/directory/directory-pagination";
import { EmptyResults } from "@/components/directory/empty-results";
import { UserGrid } from "@/components/directory/user-grid";
import { UserTable } from "@/components/directory/user-table";
import { listUsers } from "@/lib/users/api";
import {
  directoryHref,
  profileHref,
  type DirectoryQuery,
} from "@/lib/users/search-params";

/**
 * The list itself, separated from the page so it can sit inside its own
 * Suspense boundary: the header and the search box stay interactive while this
 * is still in flight.
 *
 * One fetch feeds both presentations. UserGrid and UserTable are shown and
 * hidden by breakpoint, never fetched twice.
 */
async function DirectoryResults({ query, page }: DirectoryQuery) {
  const result = await listUsers({ page, query });

  if (result.users.length === 0) {
    return query ? (
      <EmptyResults query={query} />
    ) : (
      <p className="text-sm text-muted-foreground">
        The directory is empty right now.
      </p>
    );
  }

  const from = (result.page - 1) * result.pageSize + 1;
  const to = from + result.users.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Showing <span className="tabular text-foreground">{from}</span> to{" "}
        <span className="tabular text-foreground">{to}</span> of{" "}
        <span className="tabular text-foreground">{result.total}</span>{" "}
        {result.total === 1 ? "person" : "people"}
        {query ? <> matching &ldquo;{query}&rdquo;</> : null}
      </p>

      <UserGrid
        users={result.users}
        hrefFor={(user) => profileHref(user.id, { query, page })}
      />
      <UserTable
        users={result.users}
        hrefFor={(user) => profileHref(user.id, { query, page })}
      />

      <DirectoryPagination
        page={result.page}
        pageCount={result.pageCount}
        hrefFor={(next) => directoryHref({ query, page: next })}
      />
    </div>
  );
}

export { DirectoryResults };
