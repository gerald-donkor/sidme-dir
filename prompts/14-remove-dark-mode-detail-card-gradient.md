# 14 — Remove dark mode detail card background color gradient

## Scope, and why it is next

The user requested removing the color gradient from the background of the profile section cards ("Contact", "Company", "Location", "Personal") in dark mode, while keeping the top accent strips.

In keeping with project invariants ("No manual dark: colour or typography overrides — dark mode is the same tokens redeclared under `.dark`"), `DetailCard` continues to use `bg-linear-to-br from-(--identity-comp-soft) to-card to-60%` and `bg-(--identity-comp)` for the top rail. In `app/globals.css`, under `.dark`, `--identity-1-comp-soft` through `--identity-6-comp-soft` are mapped to `var(--card)`. In dark mode, the gradient evaluates from `--card` to `--card` (rendering a flat, solid dark card background with no color gradient), while in light mode, the complement gradient wash (`from-(--identity-comp-soft)`) remains preserved.

## Reference read for this

- `AGENTS.md` — semantic tokens in OKLCH, invariant that dark mode is token redeclaration without `dark:` color utility overrides in presentation components.
- `docs/design-system.md` — identity palette specification, card styling, and dark mode token mappings.
- `app/globals.css` — `:root` and `.dark` token declarations for identity complement soft tokens.
- `components/user/detail-card.tsx` — detail card component consuming `--identity-comp-soft` and `--identity-comp`.
- `app/design-system/page.tsx` — design system reference page.

## The work

### 1. Update dark mode identity complement soft tokens in `app/globals.css`

In `app/globals.css`:
- In `.dark`, set `--identity-1-comp-soft` through `--identity-6-comp-soft` to `var(--card)`.
- Ensure `--identity-1-comp` through `--identity-6-comp` remain mapped to `var(--identity-N)` to keep the top strip colored.
- In `:root`, retain the light mode soft complement tokens (`oklch(0.955 0.032 ...)`) for light mode.

### 2. Update documentation

- `docs/design-system.md` — document that in dark mode, `--identity-comp-soft` resolves to `var(--card)` to eliminate the background color gradient on detail cards while retaining the colored top rail strip.

## Non-goals

- No `dark:` color utility classes in `components/user/detail-card.tsx` or any presentation component.
- No changes to the hero card background wash or the directory cards.
- No changes to light mode card background gradients.
- No removal of the colored top rail strip on detail cards.

## Expected impact

- `app/globals.css`: In `.dark`, `--identity-N-comp-soft` maps to `var(--card)`.
- In light mode: Detail cards retain their soft complement gradient background and top rail.
- In dark mode: Detail cards have a solid card background without a color gradient, while retaining their colored top rail strip.
- `docs/design-system.md`: Updated build record.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/users/4-jamesd` and `/users/1` in dark mode to confirm background color gradient is removed from the detail cards while the top strips remain, and in light mode to confirm complement wash persists.

## SKILLS USED

- `tailwind-4-docs` — token bindings and CSS variable propagation.
- `caveman-commit` — committing verified changes to `main`.
