# Be Fish Wiki — Site Reference Document

> This document is the single source of truth for the Be Fish Wiki website.
> All content, structure, data, and conventions defined here must be used
> consistently across every page and future update.
> Last updated: March 2026 — document version 2.0

---

## 1. Site Overview

| Property | Value |
|---|---|
| Site name | Be Fish Wiki |
| Game | Be Fish (Roblox) |
| Purpose | Fan wiki / reference site for the Be Fish Roblox game |
| Primary audience | Roblox players looking up fish stats, catch odds, and game mechanics |
| Pages | Home, Fish Dex, How to Play, Tips & Tricks |

---

## 2. Site Structure & Navigation

```
/ (Home)               — SEO landing page
/fishdex               — Fish Dex: full 300-collectible browser
/how-to-play           — Mechanics, UI guide, boosts, passes, gems, chests
/tips                  — Tips & Tricks
```

Nav bar order: **Home · Fish Dex · How to Play · Tips & Tricks**

Logo/branding: fish emoji + "Be Fish" in Fredoka One, "Wiki" in --ocean-light accent color.

---

## 3. Home Page (SEO Landing Page)

### Target SEO keywords
- "Be Fish Roblox"
- "Be Fish Roblox wiki"
- "Be Fish fish list"
- "Be Fish Roblox how to play"
- "Be Fish fish stats"
- "Be Fish rare fish odds"
- "Be Fish Roblox guide"
- "Roblox Be Fish tips"

### Meta tags
```html
<title>Be Fish Wiki — Roblox Fish Stats, Odds & Guide</title>
<meta name="description" content="The complete Be Fish Roblox wiki. Browse all 60 fish with catch odds, growth and speed stats, tier progression, boosts, passes, and tips for beginners and veterans." />
<meta name="keywords" content="Be Fish Roblox, Be Fish wiki, Be Fish fish list, Be Fish stats, Be Fish guide, Roblox fishing game" />
<meta property="og:title" content="Be Fish Wiki — Roblox Fish Stats, Odds & Guide" />
<meta property="og:description" content="Complete stats, catch odds, and guides for Be Fish on Roblox." />
<meta property="og:type" content="website" />
```

### Home page sections (in order)
1. **Hero** — Game title, tagline, CTA buttons to Fish Dex and How to Play
2. **What is Be Fish?** — Short intro paragraph (Roblox idle fishing/collection)
3. **Quick Stats** — 60 species · 300 collectibles · 5 tiers · 6 rarities
4. **Feature cards** — Fish Dex, How to Play, Tips & Tricks (each links to its page)
5. **Footer** — "Fan-made wiki. Not affiliated with Roblox or the Be Fish developers."

### Taglines
- "The complete guide to every fish in Be Fish on Roblox"
- "300 collectibles. Every stat. All in one place."

---

## 4. Visual Design System

### Fonts
| Role | Font |
|---|---|
| Display / headings | Fredoka One (Google Fonts) |
| Body / UI | Nunito (Google Fonts) |

### Color palette
| Variable | Hex | Usage |
|---|---|---|
| --ocean | #0a6e8a | Primary brand, active states |
| --ocean-light | #0e97bd | Accent, nav logo highlight |
| --ocean-dark | #064d62 | Nav background, section headers |
| --sand | #f5dfa0 | Nav text, display headings |
| --sand-dark | #e8c96a | Hover underlines, tip box borders |
| --foam | #e8f7fb | Card backgrounds, info panels |
| --coral | #e8604a | Prices, cost labels |
| --seaweed | #2d9e5f | Pass cost badges |
| --page-bg | #e0f4fa | Page background |
| --text-dark | #1a3a45 | Primary text |
| --text-mid | #2d6070 | Secondary text |
| --text-muted | #5a8a98 | Labels, hints, ??? placeholders |

### Rarity colors (confirmed from game data)
| Rarity | In-game Card BG | Text | Page Badge BG | Bar Color |
|---|---|---|---|---|
| Common | #b8b8b8 | #555 | #eeeeee | #888888 |
| Uncommon | #3fff2e | #1c6030 | #d4f0dc | #2a9e50 |
| Rare | #007bff | #0d4a8a | #d4e8f8 | #1a72c4 |
| Epic | #aa00ff | #5a1a88 | #ead4f8 | #8a35c4 |
| Legendary | #ffaa00 | #884a0d | #f8e8d4 | #c47a1a |
| Mythic | #ff2626 | #881a13 | #f8d4d2 | #c4271a |

The "In-game Card BG" is the `bg` field in the fish data. Use it as the background color
behind the fish sprite image on each card in the Fish Dex.

### Tier colors
| Tier | Color |
|---|---|
| Normal | #888888 |
| Golden | #c4841a |
| Rainbow | #c43a9a |
| Glowing | #0f8fa0 |
| Shadow | #5535c4 |

---

## 5. Fish Data Schema

```javascript
{
  id: '01',              // Zero-padded 2-digit Fish ID
  name: 'Goldfish',      // Display name
  rarity: 'Common',      // Common | Uncommon | Rare | Epic | Legendary | Mythic
  bg: '#b8b8b8',         // In-game card background color behind fish image
  tiers: {
    Normal:  { odds: '1 in 5',      speed: 4.0,  growth: 4.0,  xp: 1.0  },
    Golden:  { odds: '1 in 250',    speed: 23.4, growth: 23.4, xp: 2.8  },
    Rainbow: { odds: '1 in 13,000', speed: 34.3, growth: 34.3, xp: 4.75 },
    Glowing: { odds: '1 in 630,000',speed: 43.8, growth: 43.8, xp: 6.8  },
    Shadow:  { odds: '1 in 31M',    speed: null, growth: null, xp: null },
  }
}
```

- speed/growth: 0-100 scale converted from in-game bar fills
- xp: multiplier value (e.g. 1.0, 4.75, 12.1)
- null = not yet measured, displays as striped bar + ???
- odds: string formatted as shown in-game

---

## 6. Image Conventions

All fish images in /img/ folder, named: {ID zero-padded 2 digits}-{tier number}.png

| Tier | Number |
|---|---|
| Normal | 1 |
| Golden | 2 |
| Rainbow | 3 |
| Glowing | 4 |
| Shadow | 5 |

