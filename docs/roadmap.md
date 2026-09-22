# befish.cc — Rebuild Roadmap

Sequenced build plan for the Next.js rebuild (`nextjs` branch).
Phases must be completed in order — each phase is a dependency for the next.
Update status markers as work completes. Claude Code reads this file
alongside `CLAUDE.md` and `docs/project-reference.md`.

Status markers: `[ ]` not started · `[x]` complete · `[~]` in progress

---

## Phase 1 — Foundation
*Everything the rest of the site depends on. Must be 100% complete before Phase 2.*

- [x] Next.js 16 scaffolded (TypeScript, App Router, CSS Modules, src/ structure)
- [x] Vercel connected, auto-deploy from GitHub active
- [x] `CLAUDE.md` project guide in place
- [x] `docs/` context files created (changelog, implementation-notes, project-reference)
- [x] `globals.css` — full design token system established
  - [x] Font tokens (`--font-display`, `--font-body`)
  - [x] Typography scale (`--fs-*`, `--fw-*`, `--lh-*`)
  - [x] Core palette, backgrounds, text, borders, nav tokens
  - [x] Semantic aliases (`--accent`, `--section-header`, `--cta`)
  - [x] Component token groups (buttons, cards, section blocks, badges, stats)
  - [x] Rarity colors (3 tokens per rarity: accent, bg, text)
  - [x] Tier colors
  - [x] Layout & spacing tokens (`--space-*`, `--page-max-width`)
  - [x] Light mode overrides (`[data-theme="light"]`)
  - [x] Global button classes (`.btn-primary`, `.btn-secondary`, `.btn--sm`, `.btn--lg`)
  - [x] Global utility classes (`.eyebrow`, `.caption`, `.page-wrap`)
- [x] Root layout (`layout.tsx`) wiring Nav + Footer to every page
- [x] Nav component — sticky, dark, theme toggle, mobile hamburger
- [x] Footer component — YouTube + Discord links
- [x] All component `.module.css` files aligned to global token system (no hardcoded values)

---

## Phase 2 — Nav Search Bar
*Design and build search into the nav before any content pages are written.
Retrofitting search after pages are built is significantly harder.*

- [ ] Design search bar placement in Nav mockup (claude.ai planning session)
- [x] Build search index structure in `lib/searchIndex.ts`
  - Entries: `{ title, body, url, page, section }`
  - Covers all content pages: How to Play, Mechanics, Tips
  - Does NOT include Fish Dex (that page has its own filter/search system)
- [x] Integrate Fuse.js for client-side fuzzy search
- [x] Build `Search` component (`src/components/Search/`)
  - Search input in nav bar (icon collapsed → expands on click)
  - Results overlay — shows on type, closes on Esc or outside click
  - Each result shows: section title, page name, excerpt
  - Clicking a result navigates to `url` (page + section anchor)
- [x] Wire `Search` component into `Nav.tsx`
- [ ] Populate `lib/searchIndex.ts` entries as each content page is built (Phases 3–4)

---

## Phase 3 — Static Content Pages
*Three pages share the same layout pattern. How to Play and Tips are straightforward.
Game Mechanics has a sticky section nav due to content volume.*

### 3a — Shared section page layout
- [x] Design section page layout in mockup (claude.ai planning session)
  - Dark card blocks for each section
  - Cyan / purple alternating section header bars (tokens already defined)
  - Consistent spacing using `--space-*` and `--section-body-padding`
- [x] Build reusable `SectionBlock` component (`src/components/SectionBlock/`)
  - Props: `title`, `variant` (cyan | purple), `children`
  - Handles header bar color via variant prop
- [x] Add section anchor IDs to all section blocks (required for search + sticky nav)

### 3b — How to Play (`/how-to-play`)
- [x] Port content from `how-to-play.html` (static site) to Next.js page
- [~] Fix known issues from static site audit:
  - [ ] Gem price cards missing Robux prices — **not addressed by this checklist**;
    `GemCardData` still has no price field. Still open.
  - [x] Typo: "Inceases" in Fast XP pass card
- [x] Add page sections to `lib/searchIndex.ts`

### 3c — Tips & Tricks (`/tips`)
- [x] Port content from `tips.html` (static site) to Next.js page
- [x] Fix known issues from static site audit:
  - [x] General Tips section header inconsistency (icon vs label) — resolved
    structurally: every section now goes through `SectionBlock`, which
    always renders icon + title together, so the inconsistency can't recur.
- [x] Add page sections to `lib/searchIndex.ts`

### 3d — Game Mechanics (`/mechanics`)
- [~] Plan section grouping (dropped — site-wide search covers section
  navigation; the sticky-nav grouping plan is no longer needed)
- [~] Build `SectionNav` component — dropped; site-wide search covers
  section navigation, same flat layout as How to Play and Tips instead
