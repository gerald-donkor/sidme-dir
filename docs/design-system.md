# Design system

Everything here is defined in **`app/globals.css`** and nowhere else. This file is the reasoning;
that file is the source of truth. `/design-system` renders the result, and it renders the real
components rather than mock-ups of them, so a token change is judged against what actually ships.

## The direction

**Quiet chrome, colourful data.**

A directory is a tool people look things up in. The furniture — header, cards, table, controls —
stays a calm near-neutral so it does not compete with what the reader came for. Colour is spent in
one place only: telling one person apart from another. That is how the app gets to be colourful
without being noisy, and it is why the palette below is split in two.

## Chrome

Semantic tokens, in OKLCH, paired with their `-foreground` where text sits on them. Components name
a role — `bg-primary`, `text-muted-foreground` — never a value.

| token | light | notes |
| --- | --- | --- |
| `background` | `oklch(0.99 0.004 265)` | a cool near-white, not `#fff` |
| `foreground` | `oklch(0.21 0.025 265)` | a cool near-black, not `#000` |
| `card` | `oklch(1 0 0)` | the one pure white, so cards lift off the ground |
| `primary` | `oklch(0.55 0.21 277)` | indigo-violet. The **only** accent on interactive chrome |
| `muted` / `secondary` | `oklch(0.965 0.008 265)` | the same value at two roles, deliberately |
| `destructive` | `oklch(0.58 0.22 25)` | error states only |
| `border` / `input` | `oklch(0.915 0.008 265)` | |
| `ring` | `= primary` | focus is always the accent |

Dark mode re-declares every one of these under `.dark`. **There is not a single `dark:` colour
utility in the app.** The two `dark:` utilities that do exist are in `ThemeToggle`, and they switch
which *icon* is visible, not what colour anything is.

`--radius: 0.75rem`, with the registry's `calc()` ladder above it (`sm` 0.45rem → `4xl` 1.95rem).
One scale, soft throughout.

## Identity palette

Six hues at a **fixed lightness and chroma** — only the hue rotates:

```
--identity-1  violet 277    --identity-4  teal  168
--identity-2  blue   240    --identity-5  amber  70
--identity-3  cyan   205    --identity-6  rose   12
```

Each has a `-soft` tint (for fills) and an `-ink` pair (for text on that tint). Fixing L and C is the
whole point: every person's colour carries identical contrast, so no one is harder to read than
anyone else because of which hue they drew.

**A person's hue comes from their id**, in `lib/users/accent.ts` — `((id - 1) % 6) + 1`. It is not
chosen and it never changes, so the same person is the same colour on their card, in their table
row, and on their profile. Recognition, not decoration.

### How it binds, and why it is not a class name

A component writes `data-identity="1".."6"` and `app/globals.css` binds that attribute to three
locals for the subtree:

```css
[data-identity="3"] {
  --identity: var(--identity-3);
  --identity-soft: var(--identity-3-soft);
  --identity-ink: var(--identity-3-ink);
  --identity-comp-soft: var(--identity-3-comp-soft);
}
```

Consumers then read `bg-(--identity)`, `bg-(--identity-soft)`, `text-(--identity-ink)`,
`bg-(--identity-comp-soft)`. The
indirection is deliberate: the obvious alternative, `` className={`bg-identity-${hue}`} ``, produces
a class name Tailwind's scanner cannot see, so the utility is never generated and the colour
silently does not apply. Every class here is a literal string in the source.

### The deviation, on the record

`design-taste-frontend` states a Color Consistency Lock: one accent for the whole page. **This
breaks that rule on purpose**, and the exception is narrow:

- The identity hues appear **only** on identity surfaces — the directory card's top rail, the avatar's
  fill and ring, the table row's leading rail, the profile hero's wash, and the profile detail card's
  surface (`bg-linear-to-br from-(--identity-comp-soft) to-card to-60%`).
- Every other coloured affordance — buttons, links, focus rings, badges — uses `primary`.
- Departments and roles use `Badge` variants, **not** identity colour, even though it would be easy.
  A department is not an identity.

Do not extend the palette past those five surfaces, and do not "fix" it back to one hue.

### The complement, and why it is not a seventh accent

The detail cards on a profile take the **complement** of the person's hue, not the hue itself. The
hero carries the person; the cards below carry their record, and wearing the same hue made the two
read as one repeated mark. The complement makes them a pair.

