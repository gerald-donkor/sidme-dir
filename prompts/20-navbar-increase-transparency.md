# 20 — Increase navbar transparency

**Scope.** `components/chrome/site-header.tsx` — lower the frosted navbar's background opacity so
more of the page behind it shows through while scrolled.

**Why now.** User feedback: the navbar (added in prompt 19) reads too opaque against the page
content behind it.

**Reference read.** `docs/design-system.md` for the token rule (`bg-background/<opacity>` is a
Tailwind opacity modifier on the existing `--background` token, not a new colour value).

**Change.** `bg-background/40` → `bg-background/20` on the `<header>` element. `backdrop-blur-xl`
and `backdrop-saturate-150` are unchanged — the blur is what keeps text legible at low opacity.

**Non-goals.** No change to blur radius, border, shadow, or any other chrome component. No new
token.

**Checks.** `npm run typecheck`, `npm run lint`. No `docs/` file needs updating — this is a token
opacity tweak within the invariant already recorded in `docs/design-system.md`, not a new pattern.

## SKILLS USED

None — a one-line Tailwind opacity-modifier change on an existing token needs no skill.
