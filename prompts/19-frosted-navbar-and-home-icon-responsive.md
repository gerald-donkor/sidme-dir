# 19 — Frosted mirror transparent navbar and responsive Home icon

## Scope and why it is next

The user requested two specific enhancements to the site navigation bar:
1. **Frosted mirror transparent navbar UI**: Enhance `<header>` styling in `components/chrome/site-header.tsx` to give it a refined frosted mirror glass aesthetic with high translucency, refraction blur, and specular reflection highlights while maintaining contrast and token consistency across light and dark modes.
2. **Remove Home icon on larger screens**: In `components/chrome/site-header.tsx`, hide the `HouseIcon` on larger screens (`sm:` and above) so that desktop viewports display clean text navigation ("Home") without the redundant house icon, while smaller screens (`<sm`) retain the compact icon-only representation with proper accessible labeling.

## Reference material read for this

- `AGENTS.md` — invariants: semantic tokens only (no raw hex codes, no custom non-semantic colors), icon rules (`lucide-react`, `data-icon` conventions, no sizing classes), Base UI composition, dark mode token consistency.
- `docs/design-system.md` — Layout primitives (`SiteHeader`), chrome tokens (`background`, `border`, `foreground`), visual direction.
- `docs/skills.md` — Skills map and rules.
- `.agents/skills/design-taste-frontend/SKILL.md` — Section 5 on Liquid Glass / Glassmorphism: layered borders, backdrop refraction, specular highlight overlays.
- `components/chrome/site-header.tsx` — current header implementation.
- `components/ui/button.tsx` — button styling and padding mechanics with icons and slots.
- `Screenshot_20260819_173651.png` — user's provided screenshot highlighting the home icon on desktop.

## The changes

In `components/chrome/site-header.tsx`:
1. **Frosted mirror transparency on `<header>`**:
   - Refine background translucency: `bg-background/40` (supporting backdrop blur) paired with `backdrop-blur-xl backdrop-saturate-150` for high-refraction glassmorphic depth.
   - Glass edge boundary: `border-b border-border/40`.
   - Specular top-edge mirror reflection: `shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.15)]` giving a subtle physical glass edge catch.
2. **Responsive Home button icon visibility**:
   - Add `className="sm:hidden"` to `HouseIcon` inside the Home navigation button.
   - On viewports `< sm` (mobile), the icon is visible and the text is hidden (`<span className="hidden sm:inline">Home</span>`), keeping the mobile header uncrowded.
   - On viewports `>= sm` (tablet/desktop), `HouseIcon` is hidden (`sm:hidden`) and `Home` text is shown, fulfilling the user's request to remove the icon on larger screens.
   - Ensure symmetric button padding on `sm:` screens by adding `sm:px-2.5` to the Button container.

## Expected impact

- `components/chrome/site-header.tsx`: Updated with frosted mirror transparent glass styling and responsive icon-to-text Home navigation.
- `docs/design-system.md`: Updated under Layout Primitives (`SiteHeader`) to document the frosted mirror transparency and responsive Home button behavior.

## Non-goals, and why

- **Not modifying brand wordmark ("Sidme") or theme toggle functionality.**
- **Not introducing non-tokenized raw color values or arbitrary z-index increases.**
- **Not editing `components/ui/button.tsx` directly**, composing behavior via standard layout utilities in `site-header.tsx` per §6 invariants.

## SKILLS USED

- `shadcn` — composing `Button` and `Container` in `components/chrome/site-header.tsx`.
- `tailwind-design-system` — Tailwind CSS v4 backdrop filter, alpha modifier, and responsive utility application.
- `frontend-design` — refined glassmorphism and mirror reflection aesthetics.
- `design-taste-frontend` — liquid glass and physical edge refraction guidelines.
- `web-design-guidelines` — ensuring WCAG AA contrast and accessible button labeling across viewports.
- `caveman-commit` — commit message formatting upon execution completion.

## Checks and where the result is recorded

Run:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Browser verification per `AGENTS.md` §3:
- Inspect header on `/`, `/users/1`, and `/design-system` at 375px, 768px, and 1440px in both light and dark themes.
- Confirm scrolled content behind header shows frosted mirror blur and saturation.
- Confirm Home button shows icon on mobile (<640px) and clean text "Home" without icon on desktop (>=640px).

Recorded in **`docs/design-system.md`**.
