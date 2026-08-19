# 22 — Fix dark mode identity-6 soft contrast in dark mode

## Scope, and why it is next

In dark mode, avatar initials badges for users assigned identity hue 6 (e.g. Logan Torres with ID 6, Mateo Nguyen with ID 12) render with a bright white/light pink background instead of blending with the dark theme background like all other identity hues.

Investigation revealed that under `.dark` in `app/globals.css`, `--identity-1-soft` through `--identity-5-soft` are declared at `oklch(0.29 0.055 H)`, but `--identity-6-soft` was omitted. Consequently, in dark mode `--identity-6-soft` falls back to the `:root` light-mode value (`oklch(0.955 0.032 12)`), causing a jarring, high-lightness circle with low contrast against light ink text.

Adding `--identity-6-soft: oklch(0.29 0.055 12);` under `.dark` restores consistent lightness, chroma, and contrast across all 6 identity hues in dark mode.

## Reference read for this

- `AGENTS.md` — semantic tokens in OKLCH, invariant that dark mode is token redeclaration without `dark:` colour utility overrides.
- `docs/design-system.md` — identity palette specification, fixed lightness and chroma invariant across all 6 hues.
- `app/globals.css` — `:root` and `.dark` token declarations for identity tokens.
- `lib/users/accent.ts` — mapping of user IDs to identity hues 1–6.

## The work

### 1. Declare `--identity-6-soft` in `.dark` in `app/globals.css`

In `app/globals.css`, under `.dark`:
- Add `--identity-6-soft: oklch(0.29 0.055 12);` right after `--identity-5-soft`.

### 2. Update documentation

- Update `docs/design-system.md` if necessary to record token completeness.

## Non-goals

- No manual `dark:` utility classes in component files.
- No changes to light mode identity tokens or hues 1–5.
- No changes to user ID accent assignment logic in `lib/users/accent.ts`.

## Expected impact

- `app/globals.css`: `.dark` includes `--identity-6-soft: oklch(0.29 0.055 12);`.
- In dark mode: Identity hue 6 avatar circles (such as Logan Torres and Mateo Nguyen) render with the expected subtle dark rose background (`0.29` lightness) and high-contrast light rose text (`0.87` lightness), perfectly blending with the background just like hues 1–5.
- In light mode: No changes; all tokens remain intact.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/` and `/design-system` in dark mode to confirm identity hue 6 avatar circles blend properly with the background.

## SKILLS USED

- `tailwind-4-docs` — token bindings and CSS variable configuration.
- `caveman-commit` — committing verified changes to `main`.
