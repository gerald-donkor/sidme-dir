# 08. Rename directory page heading to Personnel

## Scope

Update the primary heading on the main browse page (`app/page.tsx`) from "Directory" to "Personnel", and align associated secondary copy across the application (such as the back link on `/users/[id]` and empty state text) to maintain clear, consistent terminology.

## Reference material

- `app/page.tsx` — primary heading and description
- `app/users/[id]/page.tsx` — "Back to directory" navigation link
- `components/directory/directory-results.tsx` — empty state copy ("The directory is empty right now.")
- `docs/directory.md` — route and UI state documentation

## SKILLS USED

- `frontend-design` — ensure crisp typographic hierarchy and cohesive terminology across browse and profile views
- `design-taste-frontend` — maintain clear, unpretentious UI copy and consistent tone
- `caveman-commit` — commit changes after execution

## Expected impact

- Primary heading on `/` in `app/page.tsx` becomes `Personnel`.
- Back navigation button on `/users/[id]` in `app/users/[id]/page.tsx` becomes `Back to personnel`.
- Zero-record empty state text in `components/directory/directory-results.tsx` updates from `"The directory is empty right now."` to `"No personnel records found right now."`.
- All other layouts, route paths, URL search params, and data-fetching logic remain intact.

## Non-goals

- Renaming route paths, file names, or component names (e.g., `DirectoryPage`, `DirectoryResults`, `directoryHref`).
- Changing the site brand or global layout titles.
- Modifying design tokens, table styles, or data schemas.

## Verification & checks

- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Verify `/` shows "Personnel" heading and `/users/1` shows "Back to personnel"
- Update `docs/directory.md` with the updated surface copy
