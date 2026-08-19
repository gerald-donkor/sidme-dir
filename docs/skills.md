# Skills

The skills installed in `.agents/skills/`, what each is for on this project, and what was
deliberately excluded. `AGENTS.md` §1 step 2 requires loading every skill a task touches, at every
stage — this file is the map of which one owns which surface.

## In use

| skill | owns | notes |
| --- | --- | --- |
| `shadcn` | every component built on `components/ui/*` | `user-invocable: false` — it triggers on its own whenever `components.json` is in play. Its `rules/base-vs-radix.md` is the reference for this project's Base UI style, and its `rules/styling.md` and `rules/composition.md` are the source of the styling invariants in `AGENTS.md`. Run `npx shadcn@latest docs` before using an unfamiliar primitive |
| `tailwind-design-system` | `app/globals.css`, the token layer, the layout primitives | Source of the CSS-first structure: `@theme` namespaces, `.dark` overrides, `@layer base`, and the `cva` + `VariantProps` pattern for project components |
| `frontend-design` | the aesthetic direction | Used to set the direction before any token was written. Its two-pass process — token plan, then a critique of that plan against the brief — produced "quiet chrome, colorful data" (`docs/design-system.md`) |
| `design-taste-frontend` | the quality floor | Scoped: its §13 explicitly excludes dense product UI and data tables, which is most of this app. What binds here are its universal rules — real loading/empty/error cycles, skeletons shaped like content, WCAG AA on controls, labels above inputs, `min-h-[100dvh]` over `h-screen`, no em-dashes in UI copy, and the theme/colour/shape consistency locks. Its discouragement of `lucide-react` carries an explicit escape hatch for projects already on it, which this one is (`components.json` sets `iconLibrary: "lucide"`) |
| `vercel-react-best-practices` | how the React and Next.js code is written | The rules that actually bind two routes and a fetch layer: `server-cache-react` (`React.cache()` around `getUser`, so the page body and `generateMetadata` share one call), `async-suspense-boundaries`, `server-serialization` and `server-dedup-props` (pass the minimum into a client leaf), `bundle-barrel-imports` (import icons directly), `rerender-use-deferred-value` (the search input) |
| `vercel-react-view-transitions` | the list-to-detail transition | Its own gate applies: a transition stays only if it communicates a spatial relationship. Here that is the avatar travelling from card to detail hero. Never call `startViewTransition` by hand, and **do not install `react@canary`** — the App Router already runs the React canary |
| `web-design-guidelines` | the final audit pass | It carries no local rules; it fetches the Vercel Web Interface Guidelines fresh over the network on each run and reports `file:line` findings. Needs connectivity. Run it over `app/**` and `components/**` before calling the build done |

## Excluded, and why

| skill | why not |
| --- | --- |
| `extract-design-system` | It reverse-engineers tokens out of an existing public website with Playwright. There is no site to extract from — the design system here is authored, not derived. It also writes into `design-system/` and `.extract-design-system/`, neither of which belongs in this repo |
| `tailwind-4-docs` | **Its docs snapshot is not initialised in this checkout** — the skill gates on `references/docs/` and `references/docs-index.tsx` (`SKILL.md` "Quick start" step 1) and neither exists; `references/` itself holds only `docs-source.txt`, `engineering-playbook.md` and `gotchas.md`. Its own instruction is to refuse to answer until the snapshot is synced, and syncing pulls a source-available, not-open-source upstream whose licence is the user's to accept. It is therefore not a verified source here (`AGENTS.md` §9 rule 2). Tailwind 4 questions are answered from the `tailwind-design-system` skill and from Tailwind's live docs instead |
| `improve-codebase-architecture` | `disable-model-invocation: true` — the user invokes it. It is a post-build review that emits an HTML report to the OS temp directory, and it is oversized for a codebase of this shape |
| `handoff` | `disable-model-invocation: true`, and it addresses a problem this project does not have |
