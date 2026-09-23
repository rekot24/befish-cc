/**
 * Pure Fish Tracker logic, ported line-for-line from the live
 * `fish-tracker.html` inline script — no React, no storage access.
 * Behavior is unchanged except where noted: sort/ETA metrics use a
 * defensive fallback (with a dev-only `logger.error`) instead of the live
 * page's implicit assumption that every tracker's `fishId`/`tier` is
 * valid, since this port explicitly excludes unrenderable trackers from
 * display rather than crashing (see `trackerSchema.ts`'s
 * `isTrackerRenderable`). Callers are still expected to pre-filter with
 * `isTrackerRenderable` before calling `orderedTrackers` — the fallback
 * here is a safety net if that contract is ever violated, not a license
 * to skip pre-filtering.
 */

import { FISH, TIERS, RARITY_ORDER, type Fish, type Tier } from './fishData';
import type { Tracker, Profile, CatchEntry } from './trackerSchema';
import { CRAFT_TARGET, CATCH_HISTORY_CAP, MIN_CATCHES_FOR_ETA, ETA_ABS_DATE_THRESHOLD_MS } from './trackerConfig';
import { logger } from './logger';

/** Looks up a fish by id from the static game data. */
export function fishById(fishId: string): Fish | undefined {
  return FISH.find(f => f.id === fishId);
}

/** The tier one step up from `tier`, or null if already at the top (Shadow). */
export function nextTierOf(tier: Tier): Tier | null {
  const i = TIERS.indexOf(tier);
  return i >= 0 && i < TIERS.length - 1 ? TIERS[i + 1] : null;
}

/** Formats a duration in ms as "Xd Yh" / "Xh Ym" / "Xm Ys" / "Xs", with an
 *  "overdue by ~" prefix for negative durations and "~" otherwise. */
