# 04 — The profile detail cards take the complement of the person's hue

## Scope, and why it is next

One change, on one surface. The four `DetailCard`s on `/users/[id]` currently carry the person's own
identity hue, the same one already on the hero above them and on their card in the list. The user's
note: the cards should be **a different colour that still complements the page** — the way black
complements white, or red complements yellow.

Chosen resolution, confirmed with the user: **the cards take the OKLCH complement of the person's
identity hue.** A teal hero pairs with a rose card wash, a violet hero with olive-gold. Still
deterministic from the id, still one pairing per person, so the profile reads as one object with two
registers rather than two unrelated colours.

| identity hue | hero | complement | card wash |
| --- | --- | --- | --- |
| 1 | violet, 277 | 97 | olive-gold |
| 2 | blue, 240 | 60 | amber |
| 3 | cyan, 205 | 25 | terracotta |
| 4 | teal, 168 | 348 | rose |
| 5 | amber, 70 | 250 | blue |
| 6 | rose, 12 | 192 | cyan |

Rejected: a single fixed card colour for everyone. Whatever hue was picked would sit next to six
different hero hues, and would clash with at least one of them.

## Reference read for this

- `AGENTS.md` — the identity palette is data and is confined to identity surfaces; tokens only, never
  a raw value; `app/globals.css` is the only place a token is defined; `components/ui/*` is not edited.
