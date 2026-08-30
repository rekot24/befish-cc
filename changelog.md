# Be Fish Wiki — Change Log

Single running log of fixes/notes for this site, replacing the old `archive/*.md`
per-feature checklist files (21 of them had piled up, each a full re-spec of
whatever page they touched — hard to scan, lots of duplication). **Going
forward, add new entries to the top of this file instead of creating a new
`archive/*-checklist.md` file per change.**

Entry format: `## YYYY-MM-DD — Short title`, then what changed, files touched,
and any gotchas/bugs worth remembering. Full historical spec text (the
original prompts/checklists) has been condensed out — this file keeps the
*decisions and outcomes*, not the step-by-step instructions that produced them.

`archive/befish-wiki-reference.md` is **not** folded into this log — it's the
standing site reference doc (page inventory, SEO conventions, data model),
not a change record. It's stale in places (last updated March 2026, predates
the Tracker and Mechanics pages) and could use a refresh pass at some point.

---

## Checklist workflow

Claude (planning session) produces a checklist `.md` file with step-by-step
instructions. Claude Code (VSCode) runs it. After Claude Code finishes:

1. **Claude Code appends** a brief `## Implementation Notes` section to the
   bottom of the checklist file covering: what was actually changed, any
   deviations from the spec, and bugs found during implementation.
2. **You add** a condensed entry to this `changelog.md` — decisions and
   outcomes only, no find/replace snippets. You can ask Claude Code to draft
   the entry from its Implementation Notes.
3. **Delete** the checklist file. It has served its purpose.

**Never archive checklist files** — the changelog is the record. The
checklist is a disposable instruction set.

**Rule of thumb for checklist scope:** one Claude Code session per checklist.
If a change touches more than 3 files or has distinct independent parts
(e.g. card redesign vs. theme toggle), split into separate checklists so
sessions stay focused and a mistake in one doesn't block the other.

---

---

## 2026-08-20 — Section header & h3 fix

**Files:** `style.css`

Second follow-up to the theme color fixes below — the `#0090b8` teal /
`#7b2fbe` purple solid-fill section headers introduced by that entry read too
loud in light mode, and the purple ones were leaking a solid fill into dark
mode.

**Decisions made:**
- Light mode section headers switched from solid fill to a light tint +
  colored bottom border, matching dark mode's card-bg-plus-border-accent
  pattern: cyan sections `#e0f4fa` bg / `#0090b8` border, purple (even)
  sections `#f0e8fd` bg / `#7b2fbe` border. Header text moved off `--sand`/
  white onto dark, readable colors (`--ocean` teal / `#5a1a88` purple) to
  suit the lighter backgrounds.
- Root-caused and fixed a dark-mode leak: the light-mode even-section rule
  (`.section-block:nth-child(even) .section-header`, specificity 0,3,0) sets
  `background` and isn't scoped to light mode, so it was beating the dark
  mode base rule (0,2,0) and showing solid purple in dark mode. The existing
  dark-mode even-section override only set `border-bottom-color` — nothing at
  matching/higher specificity was contesting the background. Added an
  explicit `background: #0b1226` to the dark-mode even-section override to
  close the gap.
- Added `.section-body h3` styling (Nunito, 1rem, weight 800, `--text-dark`)
  so in-body h3s (e.g. "How Auto Farm Behaves") read as subheadings instead
  of inheriting the global Fredoka One h1–h4 title styling.

**Outcome:** Implemented exactly as specced, no deviations or ambiguous
matches.

**Checklist file:** `section-header-fix.md` (deleted — implementation notes
folded into this entry)

---

## 2026-08-20 — Theme fix: section headers, footer, light mode feel

**Files:** `style.css`

Targeted follow-up to the theme color fixes below — didn't touch anything
those entries didn't already flag.

**Decisions made:**
- Confirmed no `-HOME-PC` conflict copies before editing — `style.css` was
  current.
- Added a `--header-bg` / `--footer-bg` pair (mirroring `--nav-bg`) so the
  footer and section headers no longer depend on `--ocean-dark`, which had
  changed meaning (teal → navy → briefly cyan in dark mode).
- Light mode section headers now `#0090b8` teal (base) alternating with
  `#7b2fbe` purple (even section blocks), gold text on both — a light-mode
  echo of dark mode's cyan/purple alternation.
