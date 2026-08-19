# The directory and the profile

The two routes the assignment asks for, and the states around them.

## Routes

| route | render | notes |
| --- | --- | --- |
| `/` | dynamic | reads `?q=` and `?page=`, so it is request-time by definition |
| `/users/[id]` | dynamic | accepts id or slug (`/users/22-elijahs`); canonical redirect preserves `?q=` / `?page=` |
| `/design-system` | static | fixtures only, no fetch — it stays viewable when the API is down |

## Profile route slugs and canonicalisation

Profile URLs carry the username (`/users/${id}-${username}`) for human readability, while the
leading integer id strictly drives the data fetch. The helper `parseUserSlug` extracts the id from
the URL segment.

If a visitor arrives via a non-canonical URL (such as legacy `/users/22` or a mismatched username
slug), the server component issues a canonical redirect (`redirect(profileHref(user, query))`),
preserving any incoming `?q=` and `?page=` query parameters so the "Back to users" navigation
remains intact.

The browse page (`/`) presents the primary heading as "Users", with associated navigation and empty-state messaging aligned to the user directory.

The profile hero displays `@{user.username}` in monospace typography directly below the full name.

## State lives in the URL

`?q=` and `?page=`, parsed in one place (`lib/users/search-params.ts`) and never mirrored into React
state. That is what makes a search shareable, survivable across a reload, and correct under the back
button — there is no second copy for the two to drift apart.

`DirectoryToolbar` is a **client leaf** and the only client component on the page. It owns the input
value and nothing else: after a 300ms debounce it calls `router.replace` inside a transition, and
the server re-renders the list. A new query resets `page`, because asking for page 4 of a two-page
result is a broken URL. `isPending` from the transition drives the spinner in the field, so the wait
is visible without a second loading flag. When external navigations change `initialQuery` (e.g. clicking
the logo, "Home" navigation, or browser history), `DirectoryToolbar` syncs its state during render
so stale inputs are not debounced back into the URL.

The field is `type="search"` for its semantics, but Chromium draws its own clear cross inside such
an input, which sat beside ours as a second, unlabelled X. A base rule in `app/globals.css` hides
`::-webkit-search-cancel-button` and `::-webkit-search-decoration`, leaving the one labelled
`Clear search` button the toolbar renders.

`profileHref` carries `q` and `page` onto the profile URL, and the profile's back link rebuilds the
list URL from them. The reader returns to the search they left, not to the top of the directory.
The parts are re-encoded rather than passed as a `back=` URL — a whole URL taken from a query string
is the shape that turns into an open redirect the moment someone passes it to `redirect()`.

## One fetch, two presentations

`DirectoryResults` fetches once. `UserGrid` renders cards and is `md:hidden`; `UserTable` renders
rows and is `hidden md:block`. Both are in the DOM, one is displayed, **and there is exactly one
request**. Two components fetching for two breakpoints would be the easy mistake here.

The table drops columns as it narrows — Company below `lg`, Department below `xl` — rather than
scrolling sideways, and the card carries the same facts stacked. Cells and headers use `px-4 py-3.5`
spacing (`h-11` on headers) with `h-11` identity rail indicators for a comfortable, balanced row
rhythm without cramped elements.

Only the name is a link in a table row. A row-wide click target would either nest interactive
elements inside a `<tr>` or need a JS row handler that keyboard users cannot reach. In the card
layout the whole card *is* the link, which is legitimate because the card contains no other control.

## The four states

| state | where | reach it |
| --- | --- | --- |
| loading | `app/loading.tsx` and a `<Suspense>` around the list | throttle the network, or search |
| loaded | — | `/` |
| empty | `EmptyResults`, via the `Empty` primitive | `/?q=zzzzzz` |
| error | `DirectoryBoundary` around the list, `app/error.tsx` around the shell, both → `DirectoryError` | point `API_BASE` in `lib/users/api.ts` at an unreachable host |
| not found | `app/users/[id]/not-found.tsx` | `/users/9999` |

The `<Suspense>` boundary is **keyed on `` `${query}|${page}` ``**. Without the key, changing the
search holds the previous page's rows on screen while the next ones load, which reads as a frozen
UI. With it, the skeleton comes back and the wait is honest.

The skeleton is shaped like the content it replaces — the same grid below `md`, the same row rhythm
above it — so nothing jumps when the data lands.

