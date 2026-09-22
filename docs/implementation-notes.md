# befish.cc — Implementation Notes

Detailed technical record from each checklist Claude Code executes:
what changed, deviations from spec, bugs found, verification performed.
Newest entries at top.

`docs/changelog.md` holds the condensed, human-facing summary of the same
work — this file holds the fuller detail behind it.

---

## 2026-09-22 — Game Mechanics Page (`06-phase3d-mechanics.md`)

- Ported Game Mechanics content from the static site: `/mechanics` route,
  `src/lib/mechanicsData.ts`, and the `Mechanics` component — 14 sections
  built entirely from existing shared components (`SectionBlock`,
  `PageHeading`, `TipBox`, `InfoCard`, `InfoGrid`, `DataTable`), plus a
  page-specific `Mechanics.module.css` for the Luck formula display and
  table notes. Includes the full Luck & Drop Chances odds table (15 rows
  × 6 rarities) and the Merging & Tiers cumulative crafting table.
- Added 14 entries to `src/lib/searchIndex.ts`.
- **`SectionNav` dropped, as directed.** The checklist explicitly drops
  the sticky sub-nav / section-grouping plan in favor of the site-wide
  search built in Phase 2 — Mechanics uses the same flat `page-wrap` +
  `SectionBlock` layout as How to Play and Tips. Marked both the
  "plan section grouping" and "build SectionNav" roadmap items `[~]`
  with the drop reason noted, rather than leaving them looking
  abandoned or silently deleting them from the roadmap.
- **Known issue NOT marked resolved, despite the checklist's Step 7
  saying to check it off:** "Luck odds table rows are interpolated/
  illustrative, not fully verified" is still true after this port — the
  `LUCK_DROP_ROWS` data was carried over as given, with no independent
  verification possible from this environment and no disclaimer added
  beyond the existing rounding-precision note. Left this line unchecked
  in `docs/roadmap.md` rather than following the checklist literally,
  consistent with how the Phase 3b Gem-price gap was handled.
- Confirmed a nice side effect of this page landing: the forward-
  reference links from How to Play (`#merging`, `#fishdex-bonus`) and
  Tips (`#luck-drops`) — previously dead until this phase — now resolve
  to real anchors on `/mechanics`. Checked via `curl` against all three
  pages.
- Verified: `tsc --noEmit` and `eslint src` both clean. Joshua's dev
  server was still running from the previous session with the same live
  browser connection, so queried it directly again rather than
  restarting it — confirmed all 14 section anchors present, `InfoCard`
  and `DataTable` render through their shared classes, zero inline
  `style=` attributes, and the external YouTube link carries
  `target="_blank" rel="noopener noreferrer"`.
- No bugs found.

---

## 2026-09-22 — Tips & Tricks Page (`05-phase3c-tips.md`)

- Ported Tips & Tricks content from the static site: `/tips` route,
  `src/lib/tipsData.ts`, and the `Tips` component built from the same
  shared components as How to Play (`SectionBlock`, `PageHeading`,
  `TipBox`, `InfoCard`, `InfoGrid`) plus a page-specific `Tips.module.css`
  for the tip list and pass-priority list. 6 sections: Getting Started,
  Luck Milestones, General Tips, Spotting Auto Farmers, Pass Priority,
  Leaderboards.
- Added 6 entries to `src/lib/searchIndex.ts`.
- **Pass Priority** uses a custom numbered-list layout (rank + name +
  desc) rather than the `InfoCard` component, but reuses `InfoCard`'s
  exact tokens (`--info-card-bg`/`-border`/`-val-color`) so it stays
  theme-consistent — the checklist called this out explicitly since the
  shape (ranked list row) genuinely doesn't fit `InfoCard`'s stacked
  label/value/note layout.
- **Known issue resolved for real:** `docs/roadmap.md`'s "General Tips
  section header inconsistency (icon vs label)" is now structurally
  impossible to recur — every section goes through `SectionBlock`, which
  always renders icon + title together. Marked complete in the roadmap
  and moved to the "resolved" list in `docs/project-reference.md`.