- `docs/design-system.md:76-88` — the recorded deviation from `design-taste-frontend`'s Color
  Consistency Lock, and the list of identity surfaces it currently permits (five, including the
  detail card's top rail).
- `docs/design-system.md:60-74` — the `data-identity` → `--identity` / `--identity-soft` /
  `--identity-ink` binding, and the recorded reason a concatenated class name cannot work here.
- `app/globals.css:92-113` — the light identity tokens; `:158-178` — the dark ones; `:196-232` —
  the six `[data-identity="n"]` binding rules.
- `components/user/detail-card.tsx`, `components/user/identity-hero.tsx`,
  `app/users/[id]/page.tsx`, `app/design-system/page.tsx`, `lib/users/accent.ts`.
- Installed Tailwind is **4.3.3** (`node_modules/tailwindcss/package.json`), where the gradient
  utility is `bg-linear-to-*` and the custom-property value form is `from-(--var)`. Both verified
  against `node_modules/tailwindcss/dist/lib.js` and the `tailwind-4-docs` skill's `gotchas.md`.
  Note the skill's docs snapshot is **not initialised** in this checkout; re-verify the same way, or
  run `scripts/sync_tailwind_docs.py --accept-docs-license` first.

## The work

### 1. Six complement tokens, light and dark

`app/globals.css`. Add `--identity-1-comp-soft` … `--identity-6-comp-soft` immediately after the
existing `-soft` block, in **both** `:root` and `.dark`.

**They reuse the existing `-soft` lightness and chroma exactly, and rotate only the hue:**

- light: `oklch(0.955 0.032 <complement>)` — the same L and C as `--identity-N-soft`
- dark: `oklch(0.29 0.055 <complement>)` — likewise

That is the whole reason this is safe. L in OKLCH is perceptual lightness, so a hue rotation at fixed
L and C changes the hue and nothing else: the card's text contrast is *identical* to what the
existing wash already ships, and the six complements stay contrast-matched to each other the same way
the six hues are. No new contrast claim is being made and none needs measuring.

Comment the block the way the existing one is commented, and say what it is for — the complement of
the person's hue, for the profile's detail cards, and nothing else yet.

**Do not add `--identity-comp` (full strength) or `--identity-comp-ink`.** Nothing renders them.
A token with no consumer is a token that drifts.

### 2. Bind it

The same `app/globals.css` `@layer base` block that already maps `[data-identity="n"]`. Each of the
six rules gains one line:

```css
--identity-comp-soft: var(--identity-N-comp-soft);
```

This is the point of the whole indirection: **`DetailCard` needs no new prop and
`lib/users/accent.ts` does not change.** The card already writes `data-identity={hue}`; it simply
reads a different local from the subtree.

### 3. The card surface

`components/user/detail-card.tsx`. The `Card` keeps `data-identity={hue}` and its `hue: IdentityHue`
prop unchanged. Replace the current top rail with a wash in the complement:

```
bg-linear-to-br from-(--identity-comp-soft) to-card to-60%
```

Two judgement calls, both stated so they can be rejected at approval:

- **The rail goes, the wash arrives.** The request is a *colour theme for the cards*, which is a
  surface, not a hairline. The rail also repeats the directory card's own top-rail treatment, so a
  profile card and a list card wear the same mark for different jobs. One mark per surface.
- **This supersedes the uncommitted gradient edit currently sitting in `detail-card.tsx`.** That edit
  used `--identity-soft`; this replaces the token with the complement. Nothing else in that
  uncommitted diff belongs to this prompt — the `site-header.tsx` and `app/users/[id]/page.tsx`
  changes in the working tree are prompt 03's business and are left exactly as they are.

Text stays `text-card-foreground` / `text-muted-foreground`. **Do not** reach for an ink token: no
`-comp-ink` exists, and inventing one to colour text would be a contrast claim this prompt has not
earned.

### 4. Show the pairing where drift gets caught

`app/design-system/page.tsx` renders one `DetailCard` fixture already. Extend the identity section so
the **pairing** is visible, not just one card: the six hues beside their six complements, and at
least two `DetailCard`s at different hues so a reviewer can see that the wash tracks the person.
`/design-system` is the drift-catcher (`AGENTS.md` §3); a pairing that only exists on live profiles
is a pairing nobody checks.

### 5. Record it

`docs/design-system.md`. The deviation section currently lists five identity surfaces and names the
detail card's rail with its exact class string. Update it to say:

- the detail card's surface is now a **complement** wash, with the class string as shipped
- the pairing table from the top of this file
- **why the complement is not a seventh accent**: it is derived from the person's hue, appears only
  on that person's profile, and is never used on chrome. The Color Consistency Lock deviation
  already recorded does not widen; it gains a second register on the same surface family.

`docs/directory.md` needs no change — nothing about routes, URL state or the four states moves.

## Non-goals

- **Not touching the hero, the avatar, the table's leading rail, or the directory card's rail.** They
  keep the person's own hue. The complement is the detail-card surface and nothing else.
- **Not changing `lib/users/accent.ts`**, the hue algorithm, or `IdentityHue`. Six hues, from the id,
  unchanged — the complement is derived in CSS from the same `data-identity`.
- **Not adding complements to `--chart-*`.** Charts reuse the identity hues by design.
- **Not adding `--identity-comp` or `--identity-comp-ink`** until a surface needs them.
- **Not touching `components/ui/card.tsx`** or anything else in the registry.
- **Not re-litigating prompt 03.** The header, the slug route, the copy and the `@username` line are
  done; the uncommitted 03 edits in the tree stay untouched by this change.

## Expected impact

- `app/globals.css` — twelve new token declarations (six light, six dark), six new binding lines.
- `components/user/detail-card.tsx` — rail removed, complement wash added. No prop change, no type change.
- `app/design-system/page.tsx` — the pairing made visible.
- `docs/design-system.md` — the surface list, the pairing table, the reasoning.
- No change to `lib/`, no change to any route, no new dependency, no TypeScript change anywhere.

## Checks

`npm run typecheck`, `npm run lint`, `npm run build` — output quoted verbatim, per `AGENTS.md` §2 and
§9 rule 3.

Browser, per §3: `/users/22` (hue 4, so a rose wash under a teal hero) and at least one profile at a
different hue — `/users/1` is hue 1, violet hero and olive-gold cards — plus `/design-system`, at
375px, 768px and 1440px, in both themes. Confirm specifically:

- the wash reads as a *different* colour from the hero without fighting it
- in dark mode the complement lifts off `--card` rather than muddying it, the same way the current
  wash does (`-soft` L 0.29 against `--card` L 0.215)
- card title and body text are unchanged and still legible on the wash at every one of the six hues

Results recorded in `docs/design-system.md`. **Never in `AGENTS.md`.**

## SKILLS USED

- `tailwind-4-docs` — the v4 gradient spelling (`bg-linear-to-br`) and the `from-(--var)`
  custom-property value syntax, plus the v3 forms that no longer exist. The docs snapshot is not
  initialised in this checkout, so verification falls back to `node_modules/tailwindcss` and the
  skill's `gotchas.md`; say so rather than claiming the docs were read.
- `shadcn` — `className` carries layout and this one surface token, never typography; full `Card`
  composition; `components/ui/*` stays unedited; the wash is applied by composing the registry
  `Card`, not by forking it.
- `design-taste-frontend` — the Color Consistency Lock this deviates from, so the deviation is
  argued against the skill rather than around it, and the judgement on wash intensity (a wash, not a
  colour field).
