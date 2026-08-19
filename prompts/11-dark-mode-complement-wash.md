# 11 — Dark mode complementary wash on profile detail cards

## Scope, and why it is next

The user requested making the dark mode theme on the user profile detail cards complement the hero banner (the red circled area in `Screenshot_20260819_163426.png`).

Currently in dark mode, `--identity-N-comp-soft` was collapsed to `var(--card)`, leaving the card background flat with no ambient wash. Meanwhile, the hero banner retains an ambient `--identity-soft` wash at `oklch(0.29 0.055 <hue>)`. Activating dark-mode `--identity-N-comp-soft` at the same lightness (0.29) and chroma (0.055) at the complement hues gives the profile detail cards an ambient complementary wash in dark mode, matching the depth and pairing behavior of light mode.

## Reference read for this

- `AGENTS.md` — semantic tokens in OKLCH; dark mode redeclares the same tokens under `.dark`; no inline `dark:` color utilities.
- `docs/design-system.md` — the complement hue mapping and identity surface rules.
- `app/globals.css` — the `.dark` token declarations for `--identity-N-soft` and `--identity-N-comp-soft`.
- `components/user/detail-card.tsx` — uses `from-(--identity-comp-soft) to-card`.
- `components/user/identity-hero.tsx` — uses `from-(--identity-soft) to-transparent`.
- `app/design-system/page.tsx` — live reference tile split and fixture cards.

## The work

### 1. Declare dark mode `--identity-N-comp-soft` tokens

In `app/globals.css`:
Update `--identity-1-comp-soft` … `--identity-6-comp-soft` in `.dark` from `var(--card)` to the corresponding OKLCH complement values at lightness `0.29` and chroma `0.055`:

- Hue 1 (violet, 277) → complement 97 (olive-gold): `oklch(0.29 0.055 97)`
- Hue 2 (blue, 240) → complement 60 (amber): `oklch(0.29 0.055 60)`
- Hue 3 (cyan, 205) → complement 25 (terracotta): `oklch(0.29 0.055 25)`
- Hue 4 (teal, 168) → complement 348 (rose): `oklch(0.29 0.055 348)`
- Hue 5 (amber, 70) → complement 250 (blue): `oklch(0.29 0.055 250)`
- Hue 6 (rose, 12) → complement 192 (cyan): `oklch(0.29 0.055 192)`

### 2. Update documentation and design system page

- `docs/design-system.md` — update the explanation of dark mode complement handling.
- `app/design-system/page.tsx` — update the identity palette description to reflect dark mode complement wash support.
- `components/user/detail-card.tsx` — update docstring to reflect dark mode complement wash behavior.

## Non-goals

- No change to light mode token values.
- No changes to card markup or introduction of `dark:` classes (all styling continues to derive purely from CSS variable re-declaration in `globals.css`).

## Expected impact

- `app/globals.css`: 6 updated token values under `.dark`.
- `docs/design-system.md`: Updated dark mode complement documentation.
- `app/design-system/page.tsx`: Updated description text.
- `components/user/detail-card.tsx`: Updated comment/docstring.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/users/8`, `/users/1`, and `/design-system` in dark mode.

## SKILLS USED

- `tailwind-4-docs` — token bindings and OKLCH color rules.
- `design-taste-frontend` — dark theme contrast and complementary pairing fidelity.
- `caveman-commit` — committing verified changes to `main`.