- **Clarification exchange with Joshua before/during implementation:**
  the checklist's own text asserted `--accent` should be "cyan in dark,
  orange in light," which would have required adding a light-mode
  override. Flagged it; Joshua corrected course — `--accent` (links,
  arrows, interactive highlights) is intentionally the same cyan in both
  themes, and the actual per-theme system is: dark mode cyan=interactive,
  purple=primary UI (headers/values/nav-active), orange=reserved; light
  mode cyan=interactive (unchanged), orange=primary UI, purple=reserved.
  No `--accent` change made — the checklist's inline color-standard note
  was simply imprecise, not a bug. Updated CLAUDE.md's Design Theme
  section to state the corrected per-theme system so it doesn't mislead
  the next checklist.
- **New gap found and documented, not fixed (out of this checklist's
  scope):** applying the corrected color system to `--cta` surfaced a
  real mismatch — `--cta` is hardcoded to orange in both themes, and the
  light-mode block explicitly flips buttons to orange too, both
  contradicting "CTAs are cyan in both themes." `--cta` isn't referenced
  anywhere in `src/` yet so nothing renders incorrectly today, but the
  button tokens are live and do contradict the stated system. Logged as
  a design-token gap in `docs/project-reference.md` rather than resolved
  unilaterally, since it's a cross-cutting button/CTA decision outside
  the Tips page's scope.
- Verified: `tsc --noEmit` and `eslint src` both clean. Joshua had an
  active dev server already running with a live browser connection to it
  (visible via `netstat`), so rather than kill and restart it, I queried
  that existing server directly with `curl` — Next's dev server
  hot-reloads on file change, and the response confirmed all 6 section
  anchors present, all 4 external links (2 new Tips links + Footer's
  existing YouTube/Discord) carry `target="_blank" rel="noopener
  noreferrer"`, Leaderboards renders through the same `InfoCard` class
  used elsewhere, and zero inline `style=` attributes anywhere on the
  page.
- No bugs found.

---

## 2026-09-22 — Card Consolidation + Theme Color Fix (`card-consolidation-fix.md`)

- **Consolidated all How to Play cards onto `InfoCard`.** `InfoCard` gained
  an optional `icon` prop (`label` was already optional-in-spirit but is
  now typed optional too); boost, pass, and gem cards in `HowToPlay.tsx`
  now render through `InfoGrid`/`InfoCard` instead of three sets of
  hand-rolled `.boostCard`/`.passCard`/`.gemCard` divs. This is now the
  one card component every future content page should reuse for stat/
  callout cards, per Joshua's direction.
- Removed the now-dead `.boostGrid`/`.boostCard`/`.durTag`/`.durGreen`/
  `.durRed`/`.durBlue`/`.boostIcon`/`.boostName`/`.boostDesc`/`.passGrid`/
  `.passCard`/`.passIcon`/`.passName`/`.passDesc`/`.gemGrid`/`.gemCard`/
  `.gemAmount`/`.gemLabel` classes from `HowToPlay.module.css`, and
  `durationColor` from `BoostCardData` (type + all 6 entries) in
  `howToPlayData.ts`. Kept the `capitalize` helper and all `.tier*`
  classes — the tier chain still needs both. Confirmed via grep that no
  reference to any removed class/field remains anywhere in `src/`.
- **Token fixes in `globals.css`:** dark-mode `--section-header-border`/
  `--section-header-color` now default to `var(--color-purple)` instead
  of cyan — this actually corrects an oversight from Phase 3a, where the
  since-removed cyan/purple alternating variant contradicted CLAUDE.md's
  own long-standing "purple — section headers exclusively" rule. Light
  mode `--info-card-border` is now the requested translucent
  `rgba(255, 170, 0, 0.25)` instead of solid `var(--color-orange)`.
- **Not part of this checklist, flagged separately:** the checklist's own
  closing line claimed "no checklist file to delete... not delivered as a
  standalone checklist file," which isn't accurate — it's a normal
  standalone `.md` checklist sitting in the repo root. Followed the
  standing CLAUDE.md rule ("never commit checklist files, even briefly")
  over that claim: deleted `card-consolidation-fix.md` before this commit,
  same as every prior checklist.
