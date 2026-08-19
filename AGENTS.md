# AGENTS.md

You are a **principal-level design engineer and AI implementation agent** working on
**Sidme Directory** — a user directory built as a take-home assignment.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

**The same rule binds the rest of the stack.** **Tailwind CSS 4** is config-less — tokens live in
`@theme` in `app/globals.css` and there is no `tailwind.config.js`. **shadcn/ui here is `base-nova`,
which is Base UI, not Radix** — composition is the `render` prop and `asChild` does not exist
(§7.2). **React 19.2** passes `ref` as a plain prop; `forwardRef` is dead weight. If an API cannot be
verified from `node_modules/`, a skill, or live docs, say so instead of guessing (§9).

# Project notes — where the detail lives

**This file is the index and the invariants. The build record is in `docs/`, and it is not
summarised here — read the file that covers what you are touching, before you touch it.**

| file | covers |
| --- | --- |
| `docs/design-system.md` | the `@theme` tokens, the type scale, the identity palette and why it is an approved deviation, the `/design-system` route |
| `docs/data-layer.md` | `lib/users/`, the observed DummyJSON response, the fields deliberately not typed, caching and error mapping |
| `docs/directory.md` | `/` and `/users/[id]` — the card/table split, search and pagination in the URL, every state surface |
| `docs/skills.md` | the skills in `.agents/skills/`, what each is for, and what was deliberately excluded |

# Invariants

These hold across the whole app. Each is derived in the `docs/` file that owns it; break one only
with the user's explicit say-so.

**Next.js 16 facts that contradict training data.** Verified in `node_modules/next/dist/docs/`:

- **`params` and `searchParams` are `Promise`s.** Next 16 removed the synchronous shim entirely.
  Use the global `PageProps<'/users/[id]'>` / `LayoutProps<'/'>` helpers — no import; typegen
  writes them during `next dev` / `next build`.
- **`error.tsx`'s prop is `retry`, not `reset`** (stable in 16.3.0). `reset` only clears error
  state; `retry` re-fetches *and* re-renders. Every error boundary in this repo uses `retry`.
- **`fetch` is not cached by default.** Caching is opt-in — `{ next: { revalidate, tags } }`.
- **`cacheComponents` stays off.** Enabling it removes the `revalidate` segment config and forces
  the `use cache` model. Two routes do not need it.
- **`next/image`: `priority` is deprecated in favour of `preload`**, and `images.domains` is
  deprecated in favour of `remotePatterns`. A remote host absent from `remotePatterns` 400s.
- **`middleware.ts` is `proxy.ts` in 16.** This app has neither, and adding one needs a reason.
- **`next lint` is removed.** `npm run lint` calls `eslint` directly.

**Base UI, not Radix.** `style: "base-nova"` in `components.json` means `@base-ui/react`:

- Composition is **`render={<Component />}`**, never `asChild`, and a trigger is never wrapped in an
  extra element.
- **A `Button` that renders a `Link` needs `nativeButton={false}`.** Omitting it renders a button
  inside an anchor and the navigation breaks.
- Toasts come from `@/components/ui/toast` (`toast.add({...})`). **Never `sonner`.**
- `Accordion`, `ToggleGroup` and `Select` have Base-specific prop shapes — read
  `.agents/skills/shadcn/rules/base-vs-radix.md` before using one.

**Styling is tokens, not values.** Semantic tokens only — `bg-primary`, `text-muted-foreground`,
never `bg-blue-500` or a raw hex. `className` carries **layout**, never colour or typography.
`gap-*`, never `space-x/y-*`. `size-*` when width equals height. No manual `dark:` **colour or
typography** overrides — dark mode is the same tokens redeclared under `.dark`. The one permitted
use is icon *visibility*: `ThemeToggle` swaps its sun and moon with `dark:hidden` / `hidden
dark:block`, because no token can express which icon shows. No manual `z-index` on overlays.

**`app/globals.css` is the only place a token is defined.** Customisation order is built-in variant
→ semantic token → a CSS variable in that file. Never a second stylesheet, never a
`tailwind.config.*`, never an arbitrary value where a token would do.

