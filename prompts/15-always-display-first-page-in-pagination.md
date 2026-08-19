# 15 — Always display first page in directory pagination

## Scope, and why it is next

When navigating beyond the initial pages in the directory (e.g. page 7 of 11), the pagination window currently shifts to show only a narrow window around the current page (`[Previous] [6] [7] [8] [Next]`), hiding page 1. The user requested that page 1 should always be displayed in the pagination controls in addition to the surrounding active page window.

In `components/directory/directory-pagination.tsx`, when the sliding window `start` is greater than 1, prepend page 1 as a link (`PageLink`). When `start > 2`, include a `PaginationEllipsis` (`...`) between page 1 and the current sliding window. When `start === 2`, render page 1 directly preceding the window without an ellipsis (`1, 2, 3, 4`).

## Reference read for this

- `AGENTS.md` — project rules and invariants (honest links for pagination, Base UI conventions).
- `docs/directory.md` — state in URL, pagination specifications, and reasons for custom `PageLink` over registry's `PaginationLink`.
- `components/directory/directory-pagination.tsx` — directory pagination component.
- `components/ui/pagination.tsx` — installed registry pagination primitives, including `PaginationEllipsis`.

## The work

### 1. Update `components/directory/directory-pagination.tsx`

- Import `PaginationEllipsis` from `@/components/ui/pagination`.
- When `start > 1`:
  - Render a `PaginationItem` containing `PageLink` for page 1 (`href={hrefFor(1)}`, `label="Go to page 1"`).
  - If `start > 2`, render an intermediate `PaginationItem` with `<PaginationEllipsis />`.
- Retain the active window `pages.map(...)` and the Previous / Next navigation controls.

### 2. Update documentation

- Update `docs/directory.md` to note that page 1 is anchored and always accessible from the pagination bar across all pages, with an ellipsis rendered when skipping past page 2.

## Non-goals

- No changes to `PaginationLink` or direct edits to `components/ui/pagination.tsx`.
- No client-side state in pagination; all controls remain honest `Link` anchors driving URL query params (`?page=...`).
- No full wall of numbers; keep pagination compact with anchored first page and sliding active window.

## Expected impact

- Visiting `/?page=7` displays `[Previous] [1] [...] [6] [7] [8] [Next]`.
- Visiting `/?page=3` displays `[Previous] [1] [2] [3] [4] [Next]`.
- Visiting `/?page=1` displays `[Previous] [1] [2] [3] [Next]`.
- Page 1 remains one click away regardless of current scroll / pagination depth.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `/?page=7`, `/?page=3`, and `/?page=1` to confirm pagination rendering across both themes.

## SKILLS USED

- `shadcn` — composing registry pagination primitives (`PaginationEllipsis`, `PaginationItem`, `PaginationContent`).
- `caveman-commit` — committing verified changes to `main`.
