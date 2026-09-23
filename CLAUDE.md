@AGENTS.md

# befish.cc — Claude Code Project Guide

Fan wiki and toolset for the Roblox idle fishing game "Be Fish."
Built by Joshua (24rolla). This file is read by Claude Code at the start
of every session — keep it current.

## Standing instructions

These apply every session without being included in the prompt:

- Read this file fully before touching any code.
- Read web-app-framework.md from https://github.com/Rekot24/dev-standards before any architectural work.
  (Not app-framework.md — that's the Python/desktop variant. This project
  is React, so web-app-framework.md is the one that applies.)
- Before building anything, explain what you are going to do and why. Wait for confirmation before proceeding.
- Flag anything that conflicts with dev-standards before proceeding — do not comply silently.
- No magic numbers or magic strings. CSS values are tokens in `globals.css`
  (see Variable Lookup Rule below — this is already the enforced
  convention). Non-CSS values (limits, thresholds, keys) go in a typed
  constants file under `src/lib/` (e.g. `src/lib/searchConfig.ts`) with a
  comment explaining what the value means and where it came from.
- Every function gets a docstring before implementation is written.
- All error handling follows the two-mode pattern: fail loudly in development, fail gracefully in production.
- When a session changes a standing decision, a convention, or the
  project's current phase, update the relevant section of this file
  (Stack, Key Decisions, or the "What's Not Built Yet" pointer) so it
  stays current — this file is a standing reference, not a running log.
  Detailed per-change history belongs in `docs/implementation-notes.md`;
  the condensed human-facing log is `docs/changelog.md` (see Workflow
  below). Commit CLAUDE.md changes as part of the checklist commit they
  belong to, not as a separate end-of-session commit.

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

Before building anything, explain what you are going to do and why. Wait for confirmation before proceeding.

Claude (planning session in claude.ai) produces a checklist `.md` file.
Claude Code (VSCode) executes it. After completion:

1. Claude Code prepends an entry to `docs/implementation-notes.md` (newest
   first) covering: what changed, any deviations, bugs found, verification
   done. This is the detailed technical record — not appended to the
   checklist file itself.
2. Claude Code deletes the checklist file, **then** runs the checklist's own
   `git add . && git commit && git push` step. The checklist file must never
   be committed — not even as a same-commit deletion.
3. Joshua adds a condensed entry to `docs/changelog.md`, sourced from
   `docs/implementation-notes.md`.

**Never commit checklist files, even briefly.** `docs/changelog.md` is the
condensed human-facing record; `docs/implementation-notes.md` is the fuller
technical one.

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
│   ├── Drawer/              ← Shared slide-in panel shell (overlay, right-
│   │                          slide desktop/bottom-sheet mobile, head/body/
│   │                          foot); FilterDrawer and TrackerDrawer both use it
│   ├── Modal/                ← Promise-based alert/confirm/prompt dialog
│   ├── Toast/                ← Notification stack
│   ├── ErrorBoundary/         ← Wraps Fish Tracker only; fallback exports raw data
│   ├── TrackerCard/, TrackerAddPanel/, TrackerDrawer/, FishTracker/
│   │                          ← Fish Tracker's component layer
│   └── [ComponentName]/
│       ├── [ComponentName].tsx
│       └── [ComponentName].module.css
├── hooks/
│   ├── useFishDex.ts        ← All Fish Dex state/filter/sort/compare logic
│   ├── useTracker.ts        ← All Fish Tracker state/mutations (hydration guard lives here)
│   ├── useLinkedFile.ts     ← Wraps trackerFileSync as React state
│   ├── useModal.ts          ← Promise-based alert/confirm/prompt
│   └── useToast.ts          ← Toast stack state
├── lib/
│   ├── fishData.ts          ← Fish data (ported from fish-data.js)
│   ├── logger.ts            ← The one sanctioned console.* boundary
│   ├── featureFlags.ts      ← Code-level flags until the Phase 7 settings store
│   ├── trackerConfig.ts     ← Every Fish Tracker constant, named + sourced
│   ├── trackerSchema.ts     ← Tracker types + pure normalize/migrate/export
│   ├── trackerLogic.ts      ← Pure tracker math (cascade, sort, ETA, formatting)
│   ├── trackerStorage.ts    ← localStorage adapter (the Phase 7 Supabase seam)
│   └── trackerFileSync.ts   ← Linked local file (IndexedDB + File System Access)
└── types/
    └── file-system-access.d.ts ← Ambient types the DOM lib doesn't declare yet
