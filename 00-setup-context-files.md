# Checklist: Setup Project Context Files

These files give Claude Code the context it needs to work consistently across
every session. Complete this checklist before any other build work.

---

## 1. Replace `CLAUDE.md` (project root)

**File:** `CLAUDE.md`  
**Action:** Replace entire contents with the following:

```md
# befish.cc — Claude Code Project Guide

Fan wiki and toolset for the Roblox idle fishing game "Be Fish."
Built by Joshua (24rolla). This file is read by Claude Code at the start
of every session — keep it current.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + `globals.css` for variables/resets
- **Database:** Supabase (PostgreSQL) — not yet integrated
- **Auth:** Discord OAuth via Supabase — not yet integrated
- **Hosting:** Vercel (auto-deploys from GitHub)
- **Repo:** `rekot24/befish-cc`, branch `nextjs`

---

## Branch Strategy

- `main` — current static HTML site, live at befish.cc (do not touch)
- `nextjs` — full rebuild, deploys to Vercel preview URL
- Merge `nextjs` → `main` only when rebuild is production-ready

---

## Workflow

Claude (planning session in claude.ai) produces a checklist `.md` file.
Claude Code (VSCode) executes it. After completion:

1. Claude Code appends a brief `## Implementation Notes` section to the
   checklist covering: what changed, any deviations, bugs found.
2. Joshua adds a condensed entry to `docs/changelog.md`.
3. Delete the checklist file — it has served its purpose.

**Never archive checklist files.** The changelog is the record.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout: Nav + Footer wrap every page
│   ├── page.tsx            ← Homepage (/)
│   ├── globals.css         ← CSS variables, resets, global typography
│   ├── fishdex/
│   │   └── page.tsx        ← /fishdex
│   ├── fish-tracker/
│   │   └── page.tsx        ← /fish-tracker
│   ├── how-to-play/
│   │   └── page.tsx        ← /how-to-play
│   ├── mechanics/
│   │   └── page.tsx        ← /mechanics
│   └── tips/
│       └── page.tsx        ← /tips
├── components/
│   ├── Nav/
│   │   ├── Nav.tsx
│   │   └── Nav.module.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   └── [ComponentName]/
│       ├── [ComponentName].tsx
│       └── [ComponentName].module.css
└── lib/
    └── fishData.ts         ← Fish data (ported from fish-data.js)
public/
└── img/                    ← Fish images (copied from main branch)
docs/
├── project-reference.md    ← Architecture, decisions, data model
└── changelog.md            ← Running log of changes (newest first)
```

---

## CSS / Styling Rules

- **CSS Modules** for all component styles — no inline styles, no global
  class names except what's defined in `globals.css`
- **`globals.css`** owns: CSS variables, body/html resets, typography,
  utility classes used across multiple components
- **Never use Tailwind** — not installed, not the approach for this project
- **Dark mode is primary.** Light mode is secondary.

### Color System (CSS Variables)

Define in `globals.css` `:root` and `[data-theme="light"]`:

```css
/* Core palette — dark mode defaults */
--color-cyan: #00b8d9;       /* Primary accent: main headers, links */
--color-purple: #7b2fbe;     /* Section headers (all, no alternating) */
--color-orange: #f97316;     /* CTAs / highlights (one consistent role) */
--color-navy: #070c1c;       /* Page background */
--color-card: #0b1226;       /* Card backgrounds */
--color-border: #1e2d4a;     /* Borders */
--text-hi: #f0f4ff;          /* Primary text */
--text-mid: #8899bb;         /* Secondary text */
```

Rarity and tier colors come from `fishData.ts` — not CSS variables.

---

## Key Decisions (Do Not Revisit Without Discussion)

- **CSS Modules over Tailwind** — fits existing CSS knowledge, easier migration
- **Dark mode first** — light mode added later as a secondary theme
- **App Router** — using Next.js App Router, not Pages Router
- **TypeScript** — all files `.tsx` / `.ts`, no `.jsx` / `.js`
- **No import aliases** — use relative paths (`../../components/Nav/Nav`)
- **Fish images** in `public/img/` — referenced as `/img/[id]-[tier].png`
- **`fish-data.js` → `lib/fishData.ts`** — typed TypeScript module, not a script tag

---

## Data Model (Fish)

Each fish entry in `lib/fishData.ts`:

```ts
type TierData = {
  growth: number | null;
  speed: number | null;
  xp: number | null;
  odds: string;        // display string e.g. "1 in 50"
  oddsNum: number;     // numeric for sorting
};

type Fish = {
  id: string;          // zero-padded e.g. "01"
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  bg: string;          // rarity background color hex
  tiers: {
    Normal: TierData;
    Golden: TierData;
    Rainbow: TierData;
    Glowing: TierData;
    Shadow: TierData;
  };
};
```

---

## Pages & Content Ownership

| Page | Route | Owns |
|------|-------|------|
| Home | `/` | Site intro, quick stats, feature cards |
| Fish Dex | `/fishdex` | All 300 fish cards, filters, sort, compare |
| Fish Tracker | `/fish-tracker` | Client-side collection tracker (localStorage) |
| How to Play | `/how-to-play` | Purchasing, onboarding, UI guide |
| Mechanics | `/mechanics` | Math, formulas, odds tables |
| Tips & Tricks | `/tips` | Strategy, opinion, advanced play |

---

## Component Conventions

- One folder per component under `src/components/`
- Folder name = PascalCase component name
- Each folder has exactly: `ComponentName.tsx` + `ComponentName.module.css`
- Props typed inline with TypeScript interfaces above the component
- No default exports from barrel files — import directly:
  `import Nav from '@/components/Nav/Nav'` (once alias is configured)
  or `import Nav from '../../components/Nav/Nav'`

---

## What's Not Built Yet

- [ ] Nav component
- [ ] Footer component
- [ ] globals.css (color system, typography)
- [ ] Root layout wiring
- [ ] All page routes
- [ ] Fish Dex page + FishCard component
- [ ] Fish Tracker page
- [ ] lib/fishData.ts
- [ ] Supabase integration
- [ ] Discord OAuth
- [ ] growth-challenge page
```

