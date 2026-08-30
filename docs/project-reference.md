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