public/
└── img/                    ← Fish images (copied from main branch)
test-fixtures/
├── tracker/                 ← Synthetic tracker fixtures (committed)
└── private/                 ← Real user exports (gitignored — never commit)
scripts/
└── verify-tracker-data.ts   ← Tracker data-layer safety net (npx tsx scripts/verify-tracker-data.ts)
docs/
├── project-reference.md    ← Architecture, decisions, data model
├── changelog.md            ← Condensed running log (newest first)
└── implementation-notes.md ← Detailed per-checklist technical notes
```

---

## CSS / Styling Rules
> Styling follows the system defined in `rekot24/dev-standards: web-frontend-design.md`

- **CSS Modules** for all component styles — no inline styles, no global
  class names except what's defined in `globals.css`
- **`globals.css`** owns: CSS variables, resets, base typography, and the
  two global button classes (`.btn-primary`, `.btn-secondary`)
- **Never use Tailwind** — not installed, not the approach for this project
- **Dark mode is primary.** Light mode is a secondary override via
  `[data-theme="light"]` on the root element

### Design theme

Dark, aquatic, arcade-adjacent. The site is a fan wiki for a Roblox fishing
game — the visual language should feel like the ocean at night: deep dark
backgrounds, glowing cyan accents, electric purple section markers, and
orange used only for calls-to-action and active states. Nothing should feel
corporate or generic.

Color roles are per-theme, not fixed site-wide — the same color can be the
primary UI color in one theme and a reserved/minimal accent in the other:

**Dark mode (primary):**
- **Cyan** — everything interactive: links, arrows, CTAs, accents, highlights
- **Purple** — primary UI color: section headers, card values, nav active state
- **Orange** — reserved, minimal use

**Light mode:**
- **Cyan** — everything interactive: links, arrows, CTAs, accents, highlights
  (same role as dark mode — `--accent` never theme-switches)
- **Orange** — primary UI color: section headers, card values, nav active state
- **Purple** — reserved, minimal use

- **Rarity and tier colors** are fixed and never theme-switched — they are
  the game's identity, not the site's UI chrome

### Variable lookup rule

Before writing any value in a `.module.css` file:
1. Check `globals.css` first — if a token exists for it, use it
2. Match by *meaning*, not just name (e.g. nav link text → `--nav-text`,
   not a locally invented `--nat-text`)
3. A local CSS variable is only justified if the value is genuinely unique
   to that one component with no global equivalent
4. No hardcoded hex values, font strings, font-size literals, or
   font-weight numbers anywhere in `.module.css` files — all values
   come from tokens in `globals.css`

### Token map (globals.css sections)

| # | Section | Key tokens |
|---|---------|------------|
| 1 | Font families | `--font-display`, `--font-body` |
| 2 | Type scale | `--fs-xs` → `--fs-3xl`, `--fw-regular` → `--fw-black` |
| 3 | Core palette | `--color-cyan`, `--color-purple`, `--color-orange` |
| 4 | Backgrounds | `--page-bg`, `--nav-bg`, `--card-bg`, `--card-bg-alt`, `--footer-bg` |
| 5 | Text | `--text-hi`, `--text-mid`, `--text-low`, `--text-disabled`, `--stat-text` |
| 6 | Borders | `--border`, `--border-card`, `--border-card-hi`, `--border-section` |
| 7 | Nav | `--nav-text`, `--nav-text-hi`, `--nav-text-active`, `--nav-height` |
| 8 | Semantic aliases | `--accent`, `--section-header`, `--cta`, `--hero-word-*`, `--danger*` |
| 9 | Buttons | `--btn-primary-*`, `--btn-secondary-*`, `--btn-font-*`, `--btn-radius` |
| 10 | Cards | `--card-radius`, `--info-card-*`, `--fish-card-*`, `--feature-card-*` |
| 11 | Section blocks | `--section-block-*`, `--section-header-*`, `--section-desc-color` |
| 12 | Badges & labels | `--eyebrow-*`, `--rarity-badge-*`, `--tier-badge-*` |
| 13 | Stats & fish data | `--stat-label-*`, `--stat-bar-*`, `--stat-number-color` |
| 14 | Rarity colors | `--rarity-[name]`, `--rarity-[name]-bg`, `--rarity-[name]-text` |
| 15 | Tier colors | `--tier-[name]` |

### Buttons

Two global classes defined in `globals.css` — use them directly in JSX,
never redefine their color, padding, or radius in a module file:
- `.btn-primary` — filled, high-contrast CTA
- `.btn-secondary` — outlined, same shape
- Size modifiers: `.btn--sm`, `.btn--lg`
- Danger modifier: `.btn--danger` — for destructive actions (delete/replace
  confirmations), apply alongside `.btn-primary` or `.btn-secondary`. Uses
  `--danger`/`--danger-hover`/`--danger-text`. Still two button classes —
  this is a modifier, not a third class.

---

## Key Decisions (Do Not Revisit Without Discussion)

- **CSS Modules over Tailwind** — fits existing CSS knowledge, easier migration
- **Dark mode first** — light mode added later as a secondary theme
- **App Router** — using Next.js App Router, not Pages Router
- **TypeScript** — all files `.tsx` / `.ts`, no `.jsx` / `.js`
- **No import aliases** — use relative paths (`../../components/Nav/Nav`)
- **Fish images** in `public/img/` — referenced as `/img/[id]-[tier].png`
- **`fish-data.js` → `lib/fishData.ts`** — typed TypeScript module, not a script tag
- **Tracker storage keys and schema are a frozen contract (additive
  only)** — `befish-tracker-v2`/`-v1`/`-sort-locked` and the IndexedDB
  linked-file handle must never be renamed; new schema fields may be
  added but existing ones never removed/renamed/retyped. This is what
  lets the Next.js tracker inherit real users' browser data at the
  Phase 8 merge. See `docs/project-reference.md` "Fish Tracker storage
  contract" and `scripts/verify-tracker-data.ts`.
- **`logger`/`featureFlags` are code-level until Phase 7** — `lib/logger.ts`
  and `lib/featureFlags.ts` stand in for the Supabase `app_logs` table and
  the settings-store feature-flag rows that don't exist yet. No raw
  `console.*` calls anywhere in tracker code — always through `logger`.

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

See `docs/roadmap.md` for the full sequenced build plan and current status.
Current phase: Phase 5 — Fish Tracker page (/fish-tracker). Automated
work is done and verified; deliberately kept here (not advanced to
Phase 6) until Joshua completes the manual browser pass under
`docs/roadmap.md`'s Phase 5 "Open issues."
