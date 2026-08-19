# 16 — Loading and error state hardening

## Scope and why it is next

The assignment's "show loading and error state" is implemented, but a read of the routes turned up
five defects in it. This prompt fixes all five. Nothing else on the list surface changes — no new
feature, no visual redesign.

1. **The error boundary swallows the search box.** `app/error.tsx` is the segment boundary, so a
   failed search replaces the whole page including `DirectoryToolbar`. The reader cannot edit the
   query that failed; they can only retry the same one. The list needs its own boundary.
2. **The `error` prop is discarded.** Both boundaries destructure only `retry`. `error.digest` — the
   only thing that survives Next's production redaction — is never shown and never logged, so a
   failure cannot be matched to a server log.
3. **No `app/global-error.tsx`.** A throw in the root layout or `ThemeProvider` has no designed
   state; the reader gets the framework default.
4. **`AGENTS.md:162` is stale.** It names a `USERS_API` env var. `grep` over the repo finds it in
   that one line and nowhere else — the base URL is the hardcoded `API_BASE` at `lib/users/api.ts:21`
   (`docs/directory.md` already says `API_BASE`). §9 rule 8: the repo is the fact.
5. **Loading a11y.** `app/users/[id]/loading.tsx:6` puts `aria-hidden` on `<main id="content">` —
   the skip-link target and the whole landmark. And nothing announces the wait to a screen reader;
   only the loaded count is `aria-live` (`directory-results.tsx:38`).

## Reference material read for this

- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/catchError.md` — `catchError`
  from `next/error`, **stable in 16.3.0**, is the framework's component-level error boundary. It
  gives `retry()` inside a Transition, passes `redirect()` / `notFound()` through instead of
  catching them, and clears on client navigation. Verified present in the installed package:
  `node_modules/next/error.d.ts` exports `catchError` and `type ErrorInfo`; `next@16.3.1`.
- `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md` — nested boundaries,
  the `global-error.js` shape (**must render its own `<html>` and `<body>`**), and the
  `useEffect(() => console.error(error))` logging pattern.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md:106-113` —
  **in production the `Error` forwarded from a Server Component is replaced by a generic message
  plus `digest`.** This is the constraint that decides fix 2 (see non-goals).
- `docs/directory.md` — the four-states table, the keyed `<Suspense>`, the `retry`-not-`reset` rule.
- `docs/data-layer.md:84-86` — the failure mapping this must not change.
- `AGENTS.md` invariants — tokens only, `gap-*`, `Empty` for empty/error surfaces, `data-icon` on
  icons in `Button`, no edits to `components/ui/*`.

## The changes

**1. Scoped boundary — new `components/directory/directory-boundary.tsx`**

`"use client"`. `catchError(fallback)` from `next/error`, fallback rendering the existing
`DirectoryError` with the directory copy, logging the error in a `useEffect`. Export the wrapper.
In `app/page.tsx`, wrap the keyed `<Suspense>` — and only it — so `PageHeader` and
`DirectoryToolbar` stay mounted and interactive through a failure.

`app/error.tsx` stays as the outer net for a throw in the page shell itself.

**2. Surface what survives redaction — `components/directory/directory-error.tsx`**

Add an optional `digest?: string`. When present, render it below the description as a reference
code (mono, `text-muted-foreground`) so a reader can quote it. `app/error.tsx`,
`app/users/[id]/error.tsx` and the new boundary all take `error`, pass `error.digest`, and
`console.error(error)` in a `useEffect` per the docs.

**3. New `app/global-error.tsx`**

`"use client"`, its own `<html lang="en">` / `<body>`, importing `./globals.css` because it replaces
the root layout. Plain token-styled markup with a `retry` button. It cannot use `DirectoryError`'s
`Empty` composition safely without the layout's font variables, so keep it deliberately minimal and
say so in a comment.

**4. `AGENTS.md:162`** — `USERS_API` → `API_BASE` in `lib/users/api.ts`, matching `docs/directory.md`.

**5. a11y**

- `app/users/[id]/loading.tsx`: move `aria-hidden` off `<main>` onto the inner content wrapper.
- `DirectorySkeleton` gains a `label` prop, default `"Loading users"`, rendering an `sr-only`
  `role="status"` beside the `aria-hidden` skeleton. `/design-system` passes `label={null}` — that
  page is a reference, not a live wait. Give `app/users/[id]/loading.tsx` the same sr-only status
  with `"Loading profile"`.

## Expected impact

A failed search keeps its search box. Every error screen carries a digest and reaches the console.
A root-layout throw has a designed page. The skip link works during a profile load, and a screen
reader hears that the page is loading. `AGENTS.md` stops naming a variable that does not exist.

## Non-goals, and why

- **Rendering the HTTP status in the error UI.** `UserApiError` carries it, but `error.md:106-113`
  is explicit that production replaces the message with a generic one and keeps only `digest`. A UI
  that reads `error.status` would work in dev and silently show nothing in production — the exact
  shape of §9's fabrication failure. The digest is what actually crosses the boundary, so that is
  what is shown. Record this in `docs/directory.md` so it is not "fixed" later.
- **Adding a `USERS_API` env var** to make the stale line true. That is new configuration to justify
  a doc sentence; correcting the sentence is the smaller change (§5.1).
- **Any change to `lib/users/api.ts`'s mapping**, the four-state set, the skeleton's shape, the
  Suspense key, or `components/ui/*`.
- **An error toast.** The boundary already is the designed state; a toast on top is noise.

## SKILLS USED

- `shadcn` — every surface here composes `components/ui/*` (`Empty`, `Button`, `Skeleton`). Its
  `rules/base-vs-radix.md` governs `render` vs `asChild`, `rules/icons.md` the `data-icon` on the
  retry icon, `rules/styling.md` the tokens-and-layout split.
- `vercel-react-best-practices` — `async-suspense-boundaries` for where the new boundary sits
  relative to the keyed `<Suspense>`, and the client-leaf rule for the boundary component.
- `design-taste-frontend` — its universal floor: real loading/empty/error cycles, skeletons shaped
  like content, no em-dashes in UI copy.
- `web-design-guidelines` — the a11y pass over fix 5 (landmark, `role="status"`, skip link).
- `caveman-commit` — the commit at step 12.

## Checks and where the result is recorded

`npm run typecheck`, `npm run lint`, `npm run build`, output quoted verbatim. Then reach the states
per `AGENTS.md` §3: `/`, `/?q=zzzzzz`, `/users/1`, `/users/9999`, and the error path by pointing
`API_BASE` at an unreachable host once — confirming the toolbar survives it and `retry` recovers.

Recorded in **`docs/directory.md`** (the four-states table, the new boundary, the digest reasoning).
`docs/data-layer.md` is untouched — the failure mapping does not change.
