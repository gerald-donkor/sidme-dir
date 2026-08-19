# 09. Rename page heading and terminology to Users

## Scope

Update the primary heading on the main browse page (`app/page.tsx`) to "Users", and align associated secondary copy across the application (such as the back link on `/users/[id]`, count indicator, not-found page, and empty state text) to use consistent "users" terminology matching the User Directory assignment brief.

## Reference material

- `app/page.tsx` — primary heading and description
- `app/users/[id]/page.tsx` — back navigation link
- `app/users/[id]/not-found.tsx` — 404 navigation link and message
- `components/directory/directory-results.tsx` — count indicator and zero-record copy
- `docs/directory.md` — route and UI state documentation

## SKILLS USED

- `frontend-design` — ensure cohesive visual and structural terminology across browse and profile views
- `design-taste-frontend` — maintain clean, unpretentious UI copy matching the product register
- `caveman-commit` — commit changes after execution

## Expected impact

- Primary heading on `/` in `app/page.tsx` becomes `Users`.
- Description on `/` in `app/page.tsx`: "Search by name, email or username, and open any user to view their details."
- Back navigation button on `/users/[id]` in `app/users/[id]/page.tsx` becomes `Back to users`.
- Empty state text in `components/directory/directory-results.tsx` updates to `"No users found right now."`.
- Results count label in `components/directory/directory-results.tsx` uses `"user"` / `"users"`.
- Not found page (`app/users/[id]/not-found.tsx`) button text becomes `Back to users` with copy `"Nobody in the user directory has that id."`.
- All other layouts, route paths, URL search params, and data-fetching logic remain intact.

## Non-goals

- Renaming route segments or code modules (`DirectoryPage`, `DirectoryResults`, `directoryHref`).
- Changing site branding in `SiteHeader`.
- Changing styling or layout structure.

## Verification & checks

- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Verify `/` shows "Users" heading and `/users/1` shows "Back to users"
- Update `docs/directory.md` with the updated surface copy
