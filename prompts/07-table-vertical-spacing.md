# 07. User table vertical spacing and layout polish

## Scope

Increase the vertical spacing and visual hierarchy of the user directory table (`UserTable` in `components/directory/user-table.tsx` and matching skeleton in `components/directory/directory-skeleton.tsx`) to resolve cramped row presentation while preserving clean, structured alignment and token discipline.

## Reference material

- `components/directory/user-table.tsx` — current table implementation
- `components/directory/directory-skeleton.tsx` — table skeleton that must match the row rhythm
- `components/ui/table.tsx` — base table primitive styling
- `docs/directory.md` — specifications for card/table split and state surfaces
- `docs/design-system.md` — token system and identity palette invariants

## SKILLS USED

- `shadcn` — compose `Table`, `TableCell`, `TableHead`, `Badge`, `Avatar` with semantic tokens and layout classes
- `tailwind-design-system` — apply token-disciplined spacing (`px-4`, `py-3.5`/`py-4`, `gap-3.5`) without raw values
- `frontend-design` — ensure balanced hierarchy, proper breathing room, and typographic clarity
- `design-taste-frontend` — verify WCAG alignment, avoid cramped default padding, ensure skeleton matches real content

## Expected impact

- Table rows in `UserTable` gain balanced, comfortable vertical breathing room (`py-3.5` / `py-4` padding on cells with `px-4` horizontal guttering).
- Table headers (`TableHead`) receive consistent cell alignment and padding matching the data cells.
- Identity rail indicator (`bg-(--identity)`) scales cleanly to match the enhanced row height.
- Content within cells (Name + email, Role + badge, Company, Department, Location) maintains clean vertical stacking and alignment.
- `DirectorySkeleton` desktop table row representation is updated to mirror the new row height and padding, preventing layout shift during loading.
- Mobile cards (`UserCard`) remain completely untouched.

## Non-goals

- Modifying `UserCard` or mobile grid layout (explicitly excluded by user).
- Modifying installed registry files in `components/ui/table.tsx` (violates project invariants).
- Changing data fetching, pagination, search behavior, or routing.

## Verification & checks

- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Verify `/`, `/users/1`, and `/design-system` across desktop and mobile breakpoints
- Update `docs/directory.md` with the updated row rhythm details.