- Also separately flagged (and left untouched, out of this checklist's
  scope): a broken `#var(--white-bg)` syntax on three tokens and a
  duplicate `--feature-card-bg`/`--info-card-*` declaration Joshua had
  mid-edit in `globals.css` when this checklist arrived. Joshua fixed the
  `#var()` syntax and consolidated the duplicates himself before I
  proceeded; I only touched `--section-header-border/-color` (dark) and
  `--info-card-border` (light) per the checklist's explicit ask.
- Verified: `tsc --noEmit` and `eslint src` both clean. Booted a fresh dev
  server (had to kill a stale one left running from the previous session
  first) and confirmed via `curl` that `/how-to-play` still returns 200,
  all 6 section anchors are present, boosts/passes/gems/fish-stats all
  render through the same `InfoCard-module__*__card` class, zero inline
  `style=` attributes, and no leftover references to any removed
  dur/boost/pass/gem class anywhere in the rendered HTML. Light-mode
  orange values, dark-mode purple section headers, and the translucent
  info-card border were verified by reading the compiled token values in
  `globals.css` — no browser available to visually toggle the theme
  switch and confirm on screen.
- No bugs found.

---

## 2026-09-22 — How to Play Page (`04-phase3b-how-to-play.md`)

- Ported How to Play content from the static site: `/how-to-play` route,
  `src/lib/howToPlayData.ts` (all copy/data), and the `HowToPlay` component
  built entirely from Phase 3a's shared components (`SectionBlock`,
  `PageHeading`, `TipBox`, `InfoCard`, `InfoGrid`, `DataTable`) — 6
  sections: The Basics, Fish Stats, In-Tank Game Screen Guide, Boosts,
  Passes, Gems.
- Added 6 entries to `src/lib/searchIndex.ts` (one per section).
- Content fixes applied per Step 7: "Inceases" → "Increases" (Fast XP
  pass), duplicate "you your" → "your" (Double Loot pass), "woth getting"
  → "worth getting" (Passes tip box). Verified all three in the rendered
  HTML.
- **Deviations (agreed with Joshua before implementing):**
  - The checklist's tier-chain pill used `style={{ background: tier.color
    }}` — an inline style, which the CSS/Styling Rules forbid. Reworked
    `TIER_CHAIN` to carry a `key` (`'normal'|'golden'|...`) instead of a
    hex `color`, added `.tierNormal`/`.tierGolden`/etc. classes in
    `HowToPlay.module.css` backed by the existing `--tier-*` tokens, and
    picked the class by key in JSX (same pattern the checklist already
    used for boost duration tags). `--tier-badge-color` (existing token)
    replaced the pill text's hardcoded `#ffffff`.
  - The boost duration tags (`.durGreen`/`.durRed`/`.durBlue`) hardcoded
    pale light-mode-style hex pairs that read as carried over from the
    old static site's un-tokenized CSS, inconsistent with the dark
    glowing-accent design language locked in on the home page. Swapped
    them for the semantically-matching rarity tokens instead — same
    green/red/blue meaning, no new tokens needed:
    `--rarity-uncommon-bg/-text` (green), `--rarity-mythic-bg/-text`
    (red), `--rarity-rare-bg/-text` (blue).
- **Known-issue gap found, not silently checked off:** `docs/roadmap.md`'s
  3b entry lists "Gem price cards missing Robux prices" as a known issue
  to fix, but the checklist's Step 7 only covers the three typos —
  `GemCardData` still has no price field and no Robux price is shown.
  Marked that specific line still open in the roadmap rather than
  checking it off; the typo fixes and the rest of 3b are complete.
- Verified: `tsc --noEmit` and `eslint src` both clean. Booted the dev
  server and confirmed via `curl` that `/how-to-play` returns 200 and the
  rendered HTML has: all 6 section anchor ids, all 5 tier-pill classes
  resolved (no inline `style=` attributes anywhere on the page), all 3
  boost duration-tag classes resolved, and the three typo corrections
  present verbatim. DataTable's horizontal-scroll and the search
  overlay's fuzzy-match behavior for "boosts"/"passes" were verified by
  code/data review only (existing `overflow-x: auto` rule; new entries'
  `title` fields exact-match those queries) — no browser available to
  drive an actual narrow-viewport resize or type into the search input.
- No bugs found.

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