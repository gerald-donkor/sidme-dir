/**
 * The directory's state lives in the URL. This module is the one place that
 * knows its shape, so a page never parses a raw search param by hand.
 */

export interface DirectoryQuery {
  query: string;
  page: number;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function parseDirectoryQuery(params: RawSearchParams): DirectoryQuery {
  const page = Number.parseInt(first(params.page), 10);

  return {
    query: first(params.q).trim(),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** The directory URL for a given state. Omits defaults so "/" stays "/". */
export function directoryHref({ query, page }: Partial<DirectoryQuery>): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page && page > 1) params.set("page", String(page));

  const search = params.toString();
  return search ? `/?${search}` : "/";
}

/** A profile URL that remembers the list the reader came from. */
export function profileHref(
  id: number,
  { query, page }: Partial<DirectoryQuery>
): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page && page > 1) params.set("page", String(page));

  const search = params.toString();
  return search ? `/users/${id}?${search}` : `/users/${id}`;
}
