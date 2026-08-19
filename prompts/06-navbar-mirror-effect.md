# 06 — Navbar mirror-like effect

## Scope, and why it is next

Implement a mirror-like reflective glass effect on the sticky navbar in `components/chrome/site-header.tsx`. The effect introduces:
1. High-refraction backdrop blur and saturation enhancement (`backdrop-blur-xl backdrop-saturate-150`).
2. Translucent surface background (`bg-background/65` in light / dark modes) allowing underlying content to refract with depth.
3. Specular top-edge light catch and surface sheen (subtle specular highlight along the top edge via an inner highlight shadow / gradient reflection line) mimicking reflective glass/mirror physical edge refraction.
4. Softened bottom boundary border (`border-b border-border/50`) for a refined glass edge.

## Reference read for this

- `AGENTS.md` — invariants: semantic tokens only (no raw hex codes, no custom non-semantic colors), no arbitrary `z-index` creep, accessibility standards.
- `docs/design-system.md` — layout primitives, chrome token definitions (`background`, `border`, `foreground`).
- `.agents/skills/design-taste-frontend/SKILL.md` — Section 5 on Liquid Glass / Glassmorphism: layered borders, highlight overlays, specular top refraction, edge physics.
- `components/chrome/site-header.tsx` — the header component.

## The work

In `components/chrome/site-header.tsx`:
- Enhance `<header>` classes to apply the mirror/glass effect:
  - Translucency: `bg-background/65`
  - Refraction / backdrop filters: `backdrop-blur-xl backdrop-saturate-150`
  - Grounded glass border: `border-b border-border/50`
  - Inset specular reflection: subtle top-edge specular highlight (`shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.2)]` or linear specular reflection overlay).
- Verify contrast and text legibility across both light and dark themes.

## Non-goals

- **Not modifying brand text or navigation links.**
- **Not introducing external animation or layout libraries.**
- **Not using arbitrary hex values or hardcoded `dark:` color overrides.**

## Expected impact

- `components/chrome/site-header.tsx` — updated with modern mirror-like glass styling.
- `docs/design-system.md` — update notes under Chrome / Layout primitives documenting the mirror glass header styling.

## Checks

Run:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Browser verification per `AGENTS.md` §3:
- Inspect header on `/`, `/users/1`, and `/design-system` while scrolling content behind the sticky header.
- Verify at 375px, 768px, and 1440px in both light and dark themes.

## SKILLS USED

- `tailwind-4-docs` — Tailwind CSS v4 backdrop filter, gradient, and alpha modifier utilities.
- `design-taste-frontend` — liquid glass and physical edge refraction guidelines.
- `frontend-design` — visual fidelity and subtle specular reflection aesthetics.
- `web-design-guidelines` — WCAG contrast and accessibility compliance.
