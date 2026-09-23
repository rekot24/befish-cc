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
- [ ] Cloud-synced fish tracker profiles (Supabase) — localStorage/
  linked-file baseline shipped in Phase 5; this item is specifically the
  Phase 7 Supabase sync layer on top of it (the storage adapter is
  already shaped for this — see "Fish Tracker storage contract" below)
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

- `how-to-play.html` Gem price cards show amounts but no Robux prices —
  still open; `GemCardData` has no price field yet (Phase 3b)
- Luck odds table rows are interpolated/illustrative, not fully verified
- Homepage missing a Tracker feature card
- `growth-challenge.html` was built but never committed or deployed
- Fish Tracker cloud sync — localStorage + linked-file baseline shipped
  in the rebuild (Phase 5); Supabase sync itself is still Phase 7
- `www.befish.cc` returns HTTP 503 (found 2026-09-23) — the root domain
  works and `http://` correctly 308s to `https://befish.cc`; the `www`
  subdomain is likely not assigned to the Vercel project or has a DNS
  mismatch. Fix: add `www.befish.cc` in Vercel → Domains with a redirect
  to `befish.cc`. Tracked for a Phase 8 fix.

Resolved during the Next.js rebuild (kept here only as a pointer to when/
how, not as an open item):
- `tips.html` General Tips section header inconsistency (icon vs label) —
  resolved structurally by `SectionBlock` (Phase 3c)
- Typo "Inceases" in Fast XP pass card — fixed during content port (Phase 3b)

## Fish Tracker storage contract

Frozen — see `CLAUDE.md` Key Decisions. This is what makes it safe for
the Next.js tracker to inherit every existing user's browser storage at
merge time (Phase 8): at that point it runs on the same origin as the
live site, so it only inherits real data if these exact keys/shapes hold.

| Storage | Name | Rule |
|---|---|---|
| localStorage | `befish-tracker-v2` | Primary key. Read and write this exact key. Never rename it. |
| localStorage | `befish-tracker-v1` | Legacy key. Read once for migration if v2 is missing. Never delete or modify it. |
| localStorage | `befish-tracker-sort-locked` | `'1'` / `'0'`. Global (not per-profile). Default is locked when missing. |
| localStorage | `befish-tracker-v2-preimport-backup` | New (this port) — a snapshot of v2 written just before a full-backup import replaces everything. |
| IndexedDB | DB `befish-tracker-fs`, version `1`, store `handles`, key `linkedFile` | Linked-file handle. Reused exactly, so existing linked files stay linked. |

**Schema rule — additive only.** The same JSON shape the live page writes,
always. New fields may be added (`schemaVersion`, `lastModified` on both
the root and each profile), but existing fields must never be removed,
renamed, or retyped. Unknown fields are preserved on round-trip (e.g. the
legacy per-tracker `craftTarget`) — this is what keeps a rollback to the
old static site safe, since its code simply ignores fields it doesn't
recognize. Verified automatically by `scripts/verify-tracker-data.ts`
(`npx tsx scripts/verify-tracker-data.ts`) against synthetic fixtures in
`test-fixtures/tracker/` and, when present, a real export at
`test-fixtures/private/` (gitignored — never commit real user data).

**Hydration guard.** React's first render has no access to localStorage.
`useTracker` never persists anything until its `hydrated` flag is true,
and `trackerStorage.ts`'s own `load()` never writes a fresh default
profile on load either — only a real user mutation may do that, and only
once hydration has completed. Writing a blank default before the real
load finishes would silently wipe existing data; this is the single most
important failure mode the whole storage layer exists to prevent.

## Design token / implementation gaps (found during Next.js rebuild, not from the static site)

- **`--cta` doesn't match the clarified color-role system.** Per Joshua
  (2026-09-22): CTAs should be cyan in both themes ("everything
  interactive: links, arrows, CTAs, accents, highlights"), but
  `--cta` in `globals.css` §8 is hardcoded to `var(--color-orange)` with
  no light-mode override, and the light-mode block explicitly comments
  "Buttons — primary shifts to orange in light mode for contrast"
  (`--btn-primary-border`/`--btn-secondary-border` → orange). `--cta`
  itself isn't referenced anywhere in `src/` yet, so this is a
  documentation/token mismatch, not a live rendering bug — but the
  button tokens ARE live and currently contradict the stated system.
  Needs a decision: realign `--cta`/button tokens to cyan-in-both-themes,
  or treat buttons as an intentional exception to the general rule.