- `.info-card-val` and `.page-heading h1` moved to `--ocean` (teal) in light
  mode. (`.page-heading h1` was already on `--ocean` from the prior entry —
  this was a harmless no-op re-add.)
- Restored dark-mode `--ocean-dark` to a dark value (`#060818`) now that the
  footer no longer reads it, so any other remaining uses fall back to
  something dark rather than the bright cyan it had been temporarily set to.

**Outcome:** Implemented exactly as specced. **New known gap:** the
dark-value restore above re-exposes a dark-mode contrast issue for a few
*text-color* rules with no dark-mode override — `.text-link-btn:hover`,
`.ts-row-delta`, `.tracker-timestamps-toggle:hover`,
`.tracker-undo-btn:hover:not(:disabled)` — these will render near-black text
on dark backgrounds in dark mode. Two button-hover uses of `--ocean-dark`
(`.compare-action-btn--primary:hover`, `.profile-action-btn--primary:hover`)
are fine — they just darken an already-colored background. Needs a follow-up
dark-mode contrast pass.

**Checklist file:** `theme-header-footer-fix.md` (deleted — implementation
notes folded into this entry)

---

## 2026-08-20 — Theme color fixes (light/dark follow-up)

**Files:** `style.css`

Follow-up to the light/dark mode toggle entry below — fixed color/variable
gaps found after the initial rollout.

**Decisions made:**
- Confirmed no `-HOME-PC` conflict copies before editing (per standing
  OneDrive sync-conflict caution) — `style.css` was current.
