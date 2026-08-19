# 18 — The design-system error tile, and recording the streamed 404 status

## Scope and why it is next

Prompt 16 hardened the loading and error states. Reviewing the result turned up one real gap and one
thing that looked like a defect and is not. This prompt closes the gap and records the non-defect so
it is not "fixed" later.

1. **`/design-system` describes the error state instead of rendering it.** `app/design-system/page.tsx:359-375`
   renders a static `<div>` of prose about `DirectoryError` where the loading and empty tiles render
   the real components. The `AGENTS.md` invariant is that all four states are *in* `/design-system`,
   and the reason given there is drift-catching. Prose does not catch drift: prompt 16 added a
   `digest` prop to `DirectoryError` and that page would not have shown it. One of the four states is
   currently documented on the reference page rather than demonstrated by it.

2. **`/users/9999` returning HTTP 200 is documented framework behaviour, not a bug.** It was reported
   as a defect in the session that produced this file. That report was wrong, and the correction is
   the point of this item — see the reference material. The response is a *streamed* not-found, and
   Next returns `200` for streamed not-founds and `404` only for non-streamed ones. The mitigation
   the framework ships is a `noindex` meta tag, which this app already emits (verified below).
   `docs/directory.md` currently lists `not found` as a clean state with no note about the status, so
   the next reader has nothing to stop them from "fixing" it by deleting `app/users/[id]/loading.tsx`
   and losing the profile skeleton.

## Reference material read for this

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md:101-122`
  — **"Status Codes".** Verbatim: streaming returns `200`; because the headers are already sent
  "the status code of the response cannot be updated"; Next includes
  `<meta name="robots" content="noindex">` in the streamed HTML so the URL is not indexed; crawlers
  may call it a soft 404 but "this does not lead to indexation because the page is explicitly marked
  `noindex`". A real `404` requires checking the resource **before the body streams**, which the doc
  says to do in `proxy`. The collapsed note at `:116-122` names the trigger precisely: the body
  starts streaming "when a Suspense fallback renders (for example, a `loading.tsx`)".
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md` — same rule
  stated from the other side: `not-found.js` returns "a `200` HTTP status code for streamed
  responses, and `404` for non-streamed".
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/not-found.md` — the
  "Calling `notFound()` after streaming has started" example, which is exactly this app's shape, and
  states the trade-off in the same terms.
- **Measured, not recalled:** `curl -s http://localhost:3000/users/9999 | grep robots` returns
  `name="robots" content="noindex"/`. The mitigation is live in this app.
- `app/design-system/page.tsx:340-378` — the States section and the comment giving the original
  reason for the static error tile.
- `components/directory/directory-error.tsx` — the component the tile must render, including the
  `digest` prop added by prompt 16.
- `docs/directory.md` — "The four states" table and the error-boundary section that prompt 16 rewrote.

## The changes

**1. A real error tile — new `components/directory/directory-error-preview.tsx`**

`"use client"`. Renders `DirectoryError` with the directory copy and a `retry` that calls
`router.refresh()` from `next/navigation`.

The original comment objected that the reference page "must not ship an interactive control that does
nothing", and that objection is correct — the fix is to give the button something real to do, not to
keep the component off the page. `router.refresh()` genuinely re-fetches the route, so the control is
honest. A client leaf is required because a server component cannot pass a function prop across the
boundary.

Pass a `digest` so the reference covers that surface too. It must read as a sample rather than a real
incident id: name the constant so the file says what it is, and keep it in the preview component, not
in `DirectoryError`.

In `app/design-system/page.tsx`, replace the static `<div>` and its comment with
`<DirectoryErrorPreview />`. Keep the surrounding `error` heading and the section's structure.

**2. Record the status behaviour — `docs/directory.md`**

In the four-states table, the `not found` row gains the status note. Below it, a short subsection
stating: streamed not-found responses are `200` by design; the `noindex` meta is the framework's
mitigation and is present on `/users/9999`; a real `404` would require the existence check to run
before the body streams, which means `proxy` and a second upstream request per profile view; that is
not worth it for a read-only directory with no compliance or analytics requirement on the status
code. Cite the `loading.md` "Status Codes" section by path so the next reader can check it.

State plainly that `app/users/[id]/loading.tsx` is what starts the stream, so deleting it *would*
restore the `404` — and that the skeleton is worth more than the status code here. That is the
sentence that stops the "fix".

## Expected impact

`/design-system` demonstrates all four states with the real components, so a change to
`DirectoryError` — including its digest line — shows up there. `docs/directory.md` explains the 200,
so the next reader does not delete the profile skeleton chasing a status code that the framework
documents as correct.

## Non-goals, and why

- **Adding `proxy.ts` to force a real 404.** `AGENTS.md` says this app has neither a `middleware.ts`
  nor a `proxy.ts` and that adding one needs a reason. "A crawler might call it a soft 404" is not a
  reason when the framework's own mitigation is already emitting `noindex` on the page. It would also
  put an existence check on every profile view, doubling the upstream request, and it would have to
  either call `lib/users/api.ts` from the edge of the app or construct a URL itself — which the
  data-layer boundary forbids.
- **Deleting `app/users/[id]/loading.tsx`.** It would restore the `404` and cost the profile
  skeleton, trading a designed state for a status code nothing in this app consumes.
- **Changing `DirectoryError`, the boundaries, or the skeletons.** Prompt 16 settled those; this is
  the reference page and the record only.
- **Making the other design-system tiles interactive.** The loading and empty tiles are already the
  real components; nothing about them is dead.

## SKILLS USED

- `shadcn` — the preview composes `Empty` and `Button` through `DirectoryError`; `rules/styling.md`
  for the tokens-and-layout split and `rules/composition.md` for the `Empty` usage.
- `vercel-react-best-practices` — the client-leaf rule for the new preview component.
- `web-design-guidelines` — the a11y pass over a live `role="alert"` region now rendering on a
  reference page alongside other content.
- `design-taste-frontend` — its universal floor: real error cycles rather than a description of one,
  no em-dashes in UI copy.
- `caveman-commit` — the commit at step 12.

## Checks and where the result is recorded

`npm run typecheck`, `npm run lint`, `npm run build`, output quoted verbatim.

Then in the browser: `/design-system` at 375px, 768px and 1440px in both themes, confirming the error
tile renders with its digest line and that its "Try again" button actually refreshes rather than
sitting dead. Re-confirm `curl -s http://localhost:3000/users/9999 | grep robots` still returns the
`noindex` tag.

Note for whoever runs this: the error surfaces are **client-rendered from the flight payload**, so
`curl | grep` cannot see them and returns zero hits even when the error is plainly on screen. Verify
them in the browser. The `noindex` tag is the exception — it is in the streamed HTML and curl does
see it.

Recorded in **`docs/directory.md`** (the four-states table, the new subsection on the status code).
`docs/design-system.md` gains at most one line if it enumerates the States section; check before
writing. `AGENTS.md` is not touched — no invariant changes.