Error boundaries take **`retry`**, the Next 16.3 prop, not `reset`. `reset` only clears the error
state and would re-render straight into the same failure; `retry` re-runs the fetch. Every boundary
shares one `DirectoryError` component so the screens cannot drift apart.

### The list has its own boundary

`app/error.tsx` is the *segment* boundary, so a failed search replaced the whole page — including
the search box holding the query that failed. The reader could only retry the same query, never edit
it. `components/directory/directory-boundary.tsx` fixes that: it wraps the keyed `<Suspense>` and
nothing else, so `PageHeader` and `DirectoryToolbar` stay mounted and interactive through a failure.
Verified in the browser — with `API_BASE` pointed at an unreachable host, editing the search box
still updated `?q=` while the error was on screen, and `retry` recovered in place once the host was
restored. `app/error.tsx` remains as the net for a throw in the page shell itself.

It is built on **`catchError`** from `next/error` (stable in 16.3.0), not a hand-rolled React error
boundary: its `retry()` re-fetches inside a Transition, `redirect()` and `notFound()` pass through
instead of being caught, and the error clears on client navigation. `ErrorInfo` types `error` as
`unknown`, so the digest is read behind an `instanceof Error` check.

### The digest is shown, the status is not

Every boundary now receives `error`, logs it with `console.error` in a `useEffect`, and passes
`error.digest` to `DirectoryError`, which renders it as a mono reference line. `UserApiError`
carries the HTTP status, but Next replaces a Server Component error with a generic message plus
`digest` in production (`next/dist/docs/.../file-conventions/error.md`), so a UI reading
`error.status` would work in dev and show nothing in production. The digest is the only identifier
that crosses the boundary, so it is the only one rendered. Do not "fix" this by surfacing the
status.

### `app/global-error.tsx`

A throw in the root layout or `ThemeProvider` used to fall through to the framework default. It now
has a designed page, which renders its own `<html>` and `<body>` because it replaces the root
layout. Deliberately plain markup rather than `DirectoryError`: the file that failed is also the one
that sets the `next/font` variables and the theme class, so the registry primitives would render
without their typography.

### Announcing the wait

The skeletons are decorative and stay `aria-hidden`, but the wait itself needs to reach a screen
reader. `DirectorySkeleton` renders an `sr-only` `role="status"` beside the bars, defaulting to
"Loading users"; `/design-system` passes `label={null}` because that page is a reference, not a live
wait. `app/users/[id]/loading.tsx` carries the same status with "Loading profile", and its
`aria-hidden` moved off `<main id="content">` — that is the landmark and the skip link's target, and
hiding it took the whole page away from a screen reader for the duration of the load.

## The registry's Pagination is used for structure and not for links

`Pagination`, `PaginationContent` and `PaginationItem` are the `<nav>`, `<ul>` and `<li>`, and those
are fine. **`PaginationLink` is not used**, for two reasons found by running the app:

1. It puts `role="button"` and `tabIndex` on an `<a href>`. That tells a screen reader the control
   activates something, when it navigates. Pagination is navigation.
2. Its Base UI `render` composition resolves `data-slot` to `pagination-link` on the server and
   `button` on the client, which throws a hydration mismatch on every page load. The console error
   is reproducible on `/?page=2` with the registry component in place.

`DirectoryPagination` uses `buttonVariants` on a plain `next/link` instead: the same appearance over
honest markup, no mismatch. The registry file itself is untouched — it is regenerable, and the fix
belongs upstream.

Page 1 is anchored and always accessible from the pagination bar across all pages: when navigating
beyond the initial pages (`start > 1`), page 1 is prepended as a direct link, with a `PaginationEllipsis`
(`...`) rendered whenever the sliding window starts beyond page 2 (`start > 2`).

## What was considered and left out

**View transitions.** The `vercel-react-view-transitions` skill's first-priority pattern is a
shared-element morph, and list-to-profile is the textbook case: the avatar would carry its identity
colour into the hero. It is not implemented, and the reason is structural rather than time. A
`<ViewTransition name>` must be unique in the tree, and this page deliberately renders **both** the
card and the table row for every person, with CSS choosing which one is visible. Two nodes for the
same person means two elements claiming one name. Naming only one of them would make the transition
work at one breakpoint and silently not at the other. The skill's own gate — a transition stays only
if it clearly communicates a relationship — is not met by an animation that fires on desktop and not
on mobile, so it was left out rather than half-wired.

**A grid/table view toggle.** The breakpoint already answers the question. A control that lets a
reader pick the denser layout on a phone is a control that lets them pick the worse one.
