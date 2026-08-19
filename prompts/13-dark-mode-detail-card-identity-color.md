# 13 — Dark mode detail card strips and wash matching hero identity color

## Scope, and why it is next

The user clarified that matching the detail card top strips (and ambient wash) to the hero banner's identity color was intended specifically for **dark mode**. In light mode, the complement relationship (`--identity-comp` / `--identity-comp-soft`) remains active.

In keeping with the project invariants ("No manual dark: colour or typography overrides — dark mode is the same tokens redeclared under `.dark`"), `DetailCard` continues to use `bg-(--identity-comp)` and `from-(--identity-comp-soft)`. In `app/globals.css`, under `.dark`, `--identity-N-comp` and `--identity-N-comp-soft` are mapped to the primary identity tokens (`--identity-N` and `--identity-N-soft`), resolving to the hero banner's color variant in dark mode while preserving the 180° rotated complement in light mode.

## Reference read for this

- `AGENTS.md` — semantic tokens in OKLCH, invariant that dark mode is token redeclaration without `dark:` color utility overrides in presentation components.
- `docs/design-system.md` — identity palette specification, card styling, and dark mode token mappings.
- `app/globals.css` — `:root` and `.dark` token declarations for identity and complement palettes.
- `components/user/detail-card.tsx` — detail card component consuming `--identity-comp` and `--identity-comp-soft`.
- `app/design-system/page.tsx` — design system reference page showing swatches and sample cards.

## The work

### 1. Revert `DetailCard` to semantic complement token bindings

In `components/user/detail-card.tsx`:
- Restore `bg-(--identity-comp)` for the top rail strip.
- Restore `from-(--identity-comp-soft)` for the background gradient wash.
- Ensure no `dark:` classes are added, adhering to project invariants.

### 2. Configure dark mode identity complement tokens in `app/globals.css`

In `app/globals.css`:
- In `.dark`, declare `--identity-N-comp: var(--identity-N)` and `--identity-N-comp-soft: var(--identity-N-soft)` so that in dark mode, the detail card top strip and ambient wash seamlessly match the hero banner.
- In `:root`, retain the 180° rotated complement hues for light mode.

### 3. Update documentation and design system reference

- `docs/design-system.md` — document that in light mode, detail cards carry the complement hue, while in dark mode, `--identity-comp` and `--identity-comp-soft` align with the primary identity hue for dark-mode harmony with the hero banner.
- `app/design-system/page.tsx` — update the identity palette section and swatch display to accurately demonstrate the light mode complement and dark mode behavior.

## Non-goals

- No `dark:` color classes in `DetailCard` or any other presentation component.
- No changes to directory cards, table indicator rails, or hero banners.
- No change to light mode identity primary or complement hues.

## Expected impact

- `components/user/detail-card.tsx`: Uses `bg-(--identity-comp)` and `from-(--identity-comp-soft)`.
- `app/globals.css`: In `.dark`, `--identity-N-comp` and `--identity-comp-soft` match primary identity tokens.
- In light mode: Detail card top strip and wash use complement color.
- In dark mode: Detail card top strip and wash match hero banner identity color.
- `docs/design-system.md` & `app/design-system/page.tsx`: Updated build record and reference.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/users/8` (Olivia Wilson), `/users/1`, and `/design-system` in both light mode (complement strips/wash) and dark mode (hero identity strips/wash).

## SKILLS USED

- `tailwind-4-docs` — token bindings and OKLCH color rules.
- `design-taste-frontend` — cohesive palette hierarchy and contrast verification.
- `caveman-commit` — committing verified changes to `main`.