Examples: /img/01-1.png (Goldfish Normal), /img/60-5.png (Whale Shark Shadow)
Total: 60 fish x 5 tiers = 300 images

Card display: fish image shown on bg-colored background. If image missing, show fish emoji placeholder.

---

## 7. Complete Fish List — All 60 Species (Confirmed)

NOTE: Thresher Shark (46), Swordfish (47), and Tuna (48) are Epic, not Legendary.
Legendary starts at Anglerfish (49). This corrects an error from v1.0 of this document.

| ID | Fish Name | Rarity | BG Color |
|---|---|---|---|
| 01 | Goldfish | Common | #b8b8b8 |
| 02 | Sardine | Common | #b8b8b8 |
| 03 | Tetra | Common | #b8b8b8 |
| 04 | Herring | Common | #b8b8b8 |
| 05 | Angelfish | Common | #b8b8b8 |
| 06 | Tilapia | Common | #b8b8b8 |
| 07 | Carp | Common | #b8b8b8 |
| 08 | Sheepshead | Common | #b8b8b8 |
| 09 | Starfish | Uncommon | #3fff2e |
| 10 | Seahorse | Uncommon | #3fff2e |
| 11 | Guppy | Uncommon | #3fff2e |
| 12 | Tiger Barb | Uncommon | #3fff2e |
| 13 | Bluegill | Uncommon | #3fff2e |
| 14 | Clownfish | Uncommon | #3fff2e |
| 15 | Parrotfish | Uncommon | #3fff2e |
| 16 | Moorish Idol | Uncommon | #3fff2e |
| 17 | Cichlid | Uncommon | #3fff2e |
| 18 | Mackerel | Uncommon | #3fff2e |
| 19 | Triggerfish | Uncommon | #3fff2e |
| 20 | Trout | Uncommon | #3fff2e |
| 21 | Piranha | Rare | #007bff |
| 22 | Pufferfish | Rare | #007bff |
| 23 | Jellyfish | Rare | #007bff |
| 24 | Oscar | Rare | #007bff |
| 25 | Fairy Wrasse | Rare | #007bff |
| 26 | Catfish | Rare | #007bff |
| 27 | Butterflyfish | Rare | #007bff |
| 28 | Cod | Rare | #007bff |
| 29 | Blue Tang | Rare | #007bff |
| 30 | Flounder | Rare | #007bff |
| 31 | Red Snapper | Rare | #007bff |
| 32 | Salmon | Rare | #007bff |
| 33 | Grouper | Rare | #007bff |
| 34 | Stingray | Rare | #007bff |
| 35 | Trevally | Rare | #007bff |
| 36 | Betta Fish | Epic | #aa00ff |
| 37 | Zebra Angelfish | Epic | #aa00ff |
| 38 | Sunfish | Epic | #aa00ff |
| 39 | Bass | Epic | #aa00ff |
| 40 | Arowana | Epic | #aa00ff |
| 41 | Pike | Epic | #aa00ff |
| 42 | Barracuda | Epic | #aa00ff |
| 43 | Zebra Shark | Epic | #aa00ff |
| 44 | Nurse Shark | Epic | #aa00ff |
| 45 | Humphead | Epic | #aa00ff |
| 46 | Thresher Shark | Epic | #aa00ff |
| 47 | Swordfish | Epic | #aa00ff |
| 48 | Tuna | Epic | #aa00ff |
| 49 | Anglerfish | Legendary | #ffaa00 |
| 50 | Eagle Ray | Legendary | #ffaa00 |
| 51 | Cobia | Legendary | #ffaa00 |
| 52 | Sawfish | Legendary | #ffaa00 |
| 53 | Hammerhead Shark | Legendary | #ffaa00 |
| 54 | Mako Shark | Legendary | #ffaa00 |
| 55 | Moonfish | Legendary | #ffaa00 |
| 56 | Koi | Mythic | #ff2626 |
| 57 | Manta Ray | Mythic | #ff2626 |
| 58 | Sailfish | Mythic | #ff2626 |
| 59 | Great White Shark | Mythic | #ff2626 |
| 60 | Whale Shark | Mythic | #ff2626 |

---

## 8. Complete Fish Data — All 300 Entries

All speed/growth values on 0-100 scale. null = not yet measured. Paste into FISH array in site HTML.

See separate section or attached JS file. Summary of data completeness:
- Normal tier: 60/60 complete
- Golden tier: 59/60 (Whale Shark Golden missing)
- Rainbow tier: 54/60 (Moonfish, Koi, Manta Ray, Sailfish, Great White Shark, Whale Shark missing)
- Glowing tier: 44/60 (all Legendary + Mythic missing; also Humphead, Thresher Shark, Swordfish, Tuna)
- Shadow tier: 0/60 (none measured yet — all display as ???)

Full JS data block is at the end of this document (Section 17).

---

## 9. Tier System

- 5 tiers per fish: Normal -> Golden -> Rainbow -> Glowing -> Shadow
- First catch of a species = Normal tier
- Each tier requires crafting 50 of the previous tier into 1 of the next
- Shadow tier equivalent: 50^4 = 6,250,000 Normal fish
- XP multiplier increases with each tier upgrade

---

## 10. Fishdex Milestone Rewards

Every 10 fish collected out of 300 total grants permanent rewards:

- Bonus Luck — cumulative permanent Luck % increase
- Growth Multiplier — cumulative permanent Growth % increase
- Gems — a gem reward at each milestone

Example: At 210/300 fish: +1050% Luck and +315% Growth. At 220/300: +1100% Luck and +330% Growth.

The Fishdex screen shows current and next milestone side by side with an arrow:
"Bonus Luck: 1050% > 1100%" and "Growth Multiplier: 315% > 330%"

This makes expanding your collection a primary long-term progression goal — more fish directly
improves your odds of finding rarer fish and your size growth rate permanently.

Display in How to Play: explain with a milestone table or example showing the compounding benefit.

---

## 11. Fish Dex Page

### Controls — all default to ALL SELECTED

#### Tier filter (toggle buttons — identical behavior to Rarity filter)
- All 5 tiers active by default: Normal, Golden, Rainbow, Glowing, Shadow
- Each styled in its tier color when active
- Clicking toggles that tier on/off
- Multiple tiers can be active simultaneously
- Cards are shown for each active tier (a fish appears once per active tier it has)

