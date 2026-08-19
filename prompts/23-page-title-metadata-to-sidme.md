# 23 — Update page title metadata to Sidme

## Scope, and why it is next

The root metadata currently defines the title as `"Sidme Directory"` (`default: "Sidme Directory"`, `template: "%s · Sidme Directory"`).
The branding across the app header and UI has been simplified to "Sidme". To match the updated brand identity and user request, the document/browser tab title should be updated to `"Sidme"` (`default: "Sidme"`, `template: "%s · Sidme"`).

## Reference read for this

- `AGENTS.md` — workflow, invariants, and prompt contract.
- `app/layout.tsx` — root layout with `Metadata` definition.
- `docs/design-system.md` — chrome and site header documentation.

## The work

### 1. Update metadata in `app/layout.tsx`

In `app/layout.tsx`:
- Change `title.default` from `"Sidme Directory"` to `"Sidme"`.
- Change `title.template` from `"%s · Sidme Directory"` to `"%s · Sidme"`.

## Non-goals

- No changes to other route page components or description metadata.
- No changes to UI components or layouts.

## Expected impact

- Root page `/` document/tab title displays as `"Sidme"`.
- Sub-pages (e.g. `/design-system`, `/users/[id]`) display template title format as `"<Page> · Sidme"`.

## Checks

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Browser verification at `http://localhost:3000/` and `http://localhost:3000/design-system` to confirm tab title reflects "Sidme" / "Design system · Sidme".

## SKILLS USED

- `caveman-commit` — committing verified changes to `main`.