export function fmtDuration(ms: number): string {
  const neg = ms < 0;
  const abs = Math.abs(ms);
  const s = Math.floor(abs / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  let out: string;
  if (days > 0) out = `${days}d ${hours}h`;
  else if (hours > 0) out = `${hours}h ${mins}m`;
  else if (mins > 0) out = `${mins}m ${secs}s`;
  else out = `${secs}s`;
  return (neg ? 'overdue by ~' : '~') + out;
}

/** Formats an ETA: a calendar date once it's far enough out
 *  (`ETA_ABS_DATE_THRESHOLD_MS`), otherwise a relative duration. */
export function fmtETA(etaMs: number): string {
  if (etaMs >= ETA_ABS_DATE_THRESHOLD_MS) {
    const target = new Date(Date.now() + etaMs);
    return target.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  }
  return fmtDuration(etaMs);
}

/** Average interval between consecutive catches, or null below
 *  `MIN_CATCHES_FOR_ETA` catches (not enough data for a reliable average). */
export function avgIntervalMs(catches: CatchEntry[]): number | null {
  if (catches.length < MIN_CATCHES_FOR_ETA) return null;
  const times = catches.map(c => new Date(c.timestamp).getTime()).sort((a, b) => a - b);
  let total = 0;
  for (let i = 1; i < times.length; i++) total += times[i] - times[i - 1];
  return total / (times.length - 1);
}

/** Estimated time until this tracker completes its current tier, based on
 *  its own average catch interval. Null when there isn't enough history. */
export function etaNextTierMs(tracker: Tracker): number | null {
  const avg = avgIntervalMs(tracker.catches);
  if (avg === null) return null;
  const lastCatch = tracker.catches[tracker.catches.length - 1];
  const lastTs = new Date(lastCatch.timestamp).getTime();
  const remaining = Math.max(0, CRAFT_TARGET - tracker.count);
  const now = Date.now();
  return (avg * remaining) - (now - lastTs);
}

/**
 * Estimated time until this tracker's *next single catch* (not the whole
 * tier), based on its own average catch interval. Null under the same
 * condition as `avgIntervalMs`. Pulled out as its own function (rather
 * than inlined where it's used) specifically so the `Date.now()` call
 * lives in a plain utility, not textually inside a component's render
 * body — React's purity rules flag impure calls in render directly.
 */
export function etaNextCatchMs(tracker: Tracker): number | null {
  const avg = avgIntervalMs(tracker.catches);
  if (avg === null) return null;
  const lastCatch = tracker.catches[tracker.catches.length - 1];
  const lastTs = new Date(lastCatch.timestamp).getTime();
  return (lastTs + avg) - Date.now();
}

/** Appends a catch entry, trimming the oldest entries past
 *  `CATCH_HISTORY_CAP` — mutates `catches` in place, matching live. */
export function pushCatch(catches: CatchEntry[], entry: CatchEntry): void {
  catches.push(entry);
  if (catches.length > CATCH_HISTORY_CAP) catches.splice(0, catches.length - CATCH_HISTORY_CAP);
}

function findTrackerIn(trackedFish: Tracker[], fishId: string, tier: Tier): Tracker | undefined {
  return trackedFish.find(t => t.fishId === fishId && t.tier === tier);
}

/**
 * Recursive auto tier-up: while a tracker's count has reached
 * `CRAFT_TARGET`, it rolls over into (or creates) the next tier's
 * tracker, seeding it with one catch and a `dateObtained`. Mutates
 * `tracker` and `trackedFish` in place and appends a toast message per
 * craft instead of touching any UI directly — the caller displays them.
 */
export function cascadeFrom(tracker: Tracker, trackedFish: Tracker[], toasts: string[]): void {
  while (tracker.count >= CRAFT_TARGET) {
    tracker.count -= CRAFT_TARGET;
    const nextTier = nextTierOf(tracker.tier);
    if (!nextTier) break;

    let nextTracker = findTrackerIn(trackedFish, tracker.fishId, nextTier);
    if (!nextTracker) {
      const now = new Date().toISOString();
      nextTracker = {
        trackId: genTrackId(), fishId: tracker.fishId, fishName: tracker.fishName,
        tier: nextTier, startCount: 0, count: 0,
        catches: [{ count: 0, timestamp: now }],
        dateObtained: now,
      };
      trackedFish.push(nextTracker);
      toasts.push(`🎉 Crafted 1 ${nextTier} ${tracker.fishName}! Now tracking ${nextTier} tier.`);
      // no cascadeFrom() call needed here — count is 0, can't already be ≥ CRAFT_TARGET
    } else {
      nextTracker.count++;
      pushCatch(nextTracker.catches, { count: nextTracker.count, timestamp: new Date().toISOString() });
      toasts.push(`🎉 Crafted 1 ${nextTier} ${tracker.fishName}!`);
      cascadeFrom(nextTracker, trackedFish, toasts);
    }
  }
}

/** Alphabetical by fish name, then tier order — the fallback sort and the
 *  base for manual order's "newly tracked fish land at the bottom." */
export function alphabeticalOrder(trackers: Tracker[]): Tracker[] {
  return [...trackers].sort((a, b) => {
    const ni = a.fishName.localeCompare(b.fishName);
    return ni !== 0 ? ni : TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier);
  });
}

/** Rarity-sort index for a tracker's fish, defaulting unrenderable
 *  trackers to "sort last" instead of throwing — see file header. */
function safeRarityIndex(t: Tracker): number | null {
  const fish = fishById(t.fishId);
  if (!fish) {
    logger.error('trackerLogic', 'orderedTrackers received a tracker with an unknown fishId — should have been pre-filtered by isTrackerRenderable', { fishId: t.fishId });
    return null;
  }
  return RARITY_ORDER.indexOf(fish.rarity);
}

/**
 * Orders a profile's trackers according to `profile.sortMode`. Every mode
 * from the live site is supported, including: null-metric handling (nulls
 * sort last), `nextfish` putting no-ETA trackers last using the
 * default-desc fallback order, and `manual` falling back to alphabetical
 * with newly-tracked fish appended at the end.
 */
