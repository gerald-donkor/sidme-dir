# 03 — Navigation, directory copy, profile slugs and card surfaces

## Scope, and why it is next

Five review notes from the user, all on surfaces already built. Nothing new is being added to the
product — this is a polish pass on the chrome, the directory's copy, the profile URL and the profile
card surfaces, plus one question to answer about the registry.

1. **`SiteHeader`: replace the "Design system" link with a "Home" link to `/`.** Rendered and
   responsive.
2. **The directory `PageHeader` copy is generic.** Make it simple, descriptive, and specific to this
   app rather than to any directory.
3. **The profile route should carry the username.** `/users/22` becomes `/users/22-elijahs`, and the
   hero shows `@elijahs`. Confirmed with the user, who chose this over a username-only route
   (`/users/elijahs`) precisely so the id still drives the fetch and old links keep working.
4. **The profile's `DetailCard`s are flat white.** Give them a gradient tied to the person's identity
   hue, so the four cards read as part of the same profile as the hero.
5. **Answer the registry question** — is every UI component shadcn? — from the repository, not from
   memory.

## Reference read for this

- `AGENTS.md` — invariants: tokens only, `render` not `asChild`, `nativeButton={false}` on a
  `Button` that renders a `Link`, identity palette is data and is confined to identity surfaces.
- `docs/design-system.md` — the identity palette, the `data-identity` → `--identity` /
  `--identity-soft` / `--identity-ink` binding, and the recorded reason a class name assembled by
  concatenation cannot work here.
