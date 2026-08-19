# 21 — Make navbar fully transparent

**Scope.** `components/chrome/site-header.tsx` — drop the navbar's background tint entirely.

**Why now.** Follow-up to prompt 20: user wants the navbar transparent, not just lower-opacity.

**Reference read.** `docs/design-system.md` for the token rule this stays within — `bg-transparent`
is a built-in Tailwind utility, not a raw colour value, so it does not violate the tokens-only
styling invariant.

**Change.** `bg-background/20` → `bg-transparent` on the `<header>` element. `backdrop-blur-xl` and
`backdrop-saturate-150` stay — without them, scrolled text underneath the nav becomes illegible.

**Non-goals.** No change to blur, border, shadow, or any other chrome component.

**Checks.** `npm run typecheck`, `npm run lint`. No `docs/` update needed — same token pattern as
prompt 20, just the transparent case of it.

## SKILLS USED

None — a one-line Tailwind background-utility change needs no skill.
