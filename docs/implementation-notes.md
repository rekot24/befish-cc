# befish.cc — Implementation Notes

Detailed technical record from each checklist Claude Code executes:
what changed, deviations from spec, bugs found, verification performed.
Newest entries at top.

`docs/changelog.md` holds the condensed, human-facing summary of the same
work — this file holds the fuller detail behind it.

---

## 2026-09-21 — SectionBlock + Shared Content Components (`03-phase3a-section-components.md`)

- Built six presentational components, one folder each per Component
  Conventions: `SectionBlock` (icon/title header bar + body, cyan/purple
  variant, anchor `id` for search + sticky nav), `TipBox` (inline callout),
  `InfoCard` + `InfoGrid` (stat tiles + responsive grid wrapper),
  `DataTable` (headers/rows reference table), `PageHeading` (centered
  title/subtitle for page tops).
- None are wired into a page route yet — that starts in Phase 3b. Their
  correctness was verified in isolation only (typecheck + lint).
- Added a one-line JSDoc comment above each component function per the
  "every function gets a docstring" standing instruction — none of the
  rest of `web-app-framework.md` (Supabase async patterns, loading/error/
  empty states, persistent logging) applies here since these are pure
  presentational components with no data fetching.
- **Deviations (agreed with Joshua before implementing):** the checklist's
  `TipBox.module.css` hardcoded `background: rgba(0, 240, 222, 0.04)` — a
  new cyan alpha stop with no matching token. Added `--tip-box-bg` to
  `globals.css` §11 (Section blocks) instead of the literal value; no
  light-mode override needed, matching the precedent already set by
  `--border-interactive`/`--accent-wash` (Phase 2), which are also fixed
  across themes since `--color-cyan` itself never theme-switches.
  `DataTable.module.css`'s zebra-stripe `rgba(255, 255, 255, 0.02)` was
  left hardcoded with an "intentionally fixed" comment, matching the
  existing neutral-overlay convention (`Nav.module.css`,
  `--fish-card-body-bg`) rather than inventing a token for one use.
- Also updated CLAUDE.md's "Current phase" pointer (Phase 2 → Phase 3b),
  which had gone stale after the Phase 2 commit — per this session's own
  fix to the standing instructions, that pointer should stay current.
- Verified: `tsc --noEmit` and `eslint src` both clean. No dev-server/
  visual check performed — the checklist's own Step 4 only requires
  isolated typecheck/lint since nothing is rendered on a page yet.
- No bugs found.

---

## 2026-09-21 — Nav Search Bar (`02-phase2-search-bar.md`)

- Added `--search-max-results: 7` to `globals.css` §16, created
  `src/lib/searchConfig.ts` (matching JS constant) and
  `src/lib/searchIndex.ts` (typed `SearchEntry[]`, empty — populated
  page-by-page in Phase 3).
- Installed `fuse.js` (`^7.5.0`).
- Built `src/components/Search/{Search.tsx,Search.module.css}`: collapsed
  pill → expands on click or `/` keypress → Fuse.js fuzzy search across
  `title`/`body`/`section` → results grouped by page in a dropdown
  overlay. Closes on `Esc` or outside click; mobile collapses to icon-only
  with a full-width overlay.
- Wired `<Search />` into `Nav.tsx` between the nav links and the theme
  toggle; changed `.themeToggle` in `Nav.module.css` from
  `margin-left: auto` to `margin-left: var(--space-sm)` since `Search`'s
  own wrapper now owns the right-side push.