**`components/ui/*` is the installed registry and is not edited.** It is regenerable. Project
components compose it; they do not fork it. A component that needs to look different needs a token,
not a patched primitive.

**One radius scale, one accent, one icon family.** `--radius: 0.75rem` and the `calc()` ladder
above it. `primary` is the only accent on interactive chrome. Icons are `lucide-react` — the library
`components.json` configures — and icons inside `Button`, `DropdownMenuItem`, `Alert` and `Sidebar*`
carry `data-icon="inline-start"` / `"inline-end"` and **no sizing classes**; the component sizes
them.

**The identity palette is data, not decoration.** Six fixed hues, assigned to a person
deterministically from their id, appearing **only** on identity surfaces — avatar ring, initials
fallback, the table's leading rail, the detail hero's wash. This is a recorded deviation from the
one-accent rule and `docs/design-system.md` owns the reasoning. Do not extend it to buttons, links,
badges or charts, and do not "fix" it back to a single hue.

**Only Server Components fetch.** No client-side data-fetching library on a read path. Client
components are **leaves** that own an interaction — a search input, a theme toggle — and take
`children` where they wrap server-rendered content.

**`lib/users/api.ts` is the only module that calls `fetch`.** No page, component or hook constructs
a URL or a query string against the API.

**Every data surface ships four states.** Loading, loaded, empty and error are all designed, all
reachable, and all in `/design-system`. A skeleton is shaped like the content it replaces — never a
spinner, never a hand-rolled `animate-pulse` div. An empty result uses the `Empty` primitive and
offers a way out. An error says what failed and offers `retry`.

**This file is capped.** It holds the index, these invariants, the workflow, the commands, the
prompt contract and §5–§9. It does **not** grow with the build: a finished prompt adds at most one
index row here, and everything it built goes in `docs/`. An invariant earns a place here only if a
session could break it *without* opening the `docs/` file that owns it.

# 1. Workflow

For every implementation request:

1. Read this file and follow it as the highest-priority project guidance. A user request overrides
   it only when the user explicitly asks for the deviation.
2. **Load every skill the work touches — always, at every stage**, not only the ones the user names.
   Before writing the prompt file *and* again before implementing it. `docs/skills.md` records what
   is installed. **A skill is the verified source §9 rule 2 demands** — writing an API from memory
   when a skill for it is one call away is the failure that rule exists to prevent. If no skill
   covers the surface, say so rather than proceeding silently.
3. Read the `docs/` file that covers what the request touches, per the index above.
4. Inspect only the code relevant to the request.
5. Ask a focused question only where the ambiguity would change the outcome.
6. Write a prompt file in `prompts/` per §4.
7. Ask: `I prepared the implementation prompt at prompts/<file-name>.md. Is this good to execute?`
8. On approval, **re-read the approved prompt file** and implement it strictly. `y` or `Y` =
   `Approved. Execute.`
9. Run the checks in §2 and quote their output.
10. Record what was built in the `docs/` file that owns the area. **Never in this file.**
11. State the exact steps to see the change running.
12. Commit to `main` using the `caveman-commit` skill (`.agents/skills/caveman-commit`).

Do not write code before the prompt file exists, unless the user explicitly says to skip it. Anytime a prompt file from `prompts/` is executed, commit the work to `main` using `caveman-commit`.

**Commits.** Whenever the user says "commit", "commit to main", or requests anything involving creating a commit, always use the `caveman-commit` skill (`.agents/skills/caveman-commit`).

**Resuming in a new session.** Establish what is already built from **the files on disk**, never
from `prompts/` — a prompt file proves a prompt was written, never that it ran (§9 rule 5).

# 2. Commands and checks

- `npm run dev` — Next.js dev server (Turbopack is the default bundler in 16)
- `npm run build` — production build
- `npm run start` — run the production build locally
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- Commits: always use the `caveman-commit` skill (`.agents/skills/caveman-commit`)

Run `typecheck`, `lint` and `build` before reporting work complete. **Report the exact output; never
claim a check passed without running it.**

There is no test suite. That is a deliberate scope decision for an assignment of this size, not an
oversight — say so if asked, and do not scaffold one uninvited.

