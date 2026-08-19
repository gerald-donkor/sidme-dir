# 01 — Foundation, design system, and both routes

## Scope, and why it is first

Everything: the project contract, the token layer, the data layer, and the two routes the
assignment asks for. It is one prompt rather than five because the repository started as an
untouched `create-next-app` scaffold with the shadcn registry installed and no application code, so
there was no existing surface for a smaller prompt to be scoped against.

**The workflow in `AGENTS.md` §1 starts properly at prompt 02.** This file is a record of the
foundation build, written after the fact against an approved plan rather than before the fact
against an approval question. It is numbered 01 so the sequence has an origin and so no later prompt
reuses the number. It is not evidence of a prompt-then-approve cycle that did not happen — see
`AGENTS.md` §9 rule 5, and resolve what is built from the repository.

## Reference material read

- `ref/ref-AGENTS.md` — the structural template for `AGENTS.md`
- `node_modules/next/dist/docs/` — `03-file-conventions/{page,layout,loading,error,not-found}.md`,
  `04-functions/{generate-metadata,generate-static-params,fetch}.md`,
  `01-getting-started/{06-fetching-data,08-caching,10-error-handling}.md`,
  `02-guides/{streaming,view-transitions,upgrading/version-16}.md`,
  `05-config/01-next-config-js/cacheComponents.md`
- `.agents/skills/shadcn/rules/{base-vs-radix,styling,composition,icons}.md`
- `.agents/skills/{tailwind-design-system,frontend-design,design-taste-frontend,vercel-react-best-practices,vercel-react-view-transitions}/SKILL.md`
- `node_modules/@base-ui/react/avatar/**` and `components/ui/{avatar,badge,button,card,empty,pagination,skeleton,table,input-group}.tsx`
- the live DummyJSON API, curled before any type was written

## What it built

1. `AGENTS.md` from the reference structure, and `docs/{skills,design-system,data-layer,directory}.md`.
2. The token layer in `app/globals.css`: semantic chrome, the six-hue identity palette and its
   `data-identity` binding, one radius scale, Outfit alongside Geist. Plus `components/chrome/`.
3. `lib/users/` — types, the fetch layer, the identity hue, formatters, URL-state parsing.
4. `/` — search, pagination, card grid below `md`, table above it, and all four states.
5. `/users/[id]` — profile, `generateMetadata`, loading, error and not-found.
6. `/design-system` — the token reference and the state gallery.

## Non-goals

No auth, no database, no write path, no API routes of our own, no test framework, no state
library, no view transitions (`docs/directory.md` records why). `components/ui/*` unedited.

## Checks

`npm run typecheck`, `npm run lint`, `npm run build`, and the browser walk in `AGENTS.md` §3 at
375 / 768 / 1440 in both themes. Recorded in the `docs/` files named above.

## SKILLS USED

- `shadcn` — Base UI composition (`render`, `nativeButton={false}`), the styling rules, and the
  primitive-by-primitive API for Card, Avatar, Empty, Table, Badge, Skeleton and InputGroup
- `tailwind-design-system` — the CSS-first `@theme` structure, the token hierarchy, and the
  `Container` / CVA pattern in `components/chrome/`
- `frontend-design` — setting the aesthetic direction before writing a token
- `design-taste-frontend` — the quality floor: real loading/empty/error cycles, content-shaped
  skeletons, labels above inputs, no generic avatars
- `vercel-react-best-practices` — `React.cache()` around `getUser`, the Suspense boundary around
  the list, minimal props into the one client leaf
- `vercel-react-view-transitions` — read, and its gate applied; the outcome was not to implement
- `web-design-guidelines` — the closing accessibility and interface pass