| hue | hero | complement | card wash |
| --- | --- | --- | --- |
| 1 | violet, 277 | 97 | olive-gold |
| 2 | blue, 240 | 60 | amber |
| 3 | cyan, 205 | 25 | terracotta |
| 4 | teal, 168 | 348 | rose |
| 5 | amber, 70 | 250 | blue |
| 6 | rose, 12 | 192 | cyan |

`--identity-N-comp-soft` reuses the **same lightness and chroma** as `--identity-N-soft` and rotates
only the hue: `oklch(0.955 0.032 H)`. Because L in OKLCH is perceptual lightness, a hue rotation at
fixed L and C changes the hue and nothing else — the card's text contrast is identical to the wash it
replaced, and the six complements stay matched to each other exactly as the six hues are. No new
contrast claim is made, and none needed measuring.

**This is a light-mode treatment only.** Under `.dark`, all six `--identity-N-comp-soft` resolve to
`var(--card)`, which collapses the gradient to a flat card surface. Dark mode already separates the
cards from the page by elevation, and a tinted card there competed with the hero instead of
answering it. The decision lives in `app/globals.css` as a token redeclaration rather than a `dark:`
class in the component, so the invariant holds: dark mode is the same tokens redeclared, and
`detail-card.tsx` carries one literal class string that is correct in both themes.

This is not a widening of the deviation above:

- The complement is **derived** from the person's hue, not chosen, so it is still data.
- It appears on **one surface**, that person's detail cards, and never on chrome, buttons or badges.
- Only `-comp-soft` exists. There is deliberately no `--identity-comp` at full strength and no
  `-comp-ink`, because nothing renders them, and a token with no consumer drifts. Card text stays
  `text-card-foreground` / `text-muted-foreground`.

`/design-system` shows each hue facing its complement in one split tile, and two `DetailCard`s at
different hues, so a wash that stops tracking the person is visible there before it ships.

## Type

| role | face | why |
| --- | --- | --- |
| display / headings | **Outfit** | geometric and friendly; carries the page titles and every `CardTitle` (`--font-heading` points at it, so the registry picks it up without a component edit) |
| body and UI | **Geist** | already in the scaffold, and it is a good UI face |
| figures | **Geist Mono** | phone numbers, ids, measurements. Set with `.tabular` so digits line up down a column |

All three load through `next/font`. There is no Google Fonts `<link>` anywhere.

Hierarchy is carried by **weight and colour before size** — a page title is `text-3xl/4xl`, a card
title is `text-base font-medium`, and most of the separation between them is `text-muted-foreground`
doing its job.

## Layout primitives

`components/chrome/` — small, and only what is used twice:

- `Container` — `mx-auto w-full px-4 sm:px-6 lg:px-8`, `max-w-7xl` (or `narrow` at `max-w-3xl`).
- `PageHeader` / `PageHeaderText` / `PageTitle` / `PageDescription` — the header both pages share.
- `SiteHeader` — rendered by `app/layout.tsx`, so `loading.tsx`, `error.tsx` and `not-found.tsx`
  all get the chrome. Renders the brand wordmark ("Sidme") and a clean text "Home" nav button
  over a mirror-like reflective glass surface (`backdrop-blur-xl backdrop-saturate-150 bg-background/65`
  with a subtle top specular edge highlight and softened bottom border).
  The `/design-system` route remains active and reachable directly.
- `ThemeToggle` — the theme switch, and one of only two client components in the app.

## Rules that bind every component

Taken from the `shadcn` skill and enforced by review, not by tooling:

1. Semantic tokens only. No raw colour, no `bg-blue-500`.
2. `className` carries layout. It does not restyle a primitive's colour or typography.
3. `gap-*`, never `space-x/y-*`. `size-*` when width equals height. `truncate` over manual clamps.
4. Full `Card` composition — `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` /
   `CardFooter`. Not everything dumped in `CardContent`.
5. `Avatar` always has an `AvatarFallback`. `Empty` for empty states. `Skeleton` for loading — never
   a hand-rolled `animate-pulse` div.
6. Icons come from `lucide-react` and carry `data-icon="inline-start"` / `"inline-end"` inside a
   `Button`, with **no** sizing class; the component sizes them.
7. **`components/ui/*` is not edited.** It is regenerable. Where a registry component is wrong for
   this app, the app stops using it and says why — see `docs/directory.md` on pagination.