- **Deviation (approved by Joshua before implementing):** the checklist's
  `Search.module.css` hardcoded several `rgba(0, 240, 222, X)` values that
  hand-typed alpha stops of `--color-cyan` with no backing token — the
  exact pattern `style-audit.md` flagged sitewide as needing a shared
  alpha-scale system. Rather than leave them as magic numbers, added three
  new tokens instead of implementing verbatim:
  - `globals.css` §6 (Borders): `--border-interactive` (cyan @ 30%,
    focused control border) and `--border-interactive-hover` (cyan @ 40%,
    hover accent border)
  - `globals.css` §8 (Semantic aliases): `--accent-wash` (cyan @ 7%,
    hover/focus tint) — consolidates the checklist's two near-identical
    0.06/0.07 stops into one token
  - The resultIcon background (cyan @ 8%) reused the existing
    `--border-card` token exactly rather than a new one.
  - Left the `rgba(255, 255, 255, X)` neutral-overlay values as hardcoded,
    matching the existing "intentionally fixed" convention already used
    in `Nav.module.css` (`.link:hover`) and `globals.css`
    (`--fish-card-body-bg`) for one-off neutral tints with no color token
    to derive from — added the same inline comment to each.
- Verified: `tsc --noEmit` and `eslint src` both clean. `npm run dev`
  boots without Turbopack errors; confirmed via `curl` that the homepage
  renders 200 and the response HTML contains the search pill
  (`aria-label="Open search"`, "Search wiki" text). Remaining Step 7
  checks (`/` opens input, `Esc`/outside-click closes it, mobile
  icon-only collapse, empty-index hint/no-results states) were verified
  by code review only — no browser available in this session to drive
  actual key/click/resize interactions.
- No bugs found.

---

## 2026-08-30 — Nav Color Fix (`02-nav-color-fix.md`)

- Step 1 (`--nav-bg`/`--footer-bg` in `[data-theme="light"]`) was already
  `#0d1f3c` from the previous checklist — no change needed.
- Applied 2a–2c in `Nav.module.css`: `.logo` base color → orange,
  `.linkActive` (+ hover) → orange, `.themeToggle:hover` border → orange.
  CSS-only, no markup/logic changes.
- `tsc --noEmit` and `eslint src` both clean. No bugs found.

---

## 2026-08-30 — Nav, Footer, globals.css, Root Layout (`01-nav-footer-layout.md`)

- Replaced `src/app/globals.css`, created `src/components/Nav/{Nav.tsx,
  Nav.module.css}` and `src/components/Footer/{Footer.tsx,Footer.module.css}`,
  replaced `src/app/layout.tsx` and `src/app/page.tsx`, deleted
  `src/app/page.module.css` — all exactly as specified.
- Deviation: `eslint-config-next`'s `react-hooks/set-state-in-effect` rule
  flagged the `setTheme(initial)` call inside Nav's mount effect (calling
  setState synchronously in an effect). Kept the logic as specified — it's
  the standard "read theme after mount to avoid an SSR/localStorage
  hydration mismatch" pattern — and added a one-line
  `eslint-disable-next-line` with a comment explaining why, rather than
  restructuring it (a lazy `useState` initializer would read `localStorage`
  during the client's first render and cause an actual hydration mismatch,
  which is worse).
- Verified: `tsc --noEmit` and `eslint src` both clean, `next build`
  succeeds, and the rendered homepage HTML contains all 6 nav links (Home
  marked active), the fish logo, theme toggle, and footer YouTube/Discord
  links + disclaimer. Hamburger/mobile menu was verified by code review of
  the `@media (max-width: 768px)` rules in `Nav.module.css`, not a live
  resize (no browser available in this session).
- No bugs found otherwise.

---

## 2026-08-30 — Project Context Files (`00-setup-context-files.md`)

- `CLAUDE.md` replaced with the full project guide content (previously just
  `@AGENTS.md`).
- `docs/changelog.md` and `docs/project-reference.md` created as specified.
- Deviation flagged at the time: `CLAUDE.md` no longer imported `@AGENTS.md`
  (which holds Next.js-16 breaking-change guidance), since the replacement
  content didn't include that line. Joshua asked for `@AGENTS.md` to be
  restored as the first line, which was done in a follow-up edit and
  committed separately (`09d77f3`).
- No bugs found.

## Homepage build
- Created NavCard component: src/components/NavCard/
- Created HomePage component: src/components/HomePage/
- Added --hero-word-befish, --hero-word-wiki, --stat-number to globals.css
- page.tsx is now a thin mount — all UI lives in HomePage