- Light mode `:root` updated to Option 4 / Light Ocean values (cyan
  `--ocean`, navy `--ocean-dark` #0d1f3c, gold `--sand`, light blue-white
  `--page-bg` #eaf6fb, etc.).
- Dark mode block updated to Option 3 / Glowing Dual values (`--card-bg`
  #0f1a30, `--ocean-dark` repurposed to the bright cyan #00b8d9 since dark
  mode has no separate "darker ocean" need).
- Added a `--nav-bg` variable (`#0d1f3c` light / `#04080f` dark) so the nav
  bar and mobile dropdown no longer depend on `--ocean-dark`, which changed
  meaning (teal → navy) and would otherwise have broken the nav look.
- Added the missing dark-mode component block for headings, alternating
  cyan/purple section headers, fishdex stat/xp text, index page (hero,
  about, quick stats, feature cards), how-to-play gem cards, mechanics
  sidebar TOC, and tracker cards/profile tabs — these had no dark-mode
  override before and were falling back to unreadable light-mode colors.
- `.page-heading h1` switched from `--ocean-dark` to `--ocean` in light mode.

**Outcome:** Implemented exactly as specced, no deviations. **Known gap
carried forward:** several light-mode rules still reference `--ocean-dark`
(now navy instead of the old teal) that this checklist didn't touch —
`.compare-btn`, `.info-card-val`, `.pass-card-name`, `.milestone-stat-val`,
`.tracker-predict-row b`, `.ts-row-delta`, `.hero h1`, `.home-about h2`,
`.feature-card h3`, `.toast`, `.site-footer`, `.profile-tab-rename-input`.
Needs a visual pass after upload to decide if those should also move to
`--ocean`, or if navy reads fine there too.

**Checklist file:** `theme-complete-fix.md` (deleted — implementation notes
folded into this entry)

---

## 2026-08-20 — Site-wide light/dark mode theme toggle

**Files:** `style.css`, `nav.js`, all 6 HTML pages

**Decisions made:**
- Light mode = "Option 4 / Light Ocean": light blue-white page bg (`#eaf6fb`),
  white cards, cyan section headers, dark navy nav. Matches current feel with
  the game's color language injected.
- Dark mode = "Option 3 / Glowing Dual": deep navy page bg (`#070c1c`), dark
  cards (`#0b1226`), cyan/purple alternating section-header borders (cyan on
  odd sections, purple on even), dark nav.
- Toggle button in nav on all pages: cycles light ↔ dark, saves to
  `localStorage`, respects `prefers-color-scheme` as default when no saved
  preference exists. OS preference changes update the theme in real time if
  no manual preference is saved.
- Nav toggle button label: `🌙 Dark` in light mode, `☀ Light` in dark mode.
- Fish Dex cards and Tracker both need to look correct in both modes (card
  rarity backgrounds are saturated enough to hold up either way; only the
  `.fish-card-body` white panel and bar tracks need dark-mode overrides).

**Outcome:** Implemented exactly as specced — no deviations. All 6 pages got
the `#theme-toggle` button in the nav; `nav.js` got the toggle IIFE
(`befish-theme` localStorage key, OS-preference fallback + live listener);
`style.css` got all 14 dark-mode blocks. No bugs hit — canonical files were
current going in (no stray OneDrive `-HOME-PC` conflict copies). Not yet
visually verified in a browser — do a light/dark toggle pass on all 6 pages
after upload, especially Fish Dex cards and the Game Mechanics sticky
sidebar.

**Checklist file:** `theme-light-dark.md` (deleted — implementation notes
folded into this entry)

---

## 2026-08-20 — Fishdex card redesign

**Files:** `style.css`, `fishdex.html`
**Tracker page:** not visually touched (see deviation note below).

**Decisions made:**
- Card top area: rarity ingame color fills the full image area
  (already stored as `fish.bg` in `fish-data.js`, e.g. `#b8b8b8` Common,
  `#3fff2e` Uncommon, `#007bff` Rare, `#aa00ff` Epic, `#ffaa00` Legendary,
  `#ff2626` Mythic). No change to `fish-data.js`.
- Layout of top area: name/rarity/odds stacked in a left-hand column, fish
  image on the right (not the centered-full-width-name layout originally
  described here — see note below).
- Text color: white with black text-shadow outline
  (`text-shadow: 0 0 2px #000, 0 1px 2px #000`) — readable on all rarity
  backgrounds including bright Uncommon green.
- Card body below image area: white panel (`rgba(255,255,255,0.95)`) with
  existing Growth/Speed stat rows and XP row unchanged — only the XP row
  gets a subtle `rgba(0,0,0,0.04)` tint and full-bleed bottom treatment.
- Tier badge: moved from `top:10px right:10px` square badge → hovering pill
  above top-left of card (`top:-11px left:8px; border-radius:20px`), colored
  with live site tier colors (`#888888` Normal, `#c4841a` Golden, `#c43a9a`
  Rainbow, `#0f8fa0` Glowing, `#5535c4` Shadow).
- Card border: `3px solid {tier color}` replacing `1px solid var(--border)`.
- `.fish-grid` needs `overflow:visible` + `padding-top:12px` to prevent badge
  clipping.
- Uncaught fish: greyed out via existing `.all-unknown` opacity class (no
  change to that logic).
- Also fixed: missing `</head>` tag in `fishdex.html`.

**Outcome:** Implemented and browser-verified (screenshots, desktop + mobile
375px). One deviation from the checklist as written: steps 1d/1e restyle the
shared `.fish-img-wrap` base rule (new padding, `justify-content:
space-between`, rounded-top-only corners) for the fishdex redesign, but that
same class backs the fish thumbnail box on `fish-tracker.html`, which only
overrides width/height there — applied verbatim it would have shrunk,
left-aligned, and square-cornered the tracker's fish images. Added narrow
`.tracker-card-head .fish-img-wrap` / `.tracker-mobile-row .fish-img-wrap`
overrides (`padding:0; justify-content:center; border-radius:8px`) to pin the
tracker back to its pre-redesign look; verified unchanged via screenshot with
a live tracked-fish card. Also: this entry originally described the top-area
name as "centered full-width on its own line" — the checklist's actual markup
put name/rarity/odds in one left column beside the image instead, and that's
what got built.

---

## 2026-08-20 — Tips page copy cleanup

**File:** `tips.html`

- Removed the `▶ Watch` / `▶ Watch the New Player Guide` inline video links'
  `white-space:nowrap` styling and reworded them as natural inline text
  ("watch the New Player Guide", "Watch the Rainbow Betta farming video")
  instead of standalone floating buttons.
- Pulled **"Spotting Auto Farmers"** out from being an `<h3>` crammed inside
  the General Tips section body into its own top-level `section-block`
  (🤖 icon), sitting between General Tips and Pass Priority.

*(Earlier the same day, a separate pass fixed the Rainbow Betta bullet's
missing closing `</li>` tag, corrected the Pass Priority list — which had
landed with two items both numbered "2" — added the New Player Guide link,
added the "Spotting Auto Farmers" content for the first time, expanded the
AFK Auto-Farm section on `game-mechanics.html` with a "How Auto Farm
Behaves" list, and added a boost-stacking example video link to the Shop
Boosts tip box.)*

---

## 2026-08-12 — Fish Tracker: Link Local File (live sync to disk)

**Files:** `fish-tracker.html`, `style.css`

Added an opt-in "🔗 Link Local File" button (Chromium desktop only, feature-
detected via `showSaveFilePicker`) that debounce-writes the full tracker
state to a chosen local file on every `saveData()` call (~400ms debounce +
in-flight write guard so overlapping writes can't corrupt the file), with
silent reconnect-on-load via a stored `FileSystemFileHandle` in IndexedDB,
and a forced flush on `visibilitychange` so an edit right before closing the
tab isn't lost. Existing Export/Import buttons untouched as the fallback for
non-Chromium browsers.

**Bugs found & fixed during verification (both in first-draft code, caught
by actually running the page, not by reading it):**
- Reconnect-on-load had an early `return` that skipped re-showing the button
  for anyone who had never linked a file — the button silently stayed
  hidden forever for new visitors despite the API being supported.
- `indexedDB.open()` had no timeout guard; a hang (observed under `file://`
  in headless Chrome) would leave the whole feature invisible with no error.
  Fixed with a 2s `Promise.race()` timeout.

**⚠️ Important — OneDrive sync conflict discovered same day:** this feature
was originally built on top of a *stale* `fish-tracker.html`/`style.css` —
device-suffixed `-HOME-PC` conflict copies silently held ~4 already-shipped
checklists' worth of work (sort redesign, chart→"Show Timestamps" swap,
50-entry catch cap, `dateObtained`, "Next Fish" sort) that the canonical
files were missing. Caught only because the tracker visibly reverted to a
line chart. Fixed by rebuilding the canonical files from the `-HOME-PC`
copies and re-applying just the Mechanics nav link + this feature on top.
**See [[befish-onedrive-sync-conflicts]] — always check for `-HOME-PC` /
device-suffixed siblings of `fish-tracker.html`/`style.css` before trusting
the canonical file.**

---

## 2026-08-12 — New page: `game-mechanics.html`

**Files:** `game-mechanics.html` (new), `how-to-play.html`, `tips.html`,
`index.html`, `sitemap.xml`, nav block in all 6 pages

Added a sidebar-TOC + scrollspy reference page covering Growth, XP/Loot Bar,
Speed, Shop Upgrades/Boosts, Fishdex Collection Bonus, Luck & Drop Chances,
Merging & Tiers, AFK Auto-Farm, and Leaderboards — the "how the math actually
works" content that had been scattered/duplicated across How to Play and
Tips. Established a content-ownership split going forward:
- **How to Play** = onboarding/purchasing (what to click/buy)
- **Game Mechanics** = the math/numbers explainer
- **Tips & Tricks** = strategy/opinion

Removed now-duplicated content from `how-to-play.html` (cumulative crafting
totals, Fishdex Rewards section, Treasure Chests section — replaced with
cross-links) and `tips.html` (Luck Milestones info-grid, which had a wrong
**1,700% Legendary unlock threshold — corrected to 1,667%**). Added the
"Mechanics" nav link to all 6 pages and a 4th feature card to `index.html`.

**Deviations from the original spec (with reasons):**
- Fishdex entry count corrected to 60 species × **5** tiers = 300 (spec text
  said "60×6" — an arithmetic slip that contradicted every other source in
  the repo).
- Shop Upgrades section lists pass *effects* only, no Robux prices — links to
  How to Play → Passes for pricing (which itself doesn't list prices; a
  follow-up if exact current prices are ever confirmed).
- The Luck & Drop Chances table's in-between rows (100%→1,000,000%) are
  interpolated to hit known anchor facts (unlock thresholds, rarity caps,
  Mythic's 0.20% ceiling) — no source table of exact per-breakpoint numbers
  existed in the repo, so treat those rows as illustrative, not verified.

**Known bug found, not fixed (out of scope for that pass):** at ~375px
viewport width (e.g. iPhone SE) the nav bar overflows horizontally site-wide.
Reproduced on the *unmodified* `how-to-play.html` too, so it's pre-existing
and global, not something this page introduced. Worth its own pass.

---

## 2026-07-28 — "Next Fish" sort option (Fish Tracker)

**File:** `fish-tracker.html`

Added a 5th sort button, **"Next Fish"** (toggles asc/desc like Rarity/XP),
sorting tracked fish by soonest Next-Tier ETA. Fish with no ETA yet (not
enough catch history) fall back to Default (`oddsNum`, descending) order at
the end of the list. Extracted the ETA math into a shared `etaNextTierMs()`
helper used by both the card render and the new sort, so they can't drift.

---

## 2026-07-27 — Fish Tracker: ETA formatting, timestamps panel, catch cap

**Files:** `fish-tracker.html`, `style.css`

- **Absolute-date ETAs:** "Next catch ETA" / "Next tier ETA" now show a
  calendar date (e.g. "8/7/2026") once the projection is ≥24h out, instead
  of an ever-growing countdown string. Overdue/near-term values (<24h) are
  unaffected. "Avg. interval" still uses the countdown formatter.
- **Removed the per-card line chart**, replaced with a "Show Timestamps"
  toggle → collapsible panel listing catch history (2-column grid, most
  recent first, day/hour delta per row, 5/10/20/All row-count filter,
  "Date obtained" always pinned as the last row for tier-crafted trackers).
  Open/closed + limit state is in-memory only (resets to closed/5 on reload
  by design, not a bug).
- **Catch history capped at 50 entries per tracker** (rolling window, oldest
  drop off first) via a shared `pushCatch()` helper used at all 3 push sites.
- **New `dateObtained` field:** auto-created next-tier trackers (from a craft
  cascade) now stamp `dateObtained` and seed one catch entry at creation
  time instead of starting with an empty catches array — gives
  `avgIntervalMs()` an earlier reference point. Displayed count still starts
  at "0 of 50". Manually-added trackers never set this field.
- **Sort row redesigned:** 4 buttons — Default / Rarity / XP / Custom.
  Default/Rarity/XP all toggle asc↔desc in place. Custom switches to your
  saved drag order and opens a small panel with a "Custom sort lock" toggle
  (defaults **ON** for first-time users) and "Reset custom order". Dragging
  a card while unlocked sets sort mode to Custom automatically.

**Bug fixed:** first-draft CSS gave the 4 sort buttons a forced
`flex: 1 1 calc(50% - 6px)` for a tidy mobile 2×2 grid, which actually
overflowed the viewport at 390px. Fixed by dropping the fixed flex-basis and
letting buttons wrap naturally via the existing `.control-row` pattern.

**Process note for future sessions:** this pass was verified with headless
Edge driven directly over the DevTools CDP WebSocket (screenshots alone
can't prove interactive JS-only state like an open panel). If reaching for
that again: killing the disposable test browser via
`taskkill /F /IM msedge.exe` kills *every* Edge process by image name,
including a real window the user has open — target the specific PID/debug
port instead.

---

## 2026-07-24 — Fish Tracker: mobile card layout

**Files:** `fish-tracker.html`, `style.css`

Two-column card grid under 640px width (was single column), catch-history
chart hidden on mobile (canvas stays in DOM, just `display:none`), and a
separate mobile-only card-head block (name → image+badges row → "`{count}
of 50`") so the dense desktop head layout doesn't have to be reworked for
narrow screens.

**Bugs found:**
- `chrome --headless --window-size=...` silently produced a 512px viewport
  instead of the requested 360px in this environment, causing a false
  "grid blowout" on first check — re-verify narrow-viewport work by forcing
  `Emulation.setDeviceMetricsOverride` via CDP, not just a CLI flag.
- `.tracker-undo-btn` had `flex-shrink: 0`, clipping "Undo last catch" text
  at ~360–390px card widths. Fixed (mobile-only) with
  `flex-shrink: 1; min-width: 0; white-space: normal; text-align: left;` so
  the button stays on the same row as "+1 Catch" and wraps its own text
  instead of getting cut off or dropping to its own row.

---

## 2026-07-21/22 — Fish Tracker: initial build, profiles, sorting

**File:** `fish-tracker.html` (new page), `style.css`, nav block on all pages

New client-side-only page (`localStorage`, no backend) for tracking
farming/crafting progress toward the next fish tier. Landed in a few rounds:

- **v1:** single-profile tracker with `craftTarget` initially per-tracker,
  then simplified to a fixed top-level `CRAFT_TARGET = 50` constant (matches
  the game's fixed 50-of-a-tier crafting rule — one editable field removed
  as unnecessary complexity). Auto tier-up cascade: hitting 50 catches logs
  the catch, resets `count` to 0, and either creates or logs a synthetic
  catch on the next tier's tracker, cascading recursively if needed.
- **v2 (`befish-tracker-v2`):** added multi-profile support (switch/rename/
  delete/create, always keep ≥1 profile) with automatic one-time migration
  from the v1 key. Added drag-and-drop manual card reordering (SortableJS,
  not native HTML5 drag/drop — better touch support) plus a Sort Options
  panel (Default / Rarity / XP), both persisted per-profile.

**Bug fixed:** `window.prompt()` / `confirm()` / `alert()` are silent no-ops
inside VS Code's embedded preview webview — "+ New Profile" appeared to do
nothing when tested there. Replaced every native dialog site-wide with a
custom modal component (`#modal-overlay` + `showPrompt()` / `showConfirm()`
/ `showAlert()` helpers). **Any future destructive/input flow on this page
should reuse those helpers, not native dialogs.**

**Bug fixed:** the Sort Options dropdown panel initially rendered its 4
buttons stacked in a column — it inherited its trigger button's ~134px
width instead of sizing to content. Fixed with `width: max-content`.

---

## 2026-07-21 — Fishdex: filters, sorting, per-tier compare tool

**File:** `fishdex.html`, `style.css`

- Added an **"Only Show Measured Fish"** checkbox filter that hides any
  fish+tier card with all-null stats.
- Replaced 6 separate sort buttons with 4 toggling ones (Growth/Speed/XP/
  Rarity), added a hidden numeric `oddsNum` field to all 300 tier entries so
  Rarity sort works off real numbers instead of the display string.
- Added a **"⚖️ Compare Specific Fish"** panel: every species gets 5 small
  tier chips (only tiers with real measured stats are shown/selectable),
  individually toggleable, filtering the main grid down to just the checked
  fish+tier combos — composes with the existing tier/rarity toggles and
  search.

---

## 2026-07-21 — Site-wide: mobile hamburger nav, expanded footer, floating fish icon

**Files:** `index.html`, `fishdex.html`, `how-to-play.html`, `tips.html`,
`style.css`, `nav.js` (new)

- Replaced the old "just shrink the font" mobile nav with a real hamburger
  (☰→✕) that drops the nav links into a full-width vertical menu under
  768px. New shared `nav.js` handles the toggle/close-on-link-click logic
  once for all pages instead of per-page duplication.
- Expanded the one-line footer into a fuller layout: "Made & maintained by
  24rolla" + YouTube/Discord pill links + the original fan-made disclaimer.
- Gave the 🐟 nav-logo emoji a gentle floating/swimming CSS animation
  (`@keyframes swim`, 4s loop) in its own `<span class="nav-logo-fish">`.

---

## 2026-05-01 — SEO: canonical tags, og:url, Search Console

**Files:** `index.html`, `fishdex.html`, `how-to-play.html`, `tips.html`

Added `<link rel="canonical">` and `<meta property="og:url">` to all 4 pages
(prevents duplicate-content penalties between `befish.cc` and
`www.befish.cc`). `sitemap.xml`/`robots.txt` were already in place by this
point. Sitemap submission + per-URL "Request Indexing" in Search Console are
manual browser steps, not code changes — not re-tracked here.

---

## 2026-03-27 — Fishdex: sort improvements (early pass)

**File:** `fishdex.html`

Earlier sort-button pass (later superseded by the 2026-07-21 rewrite above):
consolidated 6 sort buttons down to 4 toggle-pairs, added `oddsNum` to the
data, added a Rarity sort. Superseded once the 2026-07-21 Fishdex pass
rebuilt sorting alongside the Compare tool and unmeasured-fish filter.

---

## Housekeeping notes

- **2026-08-20:** Consolidated all 21 files that had accumulated in
  `archive/` (one-off checklists, several of them multiple full re-specs of
  the same Fish Tracker feature with only trailing "Implementation Notes"
  differing) into this single file. Old checklist files removed after this
  log was confirmed to capture their outcomes; `archive/befish-wiki-reference.md`
  kept as-is (site reference doc, not a change record).