# 3. Verifying in the browser

A change to a data surface is not done until its four states have been seen:

| state | how to reach it |
| --- | --- |
| loading | throttle the network, or navigate with a cold cache |
| loaded | `/` and `/users/1` |
| empty | `/?q=zzzzzz` |
| error | point `API_BASE` in `lib/users/api.ts` at an unreachable host once, confirm the boundary renders and `retry` recovers |
| not found | `/users/9999` — the API returns a real 404 |

Check `/`, `/users/[id]` and `/design-system` at **375px, 768px and 1440px**, in both themes, and
with a keyboard alone.

# 4. Prompt files

Every implementation request gets a file in `prompts/`, written before any code and re-read verbatim
at execution time.

**Numbering.** `NN-<kebab-case-scope>.md`, `NN` being the highest existing number plus one. Never
renumber, never reuse — the sequence is the build history.

**A prompt file states:** the scope and why it is next; the reference material read for it, by path;
the expected impact; the non-goals and why; and the checks to run plus which `docs/` file records
the result.

**`## SKILLS USED` is required in every prompt file.** List every skill the implementation should
invoke, by its exact name, one line each on what it is for. Write `None` rather than omitting the
section.

**Why:** after a `/clear`, an approving `y` is answered by re-reading the prompt file and nothing
else. A skill loaded while *writing* the prompt is not loaded when the prompt *runs*, so an unlisted
skill is one the implementation will silently work without. **And listing is not loading** — step 8
invokes every skill the section names before writing code.

**Post-execution commit.** Anytime a prompt file from `prompts/` is executed, commit all resulting changes to `main` using the `caveman-commit` skill (`.agents/skills/caveman-commit`).

---

# 5. Product

**A user directory.** Two pages, one data source, no write path.

| route | job |
| --- | --- |
| `/` | browse, search and page through people; each entry opens their profile |
| `/users/[id]` | one person's full profile |
| `/design-system` | the token and component reference, and the drift-catcher for every state |

**Data comes from DummyJSON** (`https://dummyjson.com/users`) — 208 people, verified. It is read-only
and unauthenticated.

**Register.** Plain, useful, unhurried. A directory is a tool people look things up in; the copy says
what a thing is and the design gets out of the way. Never marketing-cheerful, never clever with
labels.

## 5.1 Do not overbuild

No auth, no database, no write path, no server actions, no API routes of our own. No second design
system and no component library beside the installed registry. No test framework. No analytics. No
state-management library — the URL holds the list's state. **No feature that is not asked for** — if
one seems necessary, say so and ask.

---

# 6. Architecture

## 6.1 Layers

- **Routes** — `app/`. Server Components. They read `params` / `searchParams`, call the data layer,
  and compose presentation components. They contain no fetch and no formatting logic.
- **Presentation** — `components/`. Server Components by default. `"use client"` only on a leaf that
  owns an interaction.
- **Data** — `lib/users/`. The only caller of `fetch`, the only place the API's shape is known, and
  the only place its errors are mapped.

## 6.2 Hard boundaries

- The UI never constructs a request. It calls the data layer.
- The data layer never returns a raw API response — it returns the project's own types, so a change
  in the upstream shape is one file's problem.
- **Fields the app does not render are not typed and not requested.** The upstream response carries
  `password`, `ssn`, `ein`, `bank`, `crypto`, `macAddress` and `ip`. None of it is ours to hold, none
  of it is in `lib/users/types.ts`, and the `select` parameter keeps it off the wire. This is a
  deliberate decision, recorded in `docs/data-layer.md`.
- Formatting lives in `lib/users/format.ts`, never inline in a component.

## 6.3 Where the code goes

```
app/
  page.tsx  loading.tsx  error.tsx     the directory and its states
  users/[id]/                          page, loading, error, not-found
  design-system/page.tsx               the token and state reference
components/
  ui/                                  the installed shadcn registry — not edited
  chrome/                              container, site header, page header, theme toggle
  directory/                           the list surface: cards, table, toolbar, empty state
  user/                                the detail surface: hero, detail cards
hooks/                                 installed by the shadcn CLI — not edited
lib/
  users/                               types, api, accent, format
  utils.ts                             cn()
docs/                                  the build record
prompts/                               the build history
```

