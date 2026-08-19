# 04 — Profile detail cards background styling and complement

## Scope, and why it is next

Refine the background styling of the four detail cards (`DetailCard` — Contact, Company, Location, Personal) on the user profile page (`/users/[id]`).

Currently, `DetailCard` uses an asymmetric gradient (`bg-linear-to-br from-(--identity-soft) to-card`) that fades out to pure `card` white, causing the cards to visually bleed into the page background on one side while duplicating the hero's cyan top-wash on the other. The user requested making the cards' background color distinctly different from the details page canvas while ensuring it cleanly complements the page and hero.

The task is to refine `DetailCard` to have a distinct, elegant background surface that:
1. Clearly separates the card surfaces from the page canvas (`bg-background`).
2. Complements the user's deterministic identity hue and the `IdentityHero` without visual noise or excessive saturation.
3. Maintains full WCAG AA contrast for all labels (`text-muted-foreground`) and values (`text-card-foreground` / `font-mono`).
4. Retains flawless light and dark mode consistency purely through tokens and CSS variables, with zero raw color values or `dark:` color overrides.

## Reference read for this

- `AGENTS.md` — invariants: semantic tokens only, no raw colors, `components/ui/*` not edited, identity palette as data confined to identity surfaces, light/dark mode via tokens.
- `docs/design-system.md` — chrome tokens (`background`, `foreground`, `card`, `muted`, `secondary`), identity palette (`--identity-1..6`, `--identity-*-soft`, `--identity-*-ink`), `data-identity` subtree binding, and approved deviation rules.
- `docs/directory.md` — profile page structure, states, and responsive behavior.
- `docs/skills.md` — installed skills map and rationale.
- `components/user/detail-card.tsx` — current card container and `<dl>` layout.
- `components/user/identity-hero.tsx` — hero wash styling and card elevation.
- `components/directory/user-card.tsx` — directory card surface and identity rail treatment for system consistency.
- `app/globals.css` — token declarations and identity bindings.

## The work

### 1. Refine `DetailCard` surface background

In `components/user/detail-card.tsx`:
- Update the `Card` styling so that the card background is visually distinct from the page canvas (`bg-background`) and harmonizes with the profile's identity hue.
- Implement a grounded, elevated surface:
  - Base `bg-card` with an intentional, subtle identity wash or complementary tint (e.g. `bg-linear-to-b from-(--identity-soft)/30 via-card to-card` or uniform subtle surface overlay `bg-card` paired with an identity accent top rail `<span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-(--identity)" />` and subtle border/ring `ring-1 ring-foreground/10`), establishing clear surface boundary and depth.
  - Ensure the card title and data rows retain crisp hierarchy (`CardTitle`, `text-muted-foreground` for labels, `text-card-foreground` / tabular mono for values).
- Keep `data-identity={hue}` on the `Card` to power `--identity`, `--identity-soft`, and `--identity-ink` bindings without dynamic class assembly.

### 2. Verify design-system fixtures and consistency

- Verify that `DetailCard` rendered on `/design-system` displays correctly across all 6 identity hues in both light and dark themes.
- Confirm that dark mode provides clean contrast with `--identity-*-soft` dark values (`oklch(0.29 ...)`) against dark `card` (`oklch(0.215 ...)`).

## Non-goals

- **Not modifying `components/ui/card.tsx`** — Invariant: `components/ui/*` is the installed registry and is never edited.
- **Not introducing raw hex or arbitrary RGB colors** — All colors come from semantic tokens or `--identity-*` variables in `app/globals.css`.
- **Not altering the data fields or layout structure** of the profile page.
- **Not adding client-side state or dependencies**.

## Expected impact

- `components/user/detail-card.tsx` — refined card background and surface treatment.
- `docs/design-system.md` — updated documentation on profile detail card surface styling.
- Zero breaking changes to existing data fetching, routes, or metadata.

## Checks

Run:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Browser verification per `AGENTS.md` §3:
- Inspect `/users/3-sophiab` (the screen from the screenshot) to verify the card background complements the cyan identity hero and separates cleanly from the page canvas.
- Inspect other profile hues (e.g., `/users/1-amarao` violet, `/users/2-terrencec` blue, `/users/4-alexisg` teal, `/users/5-connerw` amber, `/users/6-dorothym` rose).
- Verify `/design-system` to check all 6 hues side-by-side in both light and dark mode.
- Test at 375px, 768px, and 1440px with keyboard navigation.

## SKILLS USED

- `shadcn` — enforcing `base-nova` invariants: immutable `components/ui/*`, full `Card` composition (`CardHeader`, `CardTitle`, `CardContent`), semantic tokens only, `className` for layout/composition.
- `tailwind-design-system` — managing Tailwind CSS v4 design tokens, CSS-first theming in `app/globals.css`, and dark mode token consistency.
- `frontend-design` — ensuring aesthetic direction ("quiet chrome, colourful data"), visual hierarchy, surface separation, and intentionality.
- `design-taste-frontend` — anti-slop guidelines: WCAG AA contrast check, Color Consistency Lock adherence, theme consistency across sections, and elevation discipline.
