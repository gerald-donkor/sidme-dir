# 05 — Header brand and navigation icon cleanup

## Scope, and why it is next

Simplify the top navigation bar in `components/chrome/site-header.tsx` per the user's annotated screenshot:
1. Remove the brand icon badge (`ContactRoundIcon` container) from the header brand link.
2. Update the brand link text from "Sidme Directory" to "Sidme".
3. Remove the leading house icon (`HouseIcon`) from the "Home" button so it renders clean text navigation.

## Reference read for this

- `AGENTS.md` — invariants: semantic tokens, Base UI button rendering (`nativeButton={false}` when rendering `Link`), icon guidelines, responsive header rules.
- `docs/design-system.md` — chrome styling, typography (`Outfit` / `font-display` for branding).
- `docs/directory.md` — layout and header specifications.
- `components/chrome/site-header.tsx` — current header implementation.

## The work

In `components/chrome/site-header.tsx`:
- Remove the `<span>` wrapping `ContactRoundIcon` and remove `ContactRoundIcon` import.
- Change the brand link text from `"Sidme Directory"` to `"Sidme"`.
- Remove `<HouseIcon data-icon="inline-start" />` and its import.
- Remove the `hidden sm:inline` class on "Home" (or render plain `"Home"` text inside the `Button`) so that the text is visible across all viewports without an icon.
- Remove `aria-label="Home"` on `Button` since text is now directly visible across all screen sizes.

## Non-goals

- **Not modifying page titles or metadata** — `app/layout.tsx` metadata and page titles remain intact.
- **Not altering `ThemeToggle` or header container layout**.
- **Not adding any client-side state or dependencies**.

## Expected impact

- `components/chrome/site-header.tsx` — clean, uncluttered brand and navigation elements.
- `docs/design-system.md` — update notes on header chrome if applicable.

## Checks

Run:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Browser verification per `AGENTS.md` §3:
- Inspect header on `/`, `/users/1`, and `/design-system`.
- Verify at 375px, 768px, and 1440px in both light and dark themes.

## SKILLS USED

- `shadcn` — enforcing Base UI button composition (`nativeButton={false}`, `render={<Link />}`) and component invariants.
- `frontend-design` — visual balance and hierarchy of the simplified header.
- `design-taste-frontend` — anti-slop guidelines: minimal and uncluttered header presentation across viewports.