- [x] Port content from `game-mechanics.html` (static site) to Next.js page
- [ ] Fix known issues from static site audit:
  - Luck odds table rows are interpolated/illustrative — still not
    independently verified. Ported as-given with no disclaimer added;
    flagging remains open rather than marking this resolved.
- [x] Add page sections to `lib/searchIndex.ts`

---

## Phase 4 — Fish Dex (`/fishdex`)
*The most complex page. Fish data, card components, and interactive filtering.*

- [ ] Port `fish-data.js` → `lib/fishData.ts` (typed TypeScript module)
  - Full `Fish` and `TierData` types as defined in `CLAUDE.md`
  - All 60 fish × 5 tiers
- [ ] Copy fish images from `main` branch → `public/img/`
  - Naming convention: `/img/[id]-[tier].png` (e.g. `/img/01-normal.png`)
- [ ] Build `FishCard` component (`src/components/FishCard/`)
  - Locked card structure (from design-decisions.md):
    - Rarity color fills full top area
    - Fish name centered full-width
    - Rarity + odds stacked left, fish image right
    - White stats body with rarity-colored bars
    - Tier badge pill hovering above top-left corner
  - Uses rarity token groups (`--rarity-[name]`, `--rarity-[name]-bg`, `--rarity-[name]-text`)
  - Uses tier color tokens (`--tier-[name]`)
  - Uses stat tokens (`--stat-bar-*`, `--stat-label-*`, `--stat-number-color`)
- [ ] Build Fish Dex page with filter + sort controls
  - Filter by rarity
  - Filter by tier
  - Sort by growth, speed, XP, odds
  - Text search by fish name (local to Fish Dex — separate from site-wide search)
- [ ] Build fish comparison feature (side-by-side stat comparison)
- [ ] Build individual fish pages (`/fishdex/[slug]`) for SEO
  - Static generation (`generateStaticParams`) — one URL per fish
  - 300 pages total (60 fish × 5 tiers)

---

## Phase 5 — Fish Tracker (`/fish-tracker`)
*Client-side collection tracker. Three sync states depending on auth.*

- [ ] Build Fish Tracker page — localStorage-only baseline (no auth required)
  - Mark fish as caught per tier
  - Progress display (X of 300 collected)
  - Export / Import JSON as fallback for all browsers
- [ ] Supabase integration (see Phase 7) unlocks cloud sync
  - On login: pull from Supabase first, fall back to localStorage if unreachable
  - Conflict resolution: `lastModified` Unix timestamp, last-write-wins
  - User-facing prompt for edge case conflicts
- [ ] File System Access API for local file backup (Chromium desktop only)
  - Local file is a manual safety net, not primary storage
  - Existing Export/Import remains as fallback for non-Chromium browsers

---

## Phase 6 — Growth Rush Challenge Page
*Already built on the static site but never committed or deployed.*

- [ ] Port `growth-challenge.html` content to Next.js page (`/growth-challenge`)
- [ ] Verify all content is accurate and up to date
- [ ] Add to nav if appropriate (or link from Tips page)

---

## Phase 7 — Backend: Supabase + Auth
*Unlocks Fish Tracker cloud sync and crowdsourced data features.*

- [ ] Supabase project setup
  - Connect to Next.js via environment variables
  - Set up PostgreSQL schema for fish tracker data
- [ ] Discord OAuth via Supabase
  - Login/logout flow
  - User session management in Nav (show avatar/username when logged in)
- [ ] Fish Tracker cloud sync (wired to Phase 5 placeholder)
- [ ] Crowdsourced nets-per-minute submission system
  - Google Form → Google Sheet (manual review gate)
  - Local Python aggregation script → rewrites `lib/fishData.ts` NPM rates
  - Or direct Supabase submission with moderation queue

---

## Phase 8 — Polish & Launch Prep
*Final pass before merging `nextjs` → `main` and going live.*

- [ ] Light mode QA pass — every page, every component
- [ ] Mobile QA pass — every page at 375px, 768px
- [ ] Cross-browser check (Chrome, Firefox, Safari)
- [ ] SEO basics
  - `<title>` and `<meta description>` on every page
  - Open Graph tags for social sharing
  - `sitemap.xml` generation
  - `robots.txt`
- [ ] Performance audit (Vercel Analytics / Lighthouse)
  - Image optimization (`next/image` for fish images)
  - Font loading strategy (already using `display=swap`)
- [ ] Fix all known static site issues not yet addressed
- [ ] Update `CLAUDE.md` "What's Not Built Yet" checklist to reflect completion
- [ ] Merge `nextjs` → `main`
- [ ] Verify befish.cc live on Vercel from `main`
- [ ] Archive or delete `nextjs` branch

---

## Deferred / Future (post-launch)
*Good ideas, not blocking launch.*

- [ ] Community leaderboard features
- [ ] Individual fish page comments or community notes
- [ ] Game update tracking (notify when fish stats change)
- [ ] Nets-per-minute leaderboard from crowdsourced data

---

## Current focus
Phase 4 — Fish Dex page and FishCard component.
