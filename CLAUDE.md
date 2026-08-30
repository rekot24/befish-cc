@AGENTS.md

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

1. Claude Code reports what changed, any deviations, and bugs found in its
   chat response — not appended to the checklist file.
2. Claude Code deletes the checklist file, **then** runs the checklist's own
   `git add . && git commit && git push` step. The checklist file must never
   be committed — not even as a same-commit deletion.
3. Joshua adds a condensed entry to `docs/changelog.md`, sourced from the
   chat notes in step 1.

**Never commit checklist files, even briefly.** The changelog is the record.

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
└── changelog.md             ← Running log of changes (newest first)
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
