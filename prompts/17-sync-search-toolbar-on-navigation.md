# 17 — Sync search toolbar on navigation

## Scope and why it is next

When a user is on a filtered directory URL (e.g. `/?q=hffh`), clicking the "Sidme" brand logo in the header (or the "Home" navigation button / "Show everyone" link) routes to `/`. However, `DirectoryToolbar` maintains a local `value` state that remained set to `"hffh"`. Its `useEffect` detected `value !== initialQuery` (`"hffh" !== ""`) and debounced a `commit(value)`, which replaced the URL back to `/?q=hffh`.

This prompt fixes the state synchronization in `DirectoryToolbar` so that external changes to `initialQuery` (such as navigating to `/`) immediately sync the input state and prevent re-committing stale queries.

## Reference material read for this

- `components/chrome/site-header.tsx` — the "Sidme" logo `<Link href="/">` and "Home" navigation button.
- `components/directory/directory-toolbar.tsx` — the search input client component, its local state, and debounce effect.
- `docs/directory.md` — state lives in the URL documentation.
- `AGENTS.md` — invariants and stack guidelines.

## The changes

**1. Synchronize `DirectoryToolbar` state with `initialQuery` — `components/directory/directory-toolbar.tsx`**

Track previous `initialQuery` prop during render. When `initialQuery` changes (such as navigating to `/` where `initialQuery` becomes `""`), adjust `value` state to match `initialQuery` immediately:

```tsx
const [value, setValue] = React.useState(initialQuery);
const [prevInitialQuery, setPrevInitialQuery] = React.useState(initialQuery);

if (prevInitialQuery !== initialQuery) {
  setPrevInitialQuery(initialQuery);
  setValue(initialQuery);
}
```

This ensures:
- Internal typing continues to work smoothly with 300ms debouncing.
- External navigations (clicking "Sidme" logo, "Home" button, "Show everyone", or browser history navigation) reset the search input immediately without triggering an accidental re-commit back to the old query.

## Expected impact

Clicking the "Sidme" logo in the header from any filtered query URL (e.g. `/?q=hffh`) reliably routes to `/` and resets the search query.

## Non-goals, and why

- **Rewriting header navigation or replacing `<Link href="/">`**. The header link markup is correct; the issue was the toolbar component re-committing stale state on URL reset.
- **Adding client router listeners**. Adjusting state during render on prop change is standard idiomatic React for synchronizing controlled/uncontrolled state without unnecessary effects or listeners.

## SKILLS USED

- `vercel-react-best-practices` — re-render and state synchronization guidelines.
- `caveman-commit` — commit after execution.

## Checks and where the result is recorded

Run `npm run typecheck`, `npm run lint`, and `npm run build`. Quote outputs verbatim.
Record the fix in `docs/directory.md`.
