# 10 — Complementary color strips on profile detail cards

## Scope, and why it is next

The user requested adding complementary color strips along the top edges of the profile detail cards (`Contact`, `Company`, `Location`, `Personal` on `/users/[id]`), as illustrated in their screenshot (`Screenshot_20260819_162002.png`).

The detail cards already have a subtle complementary background wash (`--identity-comp-soft`). Adding full-strength complementary top rails (`--identity-comp`) gives the cards a crisp accent along their top edge that matches the directory cards' top rails while preserving the complement relationship with the profile hero.

## Reference read for this

- `AGENTS.md` — semantic tokens only; identity palette is data assigned deterministically from user ID; `app/globals.css` is the sole place tokens and bindings are defined; `components/ui/*` remains unedited.
- `docs/design-system.md` — the complement hue mapping table and identity surface definitions.
- `components/user/detail-card.tsx` — the `DetailCard` component rendering profile fact groups.
- `components/directory/user-card.tsx` — the top rail reference implementation (`absolute inset-x-0 top-0 h-1 bg-(--identity)`).
- `app/globals.css` — the `:root`, `.dark`, and `[data-identity="1".."6"]` token bindings.
- `app/design-system/page.tsx` — the live token reference and drift-catcher.

## The work

### 1. Define full-strength complement tokens

In `app/globals.css`:
Add `--identity-1-comp` … `--identity-6-comp` in both `:root` and `.dark`, using the exact same lightness and chroma as the primary `--identity-N` tokens at each complement hue:

- Light (`:root`): `oklch(0.55 0.18 <complement-hue>)`
  - Hue 1 (violet, 277) → complement 97 (olive-gold)
  - Hue 2 (blue, 240) → complement 60 (amber)
  - Hue 3 (cyan, 205) → complement 25 (terracotta)
  - Hue 4 (teal, 168) → complement 348 (rose)
  - Hue 5 (amber, 70) → complement 250 (blue)
  - Hue 6 (rose, 12) → complement 192 (cyan)
- Dark (`.dark`): `oklch(0.72 0.15 <complement-hue>)`

### 2. Bind `--identity-comp` in `@layer base`

In `app/globals.css`, add `--identity-comp: var(--identity-N-comp);` to each `[data-identity="1"]` … `[data-identity="6"]` rule block.

### 3. Add top strip in `DetailCard`

In `components/user/detail-card.tsx`:
Add `relative` to the `Card` className and insert the complementary strip:
```tsx
<span
  aria-hidden
  className="absolute inset-x-0 top-0 h-1 bg-(--identity-comp)"
/>
```
Because `Card` has `overflow-hidden rounded-xl`, the top edge strip curves with the card's top corners cleanly.

### 4. Update documentation & design system reference

- `docs/design-system.md` — document `--identity-comp` and the complementary top rail on profile detail cards.
- `app/design-system/page.tsx` — ensure the design system reference reflects the updated tokens and detail card presentation.

## Non-goals

- Not modifying `lib/users/accent.ts` or user ID mapping logic (the hue rotation remains derived in CSS via `data-identity`).
- Not altering the directory card's rail (which uses primary identity hue `--identity`).
- Not editing `components/ui/card.tsx`.

## Expected impact

- `app/globals.css`: Twelve new token definitions (6 light, 6 dark) and 6 binding lines.
- `components/user/detail-card.tsx`: Added `relative` and top rail `<span />`.
- `docs/design-system.md`: Updated token list and identity surfaces description.
- `app/design-system/page.tsx`: Updated if needed to reflect token additions.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/users/8-avat`, `/users/1`, and `/design-system` in both light and dark modes across mobile (375px), tablet (768px), and desktop (1440px).

## SKILLS USED

- `tailwind-4-docs` — Tailwind CSS v4 custom property utility binding syntax (`bg-(--identity-comp)`).
- `shadcn` — composing shadcn `Card` without modifying installed primitives.
- `design-taste-frontend` — ensuring color consistency, contrast fidelity, and alignment with the established complementary palette system.
- `caveman-commit` — committing verified changes to `main`.
