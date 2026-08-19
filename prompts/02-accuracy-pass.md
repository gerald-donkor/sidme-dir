# 02 — Accuracy pass on the contract and the build record

## Scope, and why it is next

No new surface. `/`, `/users/[id]` and `/design-system` are built, and `npm run typecheck`,
`npm run lint` and `npm run build` all pass on a clean tree — resolved from the repository, per
`AGENTS.md` §9 rule 5. §5.1 forbids inventing a feature, so what is left is the thing §9 rule 8
names: **the written contract disagrees with the code in four places, and a stale invariant is
worse than no invariant** — a later session reads `AGENTS.md`, believes it, and builds against a
value that was never true.

Four defects, each verified this session against the file it describes.

### A. `AGENTS.md:77` states the wrong radius

The invariant reads `--radius: 0.875rem`. `app/globals.css:89` is `--radius: 0.75rem`.
`docs/design-system.md:36` already says `0.75rem`, and its ladder (`sm` 0.45rem → `4xl` 1.95rem)
checks out against the `calc()` multipliers in `app/globals.css:51–57` (0.6, 0.8, 1, 1.4, 1.8, 2.2,
2.6) at a 0.75rem base. **The code and `docs/` agree; `AGENTS.md` alone is stale.**

Fix `AGENTS.md:77` to `0.75rem`. Change no token — the design is correct, the sentence is not.

### B. `docs/skills.md:24` excludes `tailwind-4-docs` for a reason that is not true

It says `.agents/skills/tailwind-4-docs/references/` **does not exist**. It does, and holds
`docs-source.txt`, `engineering-playbook.md` and `gotchas.md`. What the skill actually gates on —
`.agents/skills/tailwind-4-docs/SKILL.md:17` — is `references/docs/` and `references/docs-index.tsx`,
and *neither of those exists*.

**The conclusion stands and does not change:** the snapshot is uninitialised, so the skill is not a
verified source under §9 rule 2. Only the stated reason is wrong. Rewrite the cell to name the two
paths that are actually missing, and keep the fallback sentence about `tailwind-design-system` and
live docs. Do **not** run the sync script — it downloads a source-available, explicitly
not-open-source upstream and needs the user's licence acceptance, which is theirs to give.

### C. `hooks/` is absent from both architecture maps

`hooks/use-mobile.ts` exists. `npx shadcn info` reports `aliases.hooks` → `@/hooks` and
`resolvedPaths.hooks` → `<repo>/hooks`, so it is **registry-owned surface**, installed by the CLI
alongside `sidebar`, not project code. It is imported only by `components/ui/sidebar.tsx`, which no
application file imports.

It appears in neither `AGENTS.md` §6.3's tree nor README's "Where things are". Add one line to each,
marking it registry surface and unedited, in the same voice as the `components/ui/` line.

**Do not delete it, and do not delete the unused registry components.** The invariant is that
`components/ui/*` is installed, regenerable and not edited; pruning it is editing it, and the next
`shadcn add` would restore the files anyway.

### D. The `dark:` invariant is stated more absolutely than the code or the skill

`AGENTS.md` invariants: "No manual `dark:` overrides". `app/globals.css:133`: "Never a `dark:`
utility." But `components/chrome/theme-toggle.tsx:28–29` ships `dark:hidden` and `hidden dark:block`
to swap the sun and moon icons, and the shadcn rule it derives from
(`.claude/skills/shadcn/rules/styling.md`) is scoped: "No manual dark: **color** overrides."

The toggle is correct — icon *visibility* is not a colour override, and there is no token that can
express "show the moon in dark mode". **The sentence is what is wrong.** Narrow both lines to colour
and typography, and record the icon-visibility exception in `docs/design-system.md` beside the
existing token reasoning, so a later session does not "fix" the toggle.

### Checked and deliberately not changed

`components/chrome/site-header.tsx:10` (`z-30`) and `app/globals.css:276` (`z-50` on the skip link).
The rule — in `AGENTS.md` and in the skill — is about **overlay components**, which manage their own
stacking. A sticky header and a skip link are neither. No change; noted here so the next sweep does
not re-raise it.

A wider invariant sweep over `app/`, `components/{chrome,directory,user}/` and `lib/` found **no**
`asChild`, no `sonner`, no `forwardRef`, no `space-x/y-*`, and no raw hex. Those invariants hold.

## Reference material read

- `app/globals.css` (lines 45–57, 89, 133, 276), `components/chrome/theme-toggle.tsx`,
  `components/chrome/site-header.tsx`, `components.json`
- `AGENTS.md` §6.3 and the invariants block; `README.md` "Where things are"
- `docs/design-system.md`, `docs/skills.md`, `docs/directory.md`, `docs/data-layer.md`
- `.agents/skills/tailwind-4-docs/SKILL.md` and its `references/` directory listing
- `.claude/skills/shadcn/rules/styling.md`, and `npx shadcn info` for `aliases.hooks`

## Expected impact

Four documentation edits and zero behavioural change. `AGENTS.md` stops asserting a radius that was
never in the stylesheet and a `dark:` prohibition the code does not honour; `docs/skills.md` gives a
reason that survives being checked; both architecture maps account for every directory in the repo.
The rendered app is byte-identical.

## Non-goals, and why

- **No feature.** §5.1. Sorting, a view toggle and view transitions were all considered and recorded
  as out; nothing here reopens them.
- **No code behaviour change.** The only `.tsx`/`.css` edit permitted is the comment on
  `app/globals.css:133`. The theme toggle's markup is correct and stays.
- **No registry edits and no deletions** under `components/ui/` or `hooks/`.
- **No `tailwind-4-docs` sync.** Licence acceptance is the user's.
- **No re-run of the §3 browser walk.** Nothing rendered changes, so there is nothing new to see;
  README's recorded walk stays valid. Say this rather than implying a fresh walk happened.

## Checks

`npm run typecheck`, `npm run lint`, `npm run build` — quote the exact output (§2, §9 rule 3).
A build is expected to be unaffected; run it anyway so the claim is measured, not judged.

Recorded in: `docs/design-system.md` (A and D), `docs/skills.md` (B), and the maps in `AGENTS.md`
§6.3 and `README.md` (C).

**On editing `AGENTS.md` at all:** §1 step 10 says never record the build there. These are not build
records — they are §9 rule 8 corrections to lines that contradict the repository, which that rule
requires be fixed "in the same change". The index is not growing; four wrong statements are becoming
right, and one index row is added for this prompt.

## SKILLS USED

- `shadcn` — the registry's ownership of `hooks/` (`aliases.hooks` in `components.json`), and the
  exact scope of the `dark:` and `z-index` rules in `rules/styling.md`, which D and the
  "not changed" note both turn on
- `tailwind-design-system` — the `@theme` token layer and the radius ladder, to confirm A is a
  documentation fix and not a token change before any line is edited