export function orderedTrackers(trackers: Tracker[], profile: Profile): Tracker[] {
  const mode = profile.sortMode || 'default-desc';

  if (mode === 'nextfish-asc' || mode === 'nextfish-desc') {
    const desc = mode === 'nextfish-desc';
    const withEta: { t: Tracker; eta: number }[] = [];
    const withoutEta: Tracker[] = [];
    trackers.forEach(t => {
      const eta = etaNextTierMs(t);
      if (eta === null) withoutEta.push(t);
      else withEta.push({ t, eta });
    });
    withEta.sort((a, b) => (desc ? b.eta - a.eta : a.eta - b.eta));

    // No-ETA fish fall back to the current Default sort (oddsNum, desc)
    const fallbackSorted = [...withoutEta].sort((a, b) => {
      const av = fishById(a.fishId)?.tiers[a.tier]?.oddsNum ?? null;
      const bv = fishById(b.fishId)?.tiers[b.tier]?.oddsNum ?? null;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return bv - av; // matches default-desc direction
    });

    return [...withEta.map(x => x.t), ...fallbackSorted];
  }

  const metricSorts: Record<string, { metric: (t: Tracker) => number | null; desc: boolean }> = {
    'default-desc': { metric: t => fishById(t.fishId)?.tiers[t.tier]?.oddsNum ?? null, desc: true },
    'default-asc':  { metric: t => fishById(t.fishId)?.tiers[t.tier]?.oddsNum ?? null, desc: false },
    'rarity-desc':  { metric: safeRarityIndex, desc: true },
    'rarity-asc':   { metric: safeRarityIndex, desc: false },
    'xp-desc':      { metric: t => fishById(t.fishId)?.tiers[t.tier]?.xp ?? null, desc: true },
    'xp-asc':       { metric: t => fishById(t.fishId)?.tiers[t.tier]?.xp ?? null, desc: false },
  };

  if (metricSorts[mode]) {
    const { metric, desc } = metricSorts[mode];
    return [...trackers].sort((a, b) => {
      const av = metric(a), bv = metric(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return desc ? bv - av : av - bv;
    });
  }

  // 'manual': saved drag order, falls back to alphabetical if empty/unset,
  // newly-tracked fish not yet in manualOrder land at the bottom
  const alphabetical = alphabeticalOrder(trackers);
  if (mode === 'manual') {
    if (!profile.manualOrder || profile.manualOrder.length === 0) return alphabetical;
    const byId = new Map(trackers.map(t => [t.trackId, t]));
    const ordered = profile.manualOrder.filter(id => byId.has(id)).map(id => byId.get(id)!);
    const orderedIds = new Set(ordered.map(t => t.trackId));
    const rest = alphabetical.filter(t => !orderedIds.has(t.trackId));
    return [...ordered, ...rest];
  }

  return alphabetical; // safety fallback, shouldn't normally hit this
}

/** Formats an ISO timestamp for display, e.g. "9/23/2026, 2:14 PM". */
export function fmtTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

/** Formats a delta between two catches as "Xd Yh" or "Xh". */
export function fmtDeltaDaysHours(ms: number): string {
  const totalHours = Math.round(ms / (60 * 60 * 1000));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

export type TimestampRow = {
  /** Formatted display timestamp. */
  time: string;
  /** Formatted delta to the next-older catch, or null (renders as "—"),
   *  unless `obtained` is set, in which case the UI shows "Date obtained"
   *  in that slot instead. */
  delta: string | null;
  /** True only for the pinned row representing `tracker.dateObtained`. */
  obtained?: boolean;
};

/**
 * Builds timestamp-panel rows for a tracker, newest first, limited to
 * `limit` rows (or all of them). Returns data, not HTML — the component
 * renders it. The pinned "Date obtained" row (if present) is always
 * appended last, regardless of `limit`, matching the live site.
 */
export function timestampRows(tracker: Tracker, limit: number | 'all'): TimestampRow[] {
  const sorted = [...tracker.catches].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const limited = limit === 'all' ? sorted : sorted.slice(0, limit);

  const rows: TimestampRow[] = limited.map((c, i) => {
    const older = sorted[i + 1]; // one position further down the full (unsliced) list
    const delta = older ? new Date(c.timestamp).getTime() - new Date(older.timestamp).getTime() : null;
    return { time: fmtTimestamp(c.timestamp), delta: delta === null ? null : fmtDeltaDaysHours(delta) };
  });

  if (tracker.dateObtained) {
    rows.push({ time: fmtTimestamp(tracker.dateObtained), delta: null, obtained: true });
  }

  return rows;
}

/** Lowercase, hyphenated, alphanumeric-only slug for export filenames. */
export function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'profile';
}

/** Today's date as YYYY-MM-DD, for export filenames. */
export function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Generates a profile id in the frozen `p_<ms>_<rand6>` format. */
export function genProfileId(): string {
  return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

/** Generates a tracker id in the frozen `t_<ms>_<rand6>` format. */
export function genTrackId(): string {
  return 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}
