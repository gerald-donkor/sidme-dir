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

/**
 * The profile segment: the id, which fetches, plus the username, which only
 * makes the URL readable. Never the other way round.
 */
export function userSlug(user: { id: number; username: string }): string {
  return user.username ? `${user.id}-${user.username}` : String(user.id);
}

/**
 * The id out of a profile segment. The username half is decoration and is not
 * trusted or checked — `22`, `22-elijahs` and `22-anything` all resolve to 22.
 * A segment that does not start with digits is not a profile and returns null.
 */
export function parseUserSlug(segment: string): string | null {
  const match = /^(\d+)(?:-|$)/.exec(segment);
  return match ? match[1] : null;
}

/** A profile URL that remembers the list the reader came from. */
export function profileHref(
  user: { id: number; username: string },
  { query, page }: Partial<DirectoryQuery>
): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page && page > 1) params.set("page", String(page));

  const search = params.toString();
  const path = `/users/${userSlug(user)}`;
  return search ? `${path}?${search}` : path;
}
