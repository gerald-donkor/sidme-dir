# The directory and the profile

The two routes the assignment asks for, and the states around them.

## Routes

| route | render | notes |
| --- | --- | --- |
| `/` | dynamic | reads `?q=` and `?page=`, so it is request-time by definition |
| `/users/[id]` | dynamic | on demand; see `docs/data-layer.md` on `generateStaticParams` |
| `/design-system` | static | fixtures only, no fetch — it stays viewable when the API is down |

## State lives in the URL

`?q=` and `?page=`, parsed in one place (`lib/users/search-params.ts`) and never mirrored into React
state. That is what makes a search shareable, survivable across a reload, and correct under the back
button — there is no second copy for the two to drift apart.

`DirectoryToolbar` is a **client leaf** and the only client component on the page. It owns the input
value and nothing else: after a 300ms debounce it calls `router.replace` inside a transition, and
the server re-renders the list. A new query resets `page`, because asking for page 4 of a two-page
result is a broken URL. `isPending` from the transition drives the spinner in the field, so the wait
is visible without a second loading flag.

`profileHref` carries `q` and `page` onto the profile URL, and the profile's back link rebuilds the
list URL from them. The reader returns to the search they left, not to the top of the directory.
The parts are re-encoded rather than passed as a `back=` URL — a whole URL taken from a query string
is the shape that turns into an open redirect the moment someone passes it to `redirect()`.

## One fetch, two presentations

`DirectoryResults` fetches once. `UserGrid` renders cards and is `md:hidden`; `UserTable` renders
rows and is `hidden md:block`. Both are in the DOM, one is displayed, **and there is exactly one
request**. Two components fetching for two breakpoints would be the easy mistake here.

The table drops columns as it narrows — Company below `lg`, Department below `xl` — rather than
scrolling sideways, and the card carries the same facts stacked.

Only the name is a link in a table row. A row-wide click target would either nest interactive
elements inside a `<tr>` or need a JS row handler that keyboard users cannot reach. In the card
layout the whole card *is* the link, which is legitimate because the card contains no other control.

## The four states

| state | where | reach it |
| --- | --- | --- |
| loading | `app/loading.tsx` and a `<Suspense>` around the list | throttle the network, or search |
| loaded | — | `/` |
| empty | `EmptyResults`, via the `Empty` primitive | `/?q=zzzzzz` |
| error | `app/error.tsx` → `DirectoryError` | point `API_BASE` at an unreachable host |
| not found | `app/users/[id]/not-found.tsx` | `/users/9999` |

The `<Suspense>` boundary is **keyed on `` `${query}|${page}` ``**. Without the key, changing the
search holds the previous page's rows on screen while the next ones load, which reads as a frozen
UI. With it, the skeleton comes back and the wait is honest.

The skeleton is shaped like the content it replaces — the same grid below `md`, the same row rhythm
above it — so nothing jumps when the data lands.

Error boundaries take **`retry`**, the Next 16.3 prop, not `reset`. `reset` only clears the error
state and would re-render straight into the same failure; `retry` re-runs the fetch. Both boundaries
share one `DirectoryError` component so the two screens cannot drift apart.

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