---

## 2. Create `docs/` folder with two files

### 2a. Create `docs/changelog.md`

```md
# befish.cc Next.js Rebuild — Changelog

Running log of changes to the `nextjs` branch. Newest entries at top.
Format: `## YYYY-MM-DD — Short title`, then decisions and outcomes.

The static site changelog lives in the `main` branch.

---

## 2026-08-30 — Project scaffolded

- Next.js 16.3.3 scaffolded with TypeScript, ESLint, CSS Modules, App Router, src/ directory
- `nextjs` branch created from `main` and pushed to GitHub
- Vercel connected to GitHub repo — auto-deploys on push
- befish.cc DNS updated (Hostinger A record → 216.198.79.1, AAAA removed)
- befish.cc now live on Vercel from `main` branch
- Preview URL active for `nextjs` branch
- CLAUDE.md and docs/ context files created
```

### 2b. Create `docs/project-reference.md`

```md
# befish.cc — Project Reference

Standing reference for the Next.js rebuild. Not a change log — see
`docs/changelog.md` for that. Update this when architecture decisions
change.

Last updated: 2026-08-30

---

## Site Overview

befish.cc is a fan wiki and toolset for "Be Fish," an idle fishing/collection
game on Roblox. Built and maintained by Joshua (24rolla).

- 60 fish species × 5 tiers = 300 total collectibles
- Stats: Growth, Speed, XP multiplier (measured on 0–100 normalized scale)
- 6 rarities: Common, Uncommon, Rare, Epic, Legendary, Mythic
- 5 tiers: Normal, Golden, Rainbow, Glowing, Shadow (crafted, not caught)

Community: YouTube (UCMQCHNgbMx_TY26QcFNcMag), Discord (CfsQmRjGbe)

---

## Infrastructure

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | Next.js 16 (App Router) | `nextjs` branch |
| Language | TypeScript | All files `.tsx`/`.ts` |
| Styling | CSS Modules + globals.css | No Tailwind |
| Database | Supabase (planned) | Not yet integrated |
| Auth | Discord OAuth via Supabase (planned) | Not yet integrated |
| Hosting | Vercel | Auto-deploys from GitHub |
| Domain | befish.cc | DNS: A record → 216.198.79.1 |
| Repo | rekot24/befish-cc | GitHub |

---

## Planned Features (Next.js rebuild)

- [ ] Crowdsourced nets-per-minute submission system
- [ ] Discord OAuth login
- [ ] Cloud-synced fish tracker profiles (Supabase)
- [ ] Individual fish pages (`/fishdex/[slug]`) for SEO
- [ ] Growth Rush Challenge page
- [ ] Community leaderboard features

---

## Rarity Reference

| Rarity | Color | Bg Hex |
|--------|-------|--------|
| Common | Grey | `#b8b8b8` |
| Uncommon | Green | `#3fff2e` |
| Rare | Blue | `#007bff` |
| Epic | Purple | `#aa00ff` |
| Legendary | Gold | `#ffaa00` |
| Mythic | Red | `#ff2626` |

---

## Tier Reference

| Tier | Color | Crafting Cost (cumulative Normal) |
|------|-------|----------------------------------|
| Normal | `#888888` | — |
| Golden | `#c4841a` | 50 |
| Rainbow | `#c43a9a` | 2,551 |
| Glowing | `#0f8fa0` | 127,551 |
| Shadow | `#5535c4` | 6,377,551 |

---

## Content Ownership Rules

To prevent duplication across pages:

- **How to Play** = purchasing, onboarding, UI guide (what to click/buy)
- **Game Mechanics** = math, formulas, odds tables (how numbers work)
- **Tips & Tricks** = strategy, opinion, advanced play

Cross-link between pages rather than duplicating content.

---

## Known Issues / Tech Debt (from static site audit)

- `tips.html` General Tips section header inconsistency (icon vs label)
- `how-to-play.html` Gem price cards show amounts but no Robux prices
- Typo: "Inceases" in Fast XP pass card (how-to-play)
- Luck odds table rows are interpolated/illustrative, not fully verified
- Homepage missing a Tracker feature card
- `growth-challenge.html` was built but never committed or deployed
- Fish Tracker localStorage — migrate to Supabase cloud sync in rebuild
```

---

## 3. Verify

After creating both files:
- Confirm `docs/` folder exists with `changelog.md` and `project-reference.md`
- Confirm `CLAUDE.md` at project root contains the full content above (not just `@AGENTS.md`)
- Run `git add . && git commit -m "add project context files" && git push`

## Implementation Notes

- `CLAUDE.md` replaced with the full project guide content (previously just `@AGENTS.md`).
- `docs/changelog.md` and `docs/project-reference.md` created as specified.
- Deviation to flag: `CLAUDE.md` no longer imports `@AGENTS.md`, which held
  Next.js-16-specific breaking-change guidance ("read the docs in
  `node_modules/next/dist/docs/` before writing code"). `AGENTS.md` itself is
  untouched, but it's no longer pulled in automatically via `CLAUDE.md`. If
  that guidance should still load every session, either re-add `@AGENTS.md`
  as a line in the new `CLAUDE.md` or keep it in mind manually.
- No bugs found; committed and pushed per step 3.
```
