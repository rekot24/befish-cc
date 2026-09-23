/**
 * Fish Tracker data model: types, plus pure normalization and migration
 * functions. No React, no storage access — trackerStorage.ts is the only
 * file that touches localStorage/IndexedDB. Every function has a JSDoc
 * before its implementation, per the standing "docstring first" rule.
 *
 * Schema rule — additive only (see docs/project-reference.md "Fish
 * Tracker storage contract"): new fields may be added, but existing
 * fields must never be removed, renamed, or retyped, and unknown fields
 * must survive a round trip untouched. This keeps rollback to the old
 * static site safe, since old code simply ignores fields it doesn't know.
 */

import { FISH, TIERS, type Tier } from './fishData';
import { genProfileId } from './trackerLogic';
import { DEFAULT_PROFILE_NAME, SCHEMA_VERSION } from './trackerConfig';

export type CatchEntry = {
  count: number;
  /** ISO string, unchanged from the live site's `new Date().toISOString()`. */
  timestamp: string;
};

export type Tracker = {
  trackId: string;
  fishId: string;
  fishName: string;
  tier: Tier;
  startCount: number;
  count: number;
  catches: CatchEntry[];
  /** Only present on trackers created by a crafting cascade. */
  dateObtained?: string;
  /** Preserves unknown/legacy fields on round-trip (e.g. the old
   *  per-tracker `craftTarget`) — never drop what we don't recognize. */
  [legacy: string]: unknown;
};

export type SortMode =
  | 'default-desc' | 'default-asc'
  | 'rarity-desc' | 'rarity-asc'
  | 'xp-desc' | 'xp-asc'
  | 'nextfish-desc' | 'nextfish-asc'
  | 'manual';

export type Profile = {
  profileId: string;
  profileName: string;
  createdAt: string;
  sortMode: SortMode;
  manualOrder: string[];
  trackedFish: Tracker[];
  /** NEW (additive) — Unix ms, for Phase 7 last-write-wins conflict resolution. */
  lastModified?: number;
};

export type TrackerData = {
  activeProfileId: string;
  profiles: Profile[];
  /** NEW (additive). */
  schemaVersion?: number;
  /** NEW (additive) — Unix ms. */
  lastModified?: number;
};

/** A v1 export/localStorage shape: a single flat tracker list, no profiles. */
export type V1Data = { trackedFish: Tracker[] };

export type ParsedImport =
  | { kind: 'full'; data: TrackerData }
  | { kind: 'single'; profileName: string | undefined; trackedFish: Tracker[] }
  | { kind: 'invalid' };

/** Builds a new empty profile with the given name and (optional) trackers,
 *  matching the live site's `makeProfile`. */
export function makeProfile(name: string, trackedFish?: Tracker[]): Profile {
  return {
    profileId: genProfileId(),
    profileName: name,
    createdAt: new Date().toISOString(),
    sortMode: 'default-desc',
    manualOrder: [],
    trackedFish: trackedFish ?? [],
  };
}

/**
 * Defensive, non-destructive normalization. Reproduces the live
 * `normalizeProfiles` behavior (sortMode/manualOrder defaults) and adds
 * safe defaults on top (`catches`, `activeProfileId` repair,
 * `schemaVersion`). Never drops data — only fills gaps.
 */
export function normalizeData(raw: TrackerData): TrackerData {
  for (const profile of raw.profiles) {
    if (!profile.sortMode || (profile.sortMode as string) === 'default') {
      profile.sortMode = 'default-desc';
    }
    if (!Array.isArray(profile.manualOrder)) {
      profile.manualOrder = [];
    }
    for (const tracker of profile.trackedFish) {
      if (!Array.isArray(tracker.catches)) {
        tracker.catches = [];
      }
    }
  }

  if (!raw.profiles.some(p => p.profileId === raw.activeProfileId)) {
    raw.activeProfileId = raw.profiles[0]?.profileId ?? raw.activeProfileId;
  }

  raw.schemaVersion = SCHEMA_VERSION;

  return raw;
}

/**
 * A tracker is renderable only if it points at real game data — an
 * unknown `fishId` or invalid `tier` means the underlying tracker stays
 * in storage untouched (never dropped), but it's excluded from the
 * rendered grid. Callers are responsible for logging a warning and
 * surfacing a "N tracker(s) couldn't be displayed" notice — this
 * function only answers the yes/no question.
 */
export function isTrackerRenderable(tracker: Tracker): boolean {
  const fishExists = FISH.some(f => f.id === tracker.fishId);
  const tierValid = (TIERS as readonly string[]).includes(tracker.tier);
  return fishExists && tierValid;
}

/**
 * Wraps a v1 flat tracker list into a single `'Main Account'` profile,
 * matching the live site's migration path exactly. The caller is
 * responsible for leaving the v1 storage key untouched — this function
 * only builds the v2 shape in memory.
 */
export function migrateV1(v1: V1Data): TrackerData {
  const profile = makeProfile(DEFAULT_PROFILE_NAME, v1.trackedFish);
  return { activeProfileId: profile.profileId, profiles: [profile] };
}

/**
 * Classifies an arbitrary parsed-JSON import as a full multi-profile
 * backup, a single-profile export, or not a tracker export at all. Pure
 * classification only — the 'Imported Profile' name fallback and
 * existing-name de-dupe suffix live in the hook layer, since de-dupe
 * needs to know about profiles already in memory.
 */
export function parseImport(json: unknown): ParsedImport {
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>;
    if (Array.isArray(obj.profiles)) {
      return { kind: 'full', data: json as TrackerData };
    }
    if (Array.isArray(obj.trackedFish)) {
      return {
        kind: 'single',
        profileName: typeof obj.profileName === 'string' ? obj.profileName : undefined,
        trackedFish: obj.trackedFish as Tracker[],
      };
    }
  }
  return { kind: 'invalid' };
}

/** Single-profile export shape — byte-shape identical to the live site's
 *  Export Profile button, so files move freely between old and new sites. */
export function buildSingleExport(profile: Profile): { profileName: string; trackedFish: Tracker[] } {
  return { profileName: profile.profileName, trackedFish: profile.trackedFish };
}

/** Full-backup export shape — identical to the live site's Export All
 *  Profiles button (the whole in-memory `data` object). */
export function buildFullExport(data: TrackerData): TrackerData {
  return data;
}

/**
 * Stamps `lastModified` (Unix ms) on both the given profile and the data
 * root, mutating in place — matching the live site's direct-mutation
 * style. Every mutation in useTracker calls this before saving, so
 * Phase 7's Supabase sync has a last-write-wins timestamp to compare.
 */
export function stampModified(data: TrackerData, profileId: string): TrackerData {
  const now = Date.now();
  const profile = data.profiles.find(p => p.profileId === profileId);
  if (profile) profile.lastModified = now;
  data.lastModified = now;
  return data;
}