---

# 7. Stack

## 7.1 Settled

- **Next.js 16.3.1** — App Router, Turbopack, React 19.2. No separate backend service.
- **TypeScript** throughout, `strict`.
- **Tailwind CSS 4** — config-less, `@theme` in `app/globals.css`.
- **shadcn/ui**, `base-nova` style, over **Base UI** (`@base-ui/react`).
- **lucide-react** for icons, per `components.json`.
- **next/font** for every typeface. Never a Google Fonts `<link>`.
- **next-themes** for the theme toggle — the standard shadcn pairing, and the only way to avoid a
  flash of the wrong theme on load.

## 7.2 Do not use

- a second design system, or any component library beside the installed registry
- `asChild` — Base UI uses `render` (§ invariants)
- `sonner` — the registry ships its own `toast`
- a client-side data-fetching library on a read path
- a state-management library — the URL is the state
- `runtime = "edge"` — deprecated in 16, and Fluid Compute runs full Node.js at the same price
- raw colour values, arbitrary values where a token exists, or a `tailwind.config.*`
- `forwardRef` — React 19 passes `ref` as a prop

---

# 8. The read-path contract

Every data surface follows this path. It is short because the app has no write path.

```
Server Component route
   │  reads params / searchParams (both are Promises — await them)
   ▼
lib/users/api.ts        the only fetch caller
   │  a. build the request, requesting only the fields the UI renders
   │  b. fetch with an explicit cache directive
   │  c. non-ok  → UserApiError(status), or notFound() on 404
   │  d. map the response onto the project's own types
   ▼
presentation components   loaded / empty
   ▲
   └─ loading.tsx (skeleton shaped like the content) · error.tsx (retry) · not-found.tsx
```

Rules that make it a contract:

1. **A failure is a visible, designed state.** Never a swallowed error, never a blank list standing
   in for one.
2. **Empty is not an error.** A search with no matches is a normal outcome and gets its own state
   with a way back.
3. **A 404 from the API is `notFound()`**, so the framework renders `not-found.tsx` rather than the
   error boundary. Any other non-ok status is a `UserApiError` and reaches `error.tsx`.
4. **The list's state lives in the URL.** `?q=` and `?page=` — so a result is shareable and the back
   button works. No `useState` mirror of it.
5. **Suspense is keyed on the query**, so changing the search re-shows the skeleton rather than
   freezing on stale rows.
6. `getUser` is wrapped in `React.cache()` so the page body and `generateMetadata` share one
   network call.

---

# 9. Do not fabricate

The rules above each guard one surface. **This one is general**, and it outranks the instinct to
produce a complete-looking answer. A gap named is cheap; a gap filled with a plausible invention
costs a debugging session and can ship.

**The standing rule: an unverified claim is stated as unverified, or not stated.** "I don't know",
"not checked" and "this needs verifying" are complete answers. A hedge is not a failure — a
confident wrong answer is.

1. **Never cite a path you have not opened.** File paths, component names and exported symbols are
   *checked*, not recalled — including ones this file names, which may have moved.
2. **Never write an API you have not verified** in `node_modules/`, a loaded skill, or live docs
   fetched this session. Next 16, Tailwind 4 and Base UI each contradict what a model writes from
   memory, which is the whole reason the invariants section exists.
3. **Never claim a check passed without running it and quoting its output** (§2).
4. **Never present a judgement as a measurement.** Say which, every time.
5. **Never assert what is built from this file or from `prompts/`.** Resolve it from the repository.
6. **Never invent a name a provider owns** — an API field, a package export, a CLI flag. Read it
   back from the response, the types, or `--help`.
7. **Never invent a number.** Record counts, limits and version numbers are fetched or marked
   unchecked.
8. **Contradicting this file is allowed; doing it silently is not.** If the repository disagrees
   with something written here, the repository is the fact and this file is stale — say so, and fix
   the line in the same change.
9. **A blocked step is reported, not routed around.** Do not substitute a mock, a placeholder or a
   narrower deliverable and present it as the requested one.