- `docs/directory.md` — routes, URL state, the four states.
- `app/globals.css:94-230` — the identity tokens in both themes and the `[data-identity="n"]` bindings.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md` — `redirect(path,
  type)` from `next/navigation`, `replace` by default outside Server Actions, throws so it must sit
  outside a `try`.
- `components/chrome/site-header.tsx`, `components/chrome/page-header.tsx`, `app/page.tsx`,
  `app/users/[id]/page.tsx`, `components/user/identity-hero.tsx`,
  `components/user/detail-card.tsx`, `lib/users/search-params.ts`, `lib/users/api.ts`,
  `components/directory/directory-results.tsx`.
- The `shadcn` skill, loaded before this file was written and to be loaded again before it runs.

## The work

### 1. Header — "Home" replaces "Design system"

`components/chrome/site-header.tsx`. Keep the existing `Button variant="ghost" size="sm"
nativeButton={false} render={<Link href="/" />}` shape — that is the verified Base UI pattern and
the reason the current link works. Changes:

- `href="/design-system"` → `href="/"`, label `Design system` → `Home`.
- Add a `HouseIcon` from `lucide-react` with `data-icon="inline-start"` and **no sizing class**.
- **Responsive:** the label is hidden below `sm` and the icon stands alone, so the header does not
  crowd at 375px. Use `size="icon-sm"` semantics only if the registry `Button` exposes it — verify
  in `components/ui/button.tsx` first; otherwise keep `size="sm"` and wrap the label in
  `<span className="hidden sm:inline">`. Give the button an `aria-label="Home"` so the icon-only
  state is still named.
- The wordmark on the left already links to `/`. That is fine and stays — it is the brand, the new
  button is the nav item — but do **not** let both render as two visually identical affordances;
  the ghost button with an icon reads as navigation, the wordmark as identity.

`/design-system` is **not** deleted. The route stays and remains reachable by URL; it simply leaves
the header. Record that in `docs/design-system.md` so a later session does not think it was dropped.

### 2. Directory page header copy

`app/page.tsx`. Current copy: "Directory" / "Everyone in the organisation, with their role, team and
where they are based. Open a profile for contact details."

Replace with copy that is specific to this app and tells the reader what they can actually do here.
Constraints from the register in `AGENTS.md` §5: plain, useful, unhurried; never marketing-cheerful;
never clever with labels. It must stay honest about the data — it is 208 people from a public
read-only source, and the search is a full-directory search, not a filter of the current page.

Title stays a plain noun. The description should name the two things the page offers — searching the
whole directory by name, email or username, and opening a person for their full profile — in one
short sentence, not two. Do not invent a company name, a team count, or a "last updated" claim.

No change to `PageHeader` / `PageTitle` / `PageDescription` themselves; this is copy in `app/page.tsx`.

### 3. Username in the route and in the hero

**The slug.** `/users/[id]` keeps its segment name and its id-driven fetch. The segment simply
accepts `22-elijahs` as well as `22`.

- Add to `lib/users/search-params.ts` (it already owns URL shape and is the only place that knows
  it):
  - `userSlug(user: { id: number; username: string }): string` → `${id}-${username}`.
  - `parseUserSlug(segment: string): string | null` → the leading digits, or `null` when the segment
    does not start with digits. Do **not** trust the username half; it is decoration and the id is
    the key.
- `profileHref` changes its first parameter from `id: number` to the user (or `{ id, username }`) so
  it can build the slug. Both call sites in `components/directory/directory-results.tsx` already have
  the whole `UserSummary` in hand, so this is a one-line change at each.
- `app/users/[id]/page.tsx` and `generateMetadata` run the segment through `parseUserSlug` before
  calling `getUser`. A segment with no leading digits is `notFound()` — that behaviour already lives
  in `getUser`'s `/^\d+$/` guard, so passing it the parsed id preserves it exactly.
- **Canonicalise.** After the user is fetched, if the incoming segment is not `userSlug(user)`,
  `redirect()` to the canonical slug **preserving the existing `?q=` / `?page=` search params** —
  losing them would break "Back to directory", which is the whole reason those params are on the URL.
  Build the target with the existing helpers, not by string-concatenating a query. `redirect` is a
  Server Component call from `next/navigation`; it throws, so it goes outside any `try`.
  Note: this makes `/users/22` a redirect rather than a 200. That is the intended trade — old links
  keep working and every link the app itself emits is already canonical.

**The hero.** `components/user/identity-hero.tsx` gains `@{user.username}` directly under the name,
above the "Job title at Company" line. `text-sm text-muted-foreground font-mono` — the username is an
identifier, and `docs/design-system.md` already assigns identifiers to the mono face. It is not a
link and not a `Badge`.

The Contact card keeps its `Username` row. It is the same fact in two places on purpose: the hero is
recognition, the card is the record. If that reads as redundant when seen in the browser, say so
rather than silently dropping one.

### 4. Card surfaces — the identity gradient

`components/user/detail-card.tsx`, and `app/users/[id]/page.tsx` to pass the hue.

The requirement is that the cards stop reading as raw white and pick up the profile's colour. The
constraint is that `AGENTS.md` confines the identity palette to identity surfaces and
`docs/design-system.md` lists exactly four of them — avatar, table rail, card rail, hero wash. A
profile card is not currently on that list.

**Resolution: extend the list by one, deliberately, and record it.** The four cards on a profile are
that one person's record and nothing else's, so tinting them is the same argument that justifies the
hero wash — it is not decoration spread onto generic chrome. What must not happen is the tint
leaking to `Card` anywhere else in the app, so:

- The gradient lives in `DetailCard`, which is used **only** on the profile. `components/ui/card.tsx`
  is not touched. (Invariant: `components/ui/*` is not edited.)
- `DetailCard` takes a `hue: IdentityHue` prop and writes `data-identity={hue}` on the `Card`, the
  same binding mechanism the hero uses. No concatenated class names.
- The fill is a **very low-intensity** linear gradient from `--identity-soft` at the top-left to the
  card's own `bg-card` — a wash, not a colour field. The card title and body text keep
  `text-card-foreground` / `text-muted-foreground`; **do not** switch any text to `--identity-ink`,
  because the six hues are only contrast-matched against `-soft`, not against a gradient.
  Use `bg-linear-to-br from-(--identity-soft) to-card` or an equivalent that keeps the class strings
  literal. Verify the exact Tailwind 4 gradient utility spelling against the `tailwind-4-docs` skill
  before writing it — `bg-linear-*` replaced v3's `bg-gradient-*` and the arbitrary-property syntax
  changed too.
- **Check dark mode.** `--identity-*-soft` in `.dark` is a dark tint (`oklch(0.29 …)`), which is
  *lighter* than `--card` (`oklch(0.215 …)`), so the same utility gives a subtle lift rather than a
  muddy patch. Confirm that by eye rather than assuming.
- The existing `ring-1 ring-foreground/10` treatment on the hero is not copied onto the cards; they
  keep the registry `Card` border.

All four cards on the page get the same hue — the person's — so the profile reads as one object.

### 5. The registry question

Answer it from the repository. Established already, to be re-verified at execution time: every UI
primitive imported anywhere in `app/` and `components/` resolves to `@/components/ui/*` (button,
card, badge, avatar, table, skeleton, empty, input, input-group, separator, pagination, tooltip,
dialog, sheet, dropdown-menu, spinner, toggle, textarea, label), and the only non-registry UI
dependencies in `package.json` are the ones the registry itself pulls in (`@base-ui/react`,
`lucide-react`, `cva`, `clsx`, `tailwind-merge`, `cmdk`, `embla`, `input-otp`, `react-day-picker`,
`recharts`, `react-resizable-panels`). Report it as a checked fact with the command used, not as a
reassurance.

## Non-goals

- **Not deleting `/design-system`.** It is the drift-catcher for the four states (`AGENTS.md` §3) and
  removing the header link is a navigation decision, not a decision to drop the route.
- **Not adding a nav bar, breadcrumb, or mobile menu.** Two nav affordances do not need a
  `NavigationMenu` or a `Sheet`; that would be overbuilding (§5.1).
- **Not changing the identity hue algorithm or adding hues.** Six, from the id, unchanged.
- **Not tinting `Card` globally, the table, the directory cards, or badges.** The gradient is
  `DetailCard` only.
- **Not making the username the route key.** The id fetches; the username decorates. Explicitly the
  user's choice.
- **Not adding a `proxy.ts`** to do the canonical redirect. The page can do it, and `AGENTS.md`
  requires a reason to add one.
- **Not touching `components/ui/*`.**

## Expected impact

- `components/chrome/site-header.tsx` — link swapped, icon added, label hidden below `sm`.
- `app/page.tsx` — header copy.
- `lib/users/search-params.ts` — `userSlug`, `parseUserSlug`, `profileHref` signature.
- `components/directory/directory-results.tsx` — two call sites.
- `app/users/[id]/page.tsx` — slug parse, canonical redirect, `hue` passed to four `DetailCard`s.
- `components/user/identity-hero.tsx` — the `@username` line.
- `components/user/detail-card.tsx` — `hue` prop, `data-identity`, gradient.
- `docs/directory.md` — the slug, the redirect, the header copy.
- `docs/design-system.md` — the profile card gradient as a fifth identity surface, and the header
  link change.
- No new dependency, no new route, no change to `lib/users/api.ts`.

## Checks

`npm run typecheck`, `npm run lint`, `npm run build` — output quoted verbatim, per `AGENTS.md` §2 and
§9 rule 3.

Browser, per §3: `/`, `/users/22`, `/users/22-elijahs`, `/users/9999`, `/?q=zzzzzz`, at 375px, 768px
and 1440px, in both themes, and with the keyboard alone. Specifically confirm the redirect lands on
the canonical slug with `?q=`/`?page=` intact, and that "Back to directory" still returns to the
right page of the right search.

Results recorded in `docs/directory.md` (routes, slug, copy) and `docs/design-system.md` (the card
gradient deviation, the header link). **Never in `AGENTS.md`.**

## SKILLS USED

- `shadcn` — the `base-nova` registry rules: `render` over `asChild`, `nativeButton={false}` on a
  `Button` that renders a `Link`, `data-icon` with no sizing class, full `Card` composition,
  `className` for layout only. Also to verify the `Button` `size` variants before relying on one.
- `tailwind-4-docs` — the v4 gradient utilities (`bg-linear-to-br`, `from-(--var)` custom-property
  syntax) and the v3 spellings that no longer exist. Required before the gradient is written.
- `design-taste-frontend` — for the directory header copy and for judging the gradient's intensity;
  it is also the source of the Color Consistency Lock that §4 above deviates from, so the deviation
  is argued against the skill rather than around it.