#### Rarity filter (toggle buttons)
- All 6 rarities active by default
- Each styled in its rarity color when active

#### Sort buttons
- Default (ID order 01-60)
- Growth down (highest first) / Growth up (lowest first)
- Speed down / Speed up
- XP down
- null stats always sort to the bottom

#### Search
- Real-time name filter

### Fish Card
```
[ fish image on bg-color background ]     [Tier badge]
Fish Name
[Rarity badge]                            [catch odds]
Growth  [bar=========     ] 45.2
Speed   [bar====          ] 28.8
XP multiplier                             3.5x
```
Unknown stats show striped bar + ??? text. All rows always visible.

---

## 12. How to Play Page

### 12.1 Game Screen Guide
| Element | Location | Description |
|---|---|---|
| Gem Counter | Top center | Gem balance. Used to skip chest timers |
| Leaderboard | Top right | Top players by fish size in real time |
| Fishdex | Top left | Opens collection. Shows X/300 discovered |
| Shop | Left | Passes, Gems, Chests. Red badge = new items |
| Luck | Bottom left | Total Luck %. Multiplies rare catch chances |
| XP Bar | Bottom center | XP progress. Shows current XP Multiplier |
| Switch Fish | Bottom center | Opens fish selection. Badge = fish owned |
| End Run | Bottom right | Ends run, banks XP, resets fish size |
| Boosts | Bottom right | Opens temporary power-up menu |
| Auto Farm | Right | Free AFK auto-play feature |
| Fish Label | Above fish | Shows tier, odds, species, username, dex count |
| Net Counter | Right of XP bar | Number of fishing nets ready |

### 12.2 The Basics
- Idle collection game on Roblox
- Eat food to grow, level up, collect rare fish
- 60 species x 5 tiers = 300 collectibles
- Equip fish to use its Speed, Growth, and XP stats

### 12.3 Fish Stats
- Speed (0-100): movement speed
- Growth (0-100): size gained per food eaten
- XP Multiplier: multiplies all XP earned while equipped
- Luck %: displayed bottom-left, reduces effective catch odds

### 12.4 Fishdex Milestones
Every 10 fish collected gives: permanent Bonus Luck, permanent Growth Multiplier bonus, and Gems.
See Section 10 for full explanation.

### 12.5 Treasure Chests
- 3 fish per chest, rolled with current Luck
- Each unlocked chest gives permanent Luck increase
- ~4 hour unlock timer, skippable with Gems
- Obtained by playing or purchasing in Shop

### 12.6 Boosts (temporary, purchased with Robux)
| Boost | Effect | Duration | Cost |
|---|---|---|---|
| Luck Boost | +100% Luck | 10 min | 7 Robux |
| Growth Boost | +100% Growth | 5 min | 25 Robux |
| XP Boost | +100% XP | 10 min | 29 Robux |
| Speed Boost | +50% Speed | 5 min | 59 Robux |
| Super Luck | +1000% Luck | 30 min | 85 Robux |
| Super XP | +250% XP | 30 min | 115 Robux |

### 12.7 Passes (permanent, purchased with Robux)
| Pass | Effect | Cost |
|---|---|---|
| Lucky | +100% Luck permanently | 75 Robux |
| Fast XP | +50% XP permanently | 225 Robux |
| Double Loot | 2 fish per loot drop | 339 Robux |
| Food Magnet | Pick up food from 2x further | 375 Robux |
| Double Growth | 2x size from food | 489 Robux |

### 12.8 Gems
| Bundle | Gems | Cost |
|---|---|---|
| Small | 1,000 | 39 Robux |
| Medium | 10,000 | 225 Robux |
| Large | 50,000 | 489 Robux |
| Mega | 500,000 | 2,625 Robux |

---

## 13. Tips & Tricks Page

URL: /tips

### Getting Started
- Equip the fish with the highest XP multiplier you own
- Keep Auto Farm running when AFK
- Open Treasure Chests early — permanent Luck stacks fast

### Maximizing Luck
- Luck affects every roll — most impactful long-term stat
- Stack: Lucky Pass + Super Luck boost + chest milestones + Fishdex milestones
- Best first Robux purchase: Lucky Pass (75 Robux)

### Fishdex Milestone Strategy
- Every 10 fish = permanent Luck and Growth bonus
- Prioritize expanding your collection early
- Collecting all 300 gives the maximum permanent stat bonuses

### Treasure Chest Strategy
- Queue many chests, activate Super Luck, instant-open with Gems
- 30-min Super Luck covers a full chest queue

### Tier Crafting Strategy
- Don't craft until you have a large surplus
- Golden tier early — better XP multiplier
- Rainbow and above are long-term goals

### Best Fish Per Goal
- Fastest growth: Sort Fish Dex by Growth down
- Fastest movement: Sort Fish Dex by Speed down
- Fastest leveling: Sort Fish Dex by XP down

### Pass Priority
1. Lucky (75) — permanent Luck, best ROI
2. Fast XP (225) — faster progression
3. Double Loot (339) — doubles fish collection rate
4. Food Magnet (375) — great for AFK
5. Double Growth (489) — for leaderboard pushes

### Leaderboard Tips
- Size = Growth x food eaten x Growth boosts
- Combo: Double Growth pass + Growth Boost + high-Growth fish
- End Run when peaked — XP banks, size resets for next run

---

## 14. Technical Notes

- Site: 4 HTML files — index.html, fishdex.html, how-to-play.html, tips.html
- No build tools — plain HTML, CSS, JavaScript
- Google Fonts via CDN: Fredoka One + Nunito
- Fish images: /img/{id}-{tier}.png with onerror emoji fallback
- Host on: GitHub Pages, Netlify, Cloudflare Pages, or similar
- All fish data lives in FISH array in fishdex.html

---

## 15. Odds Format Reference

| Scale | Format example |
|---|---|
| Under 1,000 | 1 in 5 |
| Thousands | 1 in 1,200 |
| Millions | 1 in 5M |
| Billions | 1 in 3.5B |
| Trillions | 1 in 68T |

---

## 16. Open Questions

- [ ] Confirm exact Fishdex milestone table (gems per step, luck/growth increment per step)
- [ ] Any extra pages wanted (Crafting Calculator, Luck Calculator)?
- [ ] Final hosting platform / domain
- [ ] Footer credits and disclaimer wording
- [ ] Mobile responsiveness priority level

