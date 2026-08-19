# Sidme Directory

A user directory: browse people, search them, open a profile.

Built with **Next.js 16.3 (App Router)**, **TypeScript**, **Tailwind CSS 4** and **shadcn/ui**
(the `base-nova` style, which is built on Base UI rather than Radix). Data comes from the public
[DummyJSON](https://dummyjson.com) users API.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| script | does |
| --- | --- |
| `npm run dev` | dev server (Turbopack) |
| `npm run build` | production build |
| `npm run start` | serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

No environment variables. The API is public and read-only.

## Routes

| route | what it is |
| --- | --- |
| `/` | the directory: search, pagination, cards on mobile and a table on desktop |
| `/users/[id]` | one person's profile |
| `/design-system` | the tokens, the type scale, and every component state in one place |

## Where things are

```
app/
  layout.tsx                 fonts, theme provider, skip link, site header
  page.tsx  loading  error   the directory and its states
  users/[id]/                profile: page, loading, error, not-found
  design-system/             the token and state reference
  globals.css                every design token, defined once
components/
  ui/                        the shadcn registry, installed and unedited
  chrome/                    container, site header, page header, theme toggle
  directory/                 the list: cards, table, toolbar, pagination, states
  user/                      the profile: avatar, hero, detail cards
lib/users/                   types, the fetch layer, identity hue, formatters, URL state
docs/                        why things are the way they are
```

`AGENTS.md` is the project contract, and `docs/` is the build record:
[design-system](docs/design-system.md) · [data-layer](docs/data-layer.md) ·
[directory](docs/directory.md) · [skills](docs/skills.md).

## The decisions worth knowing

**Design: quiet chrome, colourful data.** The furniture is a calm near-neutral. Colour is spent in
exactly one place: identity. Six hues at a fixed lightness and chroma, assigned to a person from
their id, so the same person is the same colour on their card, in their table row and on their
profile. It is a recognition aid, not decoration, and it is why the app reads as colourful without
being noisy. The mechanics and the contrast reasoning are in
[docs/design-system.md](docs/design-system.md).

**One fetch, two presentations.** The list renders as cards below `md` and as a table above it.
Both markups exist; CSS picks one. There is still exactly one request. Two components fetching for
two breakpoints is the easy mistake here.

**State lives in the URL.** `?q=` and `?page=`, parsed in one place and never mirrored into React
state. A search is shareable, survives a reload, and the back button does the right thing. The
search box is a client leaf that debounces and calls `router.replace`; everything else on both
pages is a Server Component.

**One module talks to the network.** `lib/users/api.ts` is the only caller of `fetch` and the only
place the upstream shape is known. It returns the project's own types, so an upstream rename is one
file's problem.

**Fields we do not need are not requested.** The API's user record also carries `password`, `ssn`,
`bank` details and a crypto wallet. None of it is typed, and the request names its fields so none of
it crosses the wire. It is toy data on a public API, which is exactly why the decision is worth
making on purpose.

**All four states are real.** Loading is a skeleton shaped like the content it replaces, and the
Suspense boundary is keyed on the query so a new search shows it again rather than freezing on stale
rows. Empty is its own screen with a way out. Errors use Next 16.3's `retry`, which re-runs the
fetch — `reset` only clears the error and would land straight back on it. A 404 from the API becomes
`notFound()` and gets its own screen, because a missing person is not a failure.

**The registry is not edited.** `components/ui/*` stays regenerable. Where a registry component was
wrong for this app — `PaginationLink` puts `role="button"` on an anchor and trips a hydration
mismatch — the app stopped using that piece and
[said why](docs/directory.md#the-registrys-pagination-is-used-for-structure-and-not-for-links)
rather than patching the file.

**No view transitions.** They were planned. A shared-element morph needs one element per name, and
this page deliberately renders both a card and a table row for every person. Naming one of them
would animate on desktop and silently not on mobile, so it was left out rather than half-wired.
Reasoning in [docs/directory.md](docs/directory.md).

**No tests.** A deliberate scope call for an app this size, not an oversight. The verification that
was done is written down below.

## Checks

`npm run typecheck`, `npm run lint` and `npm run build` all pass. The build's route table:

```
┌ ƒ /
├ ○ /_not-found
├ ○ /design-system
└ ƒ /users/[id]
```

Walked in the browser at 390px, 768px and 1440px, in both themes:

- the list, search (`?q=li` → 34 matches), pagination, and a profile
- the empty state (`/?q=zzzzzz`) and not-found (`/users/9999`, a real 404 from the API)
- the error state, by pointing the API host at an unreachable domain — then confirming **Try again**
  brings the 24 rows back without a reload
- keyboard only: the skip link appears on first Tab, and every control has a visible focus ring
