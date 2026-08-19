# 12 — Match detail card strips and wash to hero banner identity color

## Scope, and why it is next

The user provided a screenshot (`Screenshot_20260819_163426.png`) with the profile hero banner circled, and requested making the top strips on the detail cards the same color variant as the circled hero banner.

Currently, `DetailCard` uses `--identity-comp` (the 180° rotated complement hue) for its top strip and `--identity-comp-soft` for its ambient wash. On Olivia Wilson's profile (hue 6: rose), this rendered cyan top strips beneath the rose hero banner.

Switching `DetailCard`'s top rail to `--identity` and its ambient wash to `--identity-soft` aligns the profile cards directly with the hero banner's identity color variant across all 6 identity hues in both light and dark mode.

## Reference read for this

- `AGENTS.md` — semantic tokens in OKLCH; identity token bindings via `data-identity`.
- `docs/design-system.md` — identity palette specification, card top rails, and wash behavior.
- `components/user/detail-card.tsx` — the detail card component with top strip and gradient wash.
- `components/user/identity-hero.tsx` — the hero banner using `--identity` and `--identity-soft`.
- `components/directory/user-card.tsx` — directory card top rail using `--identity`.
- `app/design-system/page.tsx` — design system reference page showing identity tiles and sample cards.

## The work

### 1. Update `DetailCard` styling

In `components/user/detail-card.tsx`:
- Change the top rail strip from `bg-(--identity-comp)` to `bg-(--identity)`.
- Change the gradient background wash from `from-(--identity-comp-soft)` to `from-(--identity-soft)`.
- Update docstrings to reflect that detail cards share the person's primary identity hue and soft wash with the hero banner.

### 2. Update documentation and design system page

- `docs/design-system.md` — update the identity palette and card styling sections to record that detail cards match the hero's identity hue and soft wash.
- `app/design-system/page.tsx` — update the identity palette swatch tile and description to reflect the unified identity hue across cards and hero.

## Non-goals

- No change to the 6 primary identity hue definitions or their OKLCH values.
- No change to the directory card rails or table indicator rails (which already use `--identity`).
- No addition of manual `dark:` color overrides in components.

## Expected impact

- `components/user/detail-card.tsx`: Top rail uses `bg-(--identity)`, wash uses `from-(--identity-soft)`.
- `docs/design-system.md`: Documentation updated.
- `app/design-system/page.tsx`: Updated swatch and description.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/users/8`, `/users/1`, and `/design-system` in both light and dark modes.

## SKILLS USED

- `tailwind-4-docs` — token bindings and OKLCH color rules.
- `design-taste-frontend` — cohesive palette hierarchy and contrast verification.
- `caveman-commit` — committing verified changes to `main`.