---

## 17. Complete FISH Array (paste into fishdex.html)

```javascript
const FISH = [
  {id:'01',name:'Goldfish',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 5',       speed:4.0,  growth:4.0,  xp:1.0  },
    Golden: {odds:'1 in 250',     speed:23.4, growth:23.4, xp:2.8  },
    Rainbow:{odds:'1 in 13,000',  speed:34.3, growth:34.3, xp:4.75 },
    Glowing:{odds:'1 in 630,000', speed:43.8, growth:43.8, xp:6.8  },
    Shadow: {odds:'1 in 31M',     speed:null, growth:null, xp:null },
  }},
  {id:'02',name:'Sardine',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 6',       speed:8.5,  growth:5.5,  xp:1.05 },
    Golden: {odds:'1 in 300',     speed:29.4, growth:18.4, xp:2.9  },
    Rainbow:{odds:'1 in 15,000',  speed:42.8, growth:26.9, xp:4.85 },
    Glowing:{odds:'1 in 750,000', speed:53.7, growth:33.3, xp:6.9  },
    Shadow: {odds:'1 in 38M',     speed:null, growth:null, xp:null },
  }},
  {id:'03',name:'Tetra',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 7',       speed:10.4, growth:8.5,  xp:1.15 },
    Golden: {odds:'1 in 350',     speed:28.9, growth:22.4, xp:2.95 },
    Rainbow:{odds:'1 in 18,000',  speed:40.8, growth:31.3, xp:4.9  },
    Glowing:{odds:'1 in 880,000', speed:50.7, growth:39.3, xp:6.95 },
    Shadow: {odds:'1 in 44M',     speed:null, growth:null, xp:null },
  }},
  {id:'04',name:'Herring',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 9',       speed:12.4, growth:10.4, xp:1.25 },
    Golden: {odds:'1 in 450',     speed:28.4, growth:24.4, xp:3.1  },
    Rainbow:{odds:'1 in 23,000',  speed:39.8, growth:34.3, xp:5.05 },
    Glowing:{odds:'1 in 1M',      speed:49.3, growth:42.3, xp:7.1  },
    Shadow: {odds:'1 in 56M',     speed:null, growth:null, xp:null },
  }},
  {id:'05',name:'Angelfish',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 11',      speed:13.9, growth:12.4, xp:1.35 },
    Golden: {odds:'1 in 550',     speed:28.9, growth:25.9, xp:3.2  },
    Rainbow:{odds:'1 in 28,000',  speed:39.8, growth:35.8, xp:5.15 },
    Glowing:{odds:'1 in 1M',      speed:49.3, growth:43.8, xp:7.2  },
    Shadow: {odds:'1 in 69M',     speed:null, growth:null, xp:null },
  }},
  {id:'06',name:'Tilapia',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 13',      speed:14.9, growth:14.4, xp:1.4  },
    Golden: {odds:'1 in 650',     speed:28.9, growth:28.4, xp:3.25 },
    Rainbow:{odds:'1 in 33,000',  speed:39.3, growth:38.3, xp:5.25 },
    Glowing:{odds:'1 in 1M',      speed:47.8, growth:46.8, xp:7.3  },
    Shadow: {odds:'1 in 81M',     speed:null, growth:null, xp:null },
  }},
  {id:'07',name:'Carp',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 15',      speed:13.9, growth:18.4, xp:1.45 },
    Golden: {odds:'1 in 750',     speed:24.9, growth:33.3, xp:3.35 },
    Rainbow:{odds:'1 in 38,000',  speed:33.3, growth:44.8, xp:5.3  },
    Glowing:{odds:'1 in 1M',      speed:40.8, growth:54.7, xp:7.35 },
    Shadow: {odds:'1 in 94M',     speed:null, growth:null, xp:null },
  }},
  {id:'08',name:'Sheepshead',rarity:'Common',bg:'#b8b8b8',tiers:{
    Normal: {odds:'1 in 19',      speed:23.4, growth:10.4, xp:1.6  },
    Golden: {odds:'1 in 950',     speed:40.3, growth:17.4, xp:3.45 },
    Rainbow:{odds:'1 in 48,000',  speed:53.7, growth:22.4, xp:5.45 },
    Glowing:{odds:'1 in 2M',      speed:64.7, growth:27.4, xp:7.5  },
    Shadow: {odds:'1 in 120M',    speed:null, growth:null, xp:null },
  }},
  {id:'09',name:'Starfish',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 53',      speed:5.0,  growth:26.9, xp:2.05 },
    Golden: {odds:'1 in 2,700',   speed:8.0,  growth:48.8, xp:3.95 },
    Rainbow:{odds:'1 in 130,000', speed:10.4, growth:65.7, xp:5.95 },
    Glowing:{odds:'1 in 6M',      speed:12.9, growth:79.6, xp:8.05 },
    Shadow: {odds:'1 in 330M',    speed:null, growth:null, xp:null },
  }},
  {id:'10',name:'Seahorse',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 64',      speed:26.4, growth:7.5,  xp:2.15 },
    Golden: {odds:'1 in 3,200',   speed:47.8, growth:12.4, xp:4.05 },
    Rainbow:{odds:'1 in 160,000', speed:63.7, growth:16.4, xp:6.05 },
    Glowing:{odds:'1 in 8M',      speed:77.6, growth:19.9, xp:8.15 },
    Shadow: {odds:'1 in 400M',    speed:null, growth:null, xp:null },
  }},
  {id:'11',name:'Guppy',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 77',      speed:26.4, growth:9.5,  xp:2.25 },
    Golden: {odds:'1 in 3,900',   speed:46.8, growth:15.9, xp:4.15 },
    Rainbow:{odds:'1 in 190,000', speed:62.2, growth:20.9, xp:6.15 },
    Glowing:{odds:'1 in 9M',      speed:75.6, growth:25.4, xp:8.25 },
    Shadow: {odds:'1 in 480M',    speed:null, growth:null, xp:null },
  }},
  {id:'12',name:'Tiger Barb',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 92',      speed:24.4, growth:13.9, xp:2.3  },
    Golden: {odds:'1 in 4,600',   speed:42.8, growth:23.9, xp:4.25 },
    Rainbow:{odds:'1 in 230,000', speed:56.7, growth:31.8, xp:6.25 },
    Glowing:{odds:'1 in 12M',     speed:68.7, growth:38.3, xp:8.35 },
    Shadow: {odds:'1 in 580M',    speed:null, growth:null, xp:null },
  }},
  {id:'13',name:'Bluegill',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 110',     speed:21.9, growth:18.4, xp:2.4  },
    Golden: {odds:'1 in 5,600',   speed:37.8, growth:31.3, xp:4.35 },
    Rainbow:{odds:'1 in 280,000', speed:49.8, growth:41.3, xp:6.35 },
    Glowing:{odds:'1 in 14M',     speed:60.2, growth:49.8, xp:8.45 },
    Shadow: {odds:'1 in 690M',    speed:null, growth:null, xp:null },
  }},
  {id:'14',name:'Clownfish',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 130',     speed:25.4, growth:15.4, xp:2.5  },
    Golden: {odds:'1 in 6,600',   speed:42.8, growth:25.9, xp:4.4  },
    Rainbow:{odds:'1 in 330,000', speed:56.2, growth:34.3, xp:6.45 },
    Glowing:{odds:'1 in 17M',     speed:67.7, growth:41.3, xp:8.55 },
    Shadow: {odds:'1 in 830M',    speed:null, growth:null, xp:null },
  }},
  {id:'15',name:'Parrotfish',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 160',     speed:15.4, growth:25.9, xp:2.6  },
    Golden: {odds:'1 in 8,000',   speed:25.4, growth:43.3, xp:4.5  },
    Rainbow:{odds:'1 in 400,000', speed:33.3, growth:57.2, xp:6.55 },
    Glowing:{odds:'1 in 20M',     speed:39.8, growth:68.7, xp:8.65 },
    Shadow: {odds:'1 in 990M',    speed:null, growth:null, xp:null },
  }},
  {id:'16',name:'Moorish Idol',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 190',     speed:24.9, growth:16.9, xp:2.65 },
    Golden: {odds:'1 in 9,600',   speed:41.3, growth:27.9, xp:4.6  },
    Rainbow:{odds:'1 in 480,000', speed:54.2, growth:36.8, xp:6.65 },
    Glowing:{odds:'1 in 24M',     speed:65.7, growth:43.8, xp:8.75 },
    Shadow: {odds:'1 in 1B',      speed:null, growth:null, xp:null },
  }},
  {id:'17',name:'Cichlid',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 230',     speed:19.4, growth:23.9, xp:2.75 },
    Golden: {odds:'1 in 11,000',  speed:31.8, growth:39.3, xp:4.7  },
    Rainbow:{odds:'1 in 570,000', speed:41.3, growth:51.2, xp:6.75 },
    Glowing:{odds:'1 in 29M',     speed:49.8, growth:61.7, xp:8.85 },
    Shadow: {odds:'1 in 1B',      speed:null, growth:null, xp:null },
  }},
  {id:'18',name:'Mackerel',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 280',     speed:28.4, growth:14.4, xp:2.85 },
    Golden: {odds:'1 in 14,000',  speed:46.3, growth:23.4, xp:4.8  },
    Rainbow:{odds:'1 in 690,000', speed:60.2, growth:30.3, xp:6.85 },
    Glowing:{odds:'1 in 34M',     speed:72.1, growth:36.3, xp:8.95 },
    Shadow: {odds:'1 in 1B',      speed:null, growth:null, xp:null },
  }},
  {id:'19',name:'Triggerfish',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 330',     speed:18.4, growth:26.9, xp:2.95 },
    Golden: {odds:'1 in 17,000',  speed:29.4, growth:42.8, xp:4.9  },
    Rainbow:{odds:'1 in 830,000', speed:37.8, growth:55.2, xp:6.95 },
    Glowing:{odds:'1 in 41M',     speed:45.3, growth:66.2, xp:9.05 },
    Shadow: {odds:'1 in 2B',      speed:null, growth:null, xp:null },
  }},
  {id:'20',name:'Trout',rarity:'Uncommon',bg:'#3fff2e',tiers:{
    Normal: {odds:'1 in 400',     speed:12.9, growth:30.8, xp:3.0  },
    Golden: {odds:'1 in 20,000',  speed:20.4, growth:49.3, xp:5.0  },
    Rainbow:{odds:'1 in 990,000', speed:25.9, growth:63.7, xp:7.05 },
    Glowing:{odds:'1 in 50M',     speed:30.8, growth:76.1, xp:9.15 },
    Shadow: {odds:'1 in 2B',      speed:null, growth:null, xp:null },
  }},
  {id:'21',name:'Piranha',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 560',     speed:21.9, growth:23.4, xp:3.2  },
    Golden: {odds:'1 in 28,000',  speed:36.8, growth:39.8, xp:5.15 },
    Rainbow:{odds:'1 in 1M',      speed:48.3, growth:52.2, xp:7.2  },
    Glowing:{odds:'1 in 70M',     speed:58.2, growth:63.2, xp:9.35 },
    Shadow: {odds:'1 in 3B',      speed:null, growth:null, xp:null },
  }},
  {id:'22',name:'Pufferfish',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 670',     speed:9.0,  growth:32.8, xp:3.3  },
    Golden: {odds:'1 in 34,000',  speed:14.9, growth:54.7, xp:5.25 },
    Rainbow:{odds:'1 in 1M',      speed:19.4, growth:72.1, xp:7.3  },
    Glowing:{odds:'1 in 84M',     speed:23.4, growth:86.6, xp:9.45 },
    Shadow: {odds:'1 in 4B',      speed:null, growth:null, xp:null },
  }},
  {id:'23',name:'Jellyfish',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 810',     speed:24.4, growth:22.4, xp:3.35 },
    Golden: {odds:'1 in 40,000',  speed:40.3, growth:37.3, xp:5.35 },
    Rainbow:{odds:'1 in 2M',      speed:52.7, growth:48.8, xp:7.4  },
    Glowing:{odds:'1 in 100M',    speed:63.7, growth:58.7, xp:9.55 },
    Shadow: {odds:'1 in 5B',      speed:null, growth:null, xp:null },
  }},
  {id:'24',name:'Oscar',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 970',     speed:28.9, growth:18.4, xp:3.45 },
    Golden: {odds:'1 in 49,000',  speed:47.3, growth:29.9, xp:5.45 },
    Rainbow:{odds:'1 in 2M',      speed:61.7, growth:39.3, xp:7.5  },
    Glowing:{odds:'1 in 120M',    speed:74.1, growth:47.3, xp:9.65 },
    Shadow: {odds:'1 in 6B',      speed:null, growth:null, xp:null },
  }},
  {id:'25',name:'Fairy Wrasse',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 1,200',   speed:32.3, growth:14.4, xp:3.55 },
    Golden: {odds:'1 in 58,000',  speed:52.2, growth:22.9, xp:5.55 },
    Rainbow:{odds:'1 in 2M',      speed:68.2, growth:29.9, xp:7.6  },
    Glowing:{odds:'1 in 150M',    speed:81.6, growth:36.3, xp:9.75 },
    Shadow: {odds:'1 in 7B',      speed:null, growth:null, xp:null },
  }},
  {id:'26',name:'Catfish',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 1,400',   speed:15.9, growth:31.8, xp:3.65 },
    Golden: {odds:'1 in 70,000',  speed:25.9, growth:50.7, xp:5.65 },
    Rainbow:{odds:'1 in 3M',      speed:33.8, growth:66.2, xp:7.7  },
    Glowing:{odds:'1 in 170M',    speed:40.3, growth:79.1, xp:9.8  },
    Shadow: {odds:'1 in 8B',      speed:null, growth:null, xp:null },
  }},
  {id:'27',name:'Butterflyfish',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 1,700',   speed:25.4, growth:25.4, xp:3.75 },
    Golden: {odds:'1 in 84,000',  speed:40.3, growth:40.3, xp:5.75 },
    Rainbow:{odds:'1 in 4M',      speed:51.7, growth:51.7, xp:7.8  },
    Glowing:{odds:'1 in 210M',    speed:62.2, growth:62.2, xp:9.9  },
    Shadow: {odds:'1 in 10B',     speed:null, growth:null, xp:null },
  }},
  {id:'28',name:'Cod',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 2,000',   speed:15.4, growth:33.8, xp:3.8  },
    Golden: {odds:'1 in 100,000', speed:23.9, growth:53.2, xp:5.85 },
    Rainbow:{odds:'1 in 5M',      speed:30.8, growth:68.7, xp:7.9  },
    Glowing:{odds:'1 in 250M',    speed:36.8, growth:82.1, xp:10.0 },
    Shadow: {odds:'1 in 13B',     speed:null, growth:null, xp:null },
  }},
  {id:'29',name:'Blue Tang',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 2,400',   speed:33.3, growth:17.4, xp:3.9  },
    Golden: {odds:'1 in 120,000', speed:51.7, growth:26.9, xp:5.9  },
    Rainbow:{odds:'1 in 6M',      speed:66.7, growth:34.8, xp:8.0  },
    Glowing:{odds:'1 in 300M',    speed:79.6, growth:41.3, xp:10.1 },
    Shadow: {odds:'1 in 15B',     speed:null, growth:null, xp:null },
  }},
  {id:'30',name:'Flounder',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 2,900',   speed:13.4, growth:35.8, xp:4.0  },
    Golden: {odds:'1 in 140,000', speed:20.9, growth:55.7, xp:6.0  },
    Rainbow:{odds:'1 in 7M',      speed:26.4, growth:71.6, xp:8.1  },
    Glowing:{odds:'1 in 360M',    speed:31.8, growth:85.6, xp:10.2 },
    Shadow: {odds:'1 in 18B',     speed:null, growth:null, xp:null },
  }},
  {id:'31',name:'Red Snapper',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 3,500',   speed:17.4, growth:34.8, xp:4.1  },
    Golden: {odds:'1 in 170,000', speed:26.4, growth:53.7, xp:6.1  },
    Rainbow:{odds:'1 in 8M',      speed:33.8, growth:68.7, xp:8.2  },
    Glowing:{odds:'1 in 440M',    speed:40.3, growth:81.6, xp:10.3 },
    Shadow: {odds:'1 in 22B',     speed:null, growth:null, xp:null },
  }},
  {id:'32',name:'Salmon',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 4,200',   speed:27.4, growth:27.4, xp:4.2  },
    Golden: {odds:'1 in 210,000', speed:41.8, growth:41.8, xp:6.2  },
    Rainbow:{odds:'1 in 10M',     speed:53.2, growth:53.2, xp:8.3  },
    Glowing:{odds:'1 in 520M',    speed:63.2, growth:63.2, xp:10.4 },
    Shadow: {odds:'1 in 26B',     speed:null, growth:null, xp:null },
  }},
  {id:'33',name:'Grouper',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 5,000',   speed:12.4, growth:39.8, xp:4.3  },
    Golden: {odds:'1 in 250,000', speed:18.9, growth:59.2, xp:6.3  },
    Rainbow:{odds:'1 in 13M',     speed:23.9, growth:75.1, xp:8.4  },
    Glowing:{odds:'1 in 630M',    speed:28.4, growth:89.1, xp:10.5 },
    Shadow: {odds:'1 in 31B',     speed:null, growth:null, xp:null },
  }},
  {id:'34',name:'Stingray',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 6,000',   speed:37.8, growth:15.9, xp:4.35 },
    Golden: {odds:'1 in 300,000', speed:56.7, growth:23.9, xp:6.4  },
    Rainbow:{odds:'1 in 15M',     speed:71.6, growth:30.3, xp:8.5  },
    Glowing:{odds:'1 in 750M',    speed:85.1, growth:36.3, xp:10.6 },
    Shadow: {odds:'1 in 38B',     speed:null, growth:null, xp:null },
  }},
  {id:'35',name:'Trevally',rarity:'Rare',bg:'#007bff',tiers:{
    Normal: {odds:'1 in 7,200',   speed:17.4, growth:37.8, xp:4.45 },
    Golden: {odds:'1 in 360,000', speed:25.9, growth:56.2, xp:6.5  },
    Rainbow:{odds:'1 in 18M',     speed:32.8, growth:71.1, xp:8.6  },
    Glowing:{odds:'1 in 900M',    speed:38.8, growth:84.1, xp:10.7 },
    Shadow: {odds:'1 in 45B',     speed:null, growth:null, xp:null },
  }},
  {id:'36',name:'Betta Fish',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 8,400',   speed:41.8, growth:13.4, xp:4.55 },
    Golden: {odds:'1 in 420,000', speed:64.2, growth:19.9, xp:6.55 },
    Rainbow:{odds:'1 in 21M',     speed:82.1, growth:25.4, xp:8.65 },
    Glowing:{odds:'1 in 1B',      speed:97.5, growth:30.3, xp:10.8 },
    Shadow: {odds:'1 in 52B',     speed:null, growth:null, xp:null },
  }},
  {id:'37',name:'Zebra Angelfish',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 11,000',  speed:41.8, growth:14.9, xp:4.7  },
    Golden: {odds:'1 in 540,000', speed:63.7, growth:22.4, xp:6.7  },
    Rainbow:{odds:'1 in 27M',     speed:81.1, growth:28.4, xp:8.8  },
    Glowing:{odds:'1 in 1B',      speed:96.5, growth:33.3, xp:11.0 },
    Shadow: {odds:'1 in 68B',     speed:null, growth:null, xp:null },
  }},
  {id:'38',name:'Sunfish',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 14,000',  speed:7.0,  growth:46.3, xp:4.8  },
    Golden: {odds:'1 in 710,000', speed:10.0, growth:69.2, xp:6.85 },
    Rainbow:{odds:'1 in 35M',     speed:11.9, growth:88.1, xp:8.95 },
    Glowing:{odds:'1 in 1B',      speed:14.4, growth:100.0,xp:11.1 },
    Shadow: {odds:'1 in 89B',     speed:null, growth:null, xp:null },
  }},
  {id:'39',name:'Bass',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 18,000',  speed:32.8, growth:30.8, xp:4.95 },
    Golden: {odds:'1 in 920,000', speed:48.8, growth:45.8, xp:7.0  },
    Rainbow:{odds:'1 in 46M',     speed:61.7, growth:58.2, xp:9.1  },
    Glowing:{odds:'1 in 2B',      speed:72.6, growth:68.7, xp:11.2 },
    Shadow: {odds:'1 in 120B',    speed:null, growth:null, xp:null },
  }},
  {id:'40',name:'Arowana',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 24,000',  speed:30.3, growth:35.3, xp:5.1  },
    Golden: {odds:'1 in 1M',      speed:44.3, growth:51.7, xp:7.15 },
    Rainbow:{odds:'1 in 60M',     speed:55.7, growth:65.2, xp:9.25 },
    Glowing:{odds:'1 in 3B',      speed:65.7, growth:76.6, xp:11.4 },
    Shadow: {odds:'1 in 150B',    speed:null, growth:null, xp:null },
  }},
  {id:'41',name:'Pike',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 31,000',  speed:26.9, growth:38.8, xp:5.2  },
    Golden: {odds:'1 in 1M',      speed:38.8, growth:56.7, xp:7.25 },
    Rainbow:{odds:'1 in 78M',     speed:48.8, growth:71.6, xp:9.4  },
    Glowing:{odds:'1 in 3B',      speed:57.2, growth:84.1, xp:11.5 },
    Shadow: {odds:'1 in 190B',    speed:null, growth:null, xp:null },
  }},
  {id:'42',name:'Barracuda',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 40,000',  speed:40.3, growth:27.9, xp:5.35 },
    Golden: {odds:'1 in 2M',      speed:57.2, growth:39.8, xp:7.4  },
    Rainbow:{odds:'1 in 100M',    speed:71.6, growth:49.8, xp:9.55 },
    Glowing:{odds:'1 in 5B',      speed:84.1, growth:58.2, xp:11.7 },
    Shadow: {odds:'1 in 250B',    speed:null, growth:null, xp:null },
  }},
  {id:'43',name:'Zebra Shark',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 53,000',  speed:42.3, growth:24.4, xp:5.5  },
    Golden: {odds:'1 in 2M',      speed:60.7, growth:35.3, xp:7.55 },
    Rainbow:{odds:'1 in 130M',    speed:76.1, growth:43.8, xp:9.65 },
    Glowing:{odds:'1 in 6B',      speed:89.6, growth:51.2, xp:11.8 },
    Shadow: {odds:'1 in 330B',    speed:null, growth:null, xp:null },
  }},
  {id:'44',name:'Nurse Shark',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 68,000',  speed:27.4, growth:41.8, xp:5.6  },
    Golden: {odds:'1 in 3M',      speed:38.3, growth:59.7, xp:7.7  },
    Rainbow:{odds:'1 in 170M',    speed:47.8, growth:74.1, xp:9.8  },
    Glowing:{odds:'1 in 8B',      speed:56.2, growth:87.1, xp:12.0 },
    Shadow: {odds:'1 in 430B',    speed:null, growth:null, xp:null },
  }},
  {id:'45',name:'Humphead',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 89,000',  speed:10.4, growth:51.7, xp:5.75 },
    Golden: {odds:'1 in 4M',      speed:13.9, growth:73.1, xp:7.85 },
    Rainbow:{odds:'1 in 220M',    speed:17.4, growth:90.5, xp:9.95 },
    Glowing:{odds:'1 in 11B',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 550B',    speed:null, growth:null, xp:null },
  }},
  {id:'46',name:'Thresher Shark',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 120,000', speed:45.8, growth:23.4, xp:5.9  },
    Golden: {odds:'1 in 5M',      speed:64.2, growth:32.8, xp:7.95 },
    Rainbow:{odds:'1 in 290M',    speed:79.6, growth:40.8, xp:10.1 },
    Glowing:{odds:'1 in 14B',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 720B',    speed:null, growth:null, xp:null },
  }},
  {id:'47',name:'Swordfish',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 150,000', speed:44.3, growth:26.4, xp:6.05 },
    Golden: {odds:'1 in 7M',      speed:62.2, growth:36.8, xp:8.1  },
    Rainbow:{odds:'1 in 380M',    speed:77.1, growth:45.8, xp:10.2 },
    Glowing:{odds:'1 in 19B',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 940B',    speed:null, growth:null, xp:null },
  }},
  {id:'48',name:'Tuna',rarity:'Epic',bg:'#aa00ff',tiers:{
    Normal: {odds:'1 in 200,000', speed:14.4, growth:52.2, xp:6.15 },
    Golden: {odds:'1 in 9M',      speed:19.4, growth:72.6, xp:8.25 },
    Rainbow:{odds:'1 in 490M',    speed:23.9, growth:89.6, xp:10.4 },
    Glowing:{odds:'1 in 24B',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 1T',      speed:null, growth:null, xp:null },
  }},
  {id:'49',name:'Anglerfish',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 450,000', speed:34.8, growth:40.3, xp:6.6  },
    Golden: {odds:'1 in 22M',     speed:57.7, growth:49.3, xp:6.6  },
    Rainbow:{odds:'1 in 1B',      speed:71.6, growth:61.7, xp:10.8 },
    Glowing:{odds:'1 in 56B',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 2T',      speed:null, growth:null, xp:null },
  }},
  {id:'50',name:'Eagle Ray',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 690,000', speed:55.2, growth:16.4, xp:6.85 },
    Golden: {odds:'1 in 35M',     speed:77.6, growth:22.4, xp:6.85 },
    Rainbow:{odds:'1 in 1B',      speed:96.0, growth:27.4, xp:11.1 },
    Glowing:{odds:'1 in 87B',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 4T',      speed:null, growth:null, xp:null },
  }},
  {id:'51',name:'Cobia',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 1M',      speed:37.8, growth:43.8, xp:7.05 },
    Golden: {odds:'1 in 54M',     speed:60.2, growth:52.2, xp:7.05 },
    Rainbow:{odds:'1 in 2B',      speed:73.6, growth:64.2, xp:11.3 },
    Glowing:{odds:'1 in 130B',    speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 6T',      speed:null, growth:null, xp:null },
  }},
  {id:'52',name:'Sawfish',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 1M',      speed:47.8, growth:36.8, xp:7.3  },
    Golden: {odds:'1 in 83M',     speed:49.8, growth:64.7, xp:7.3  },
    Rainbow:{odds:'1 in 4B',      speed:61.2, growth:78.6, xp:11.6 },
    Glowing:{odds:'1 in 210B',    speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 10T',     speed:null, growth:null, xp:null },
  }},
  {id:'53',name:'Hammerhead Shark',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 2M',      speed:35.8, growth:51.2, xp:7.55 },
    Golden: {odds:'1 in 130M',    speed:47.8, growth:68.7, xp:7.55 },
    Rainbow:{odds:'1 in 6B',      speed:58.2, growth:83.1, xp:11.8 },
    Glowing:{odds:'1 in 320B',    speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 16T',     speed:null, growth:null, xp:null },
  }},
  {id:'54',name:'Mako Shark',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 4M',      speed:59.7, growth:27.4, xp:7.8  },
    Golden: {odds:'1 in 200M',    speed:79.1, growth:35.8, xp:7.8  },
    Rainbow:{odds:'1 in 10B',     speed:95.0, growth:42.8, xp:12.1 },
    Glowing:{odds:'1 in 500B',    speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 25T',     speed:null, growth:null, xp:null },
  }},
  {id:'55',name:'Moonfish',rarity:'Legendary',bg:'#ffaa00',tiers:{
    Normal: {odds:'1 in 6M',      speed:49.8, growth:44.3, xp:8.0  },
    Golden: {odds:'1 in 310M',    speed:64.7, growth:57.7, xp:8.0  },
    Rainbow:{odds:'1 in 16B',     speed:null, growth:null, xp:null },
    Glowing:{odds:'1 in 780B',    speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 39T',     speed:null, growth:null, xp:null },
  }},
  {id:'56',name:'Koi',rarity:'Mythic',bg:'#ff2626',tiers:{
    Normal: {odds:'1 in 11M',     speed:40.3, growth:54.7, xp:8.3  },
    Golden: {odds:'1 in 550M',    speed:53.7, growth:72.6, xp:8.3  },
    Rainbow:{odds:'1 in 27B',     speed:null, growth:null, xp:null },
    Glowing:{odds:'1 in 1T',      speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 68T',     speed:null, growth:null, xp:null },
  }},
  {id:'57',name:'Manta Ray',rarity:'Mythic',bg:'#ff2626',tiers:{
    Normal: {odds:'1 in 19M',     speed:59.2, growth:41.8, xp:8.6  },
    Golden: {odds:'1 in 960M',    speed:77.1, growth:53.7, xp:8.6  },
    Rainbow:{odds:'1 in 48B',     speed:null, growth:null, xp:null },
    Glowing:{odds:'1 in 2T',      speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 120T',    speed:null, growth:null, xp:null },
  }},
  {id:'58',name:'Sailfish',rarity:'Mythic',bg:'#ff2626',tiers:{
    Normal: {odds:'1 in 34M',     speed:78.6, growth:14.9, xp:8.9  },
    Golden: {odds:'1 in 1B',      speed:100.0,growth:18.9, xp:8.9  },
    Rainbow:{odds:'1 in 84B',     speed:null, growth:null, xp:null },
    Glowing:{odds:'1 in 4T',      speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 210T',    speed:null, growth:null, xp:null },
  }},
  {id:'59',name:'Great White Shark',rarity:'Mythic',bg:'#ff2626',tiers:{
    Normal: {odds:'1 in 59M',     speed:55.2, growth:58.7, xp:9.25 },
    Golden: {odds:'1 in 2B',      speed:68.7, growth:73.1, xp:9.25 },
    Rainbow:{odds:'1 in 150B',    speed:null, growth:null, xp:null },
    Glowing:{odds:'1 in 7T',      speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 370T',    speed:null, growth:null, xp:null },
  }},
  {id:'60',name:'Whale Shark',rarity:'Mythic',bg:'#ff2626',tiers:{
    Normal: {odds:'1 in 100M',    speed:23.9, growth:84.6, xp:9.55 },
    Golden: {odds:'1 in 5B',      speed:null, growth:null, xp:null },
    Rainbow:{odds:'1 in 260B',    speed:null, growth:null, xp:null },
    Glowing:{odds:'1 in 13T',     speed:null, growth:null, xp:null },
    Shadow: {odds:'1 in 640T',    speed:null, growth:null, xp:null },
  }},
];
```
