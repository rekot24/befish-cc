/**
 * The localStorage adapter for Fish Tracker data — and the seam Phase 7's
 * Supabase store will plug into behind the same `TrackerStore` interface,
 * without any caller (useTracker) needing to change. This is the only
 * file that touches `localStorage` for tracker data (trackerFileSync.ts
 * owns the separate linked-local-file / IndexedDB path).
 */

import { STORAGE_KEY_V1, STORAGE_KEY_V2, PRE_IMPORT_BACKUP_KEY, DEFAULT_PROFILE_NAME } from './trackerConfig';
import { migrateV1, makeProfile, normalizeData, type TrackerData, type V1Data } from './trackerSchema';
import { logger } from './logger';

export type LoadResult =
  | { ok: true; data: TrackerData; source: 'v2' | 'v1-migrated' | 'first-visit' }
  | { ok: false; error: string };

export type SaveResult = { ok: true } | { ok: false; error: string };

export interface TrackerStore {
  load(): LoadResult;
  save(data: TrackerData): SaveResult;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const localTrackerStore: TrackerStore = {
  /**
   * Load order: v2 (primary), then a one-time v1 migration (writes v2,
   * leaves v1 untouched), then an in-memory-only first-visit default.
   * Corrupt JSON at either key is never overwritten — it's surfaced as a
   * load error instead, so a parsing bug can't silently wipe real data.
   */
  load(): LoadResult {
    if (!isBrowser()) {
      return { ok: false, error: 'localStorage is not available in this environment' };
    }

    // v2 (primary)
    const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2 !== null) {
      try {
        const parsed = JSON.parse(rawV2) as TrackerData;
        if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
          return { ok: true, data: normalizeData(parsed), source: 'v2' };
        }
        logger.error('trackerStorage', 'v2 storage parsed but has an unexpected shape — leaving it untouched');
        return { ok: false, error: 'Saved tracker data is in an unexpected format.' };
      } catch (err) {
        // Corrupt JSON — never overwrite it. Surface an error state instead.
        logger.error('trackerStorage', 'v2 storage is corrupt JSON — leaving it untouched', { err });
        return { ok: false, error: 'Saved tracker data could not be read (corrupt JSON).' };
      }
    }

    // v1 → v2 migration (one-time)
    const rawV1 = window.localStorage.getItem(STORAGE_KEY_V1);
    if (rawV1 !== null) {
      try {
        const parsedV1 = JSON.parse(rawV1) as V1Data;
        if (parsedV1 && Array.isArray(parsedV1.trackedFish)) {
          const migrated = migrateV1(parsedV1);
          // The one load-time write this store makes: it's a migration of
          // real data the user already had, not a fresh default profile.
          // v1 itself is left in place, untouched, on purpose.
          window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
          return { ok: true, data: normalizeData(migrated), source: 'v1-migrated' };
        }
      } catch (err) {
        logger.error('trackerStorage', 'v1 storage is corrupt JSON — leaving it untouched', { err });
        // Fall through to first-visit; v1 stays exactly as it was.
      }
    }

    // First-ever visit: default profile built in memory only. Never written
    // here — only the caller's first real user mutation may persist it, once
    // hydration has completed (see useTracker's hydration guard). Writing it
    // during load would risk racing ahead of a slow real load and stomping
    // existing data with an empty profile — the single most important
    // failure mode this store exists to prevent.
    const profile = makeProfile(DEFAULT_PROFILE_NAME);
    const fresh: TrackerData = { activeProfileId: profile.profileId, profiles: [profile] };
    return { ok: true, data: normalizeData(fresh), source: 'first-visit' };
  },

  /**
   * Writes v2. Quota-exceeded and privacy-mode errors are caught and
   * returned as a result rather than thrown or silently swallowed — the
   * UI shows a non-blocking warning either way.
   */
  save(data: TrackerData): SaveResult {
    if (!isBrowser()) {
      return { ok: false, error: 'localStorage is not available in this environment' };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(data));
      return { ok: true };
    } catch (err) {
      logger.error('trackerStorage', 'save failed (quota exceeded or privacy mode)', { err });
      return { ok: false, error: 'Could not save — your browser storage may be full or restricted.' };
    }
  },
};

/**
 * Snapshots current v2 data to a separate backup key before a full-backup
 * import replaces everything, so a bad import is always one export away
 * from recoverable. Called by useTracker's import flow, after the danger
 * confirm and before the replace.
 */
export function writePreImportBackup(data: TrackerData): SaveResult {
  if (!isBrowser()) {
    return { ok: false, error: 'localStorage is not available in this environment' };
  }
  try {
    window.localStorage.setItem(PRE_IMPORT_BACKUP_KEY, JSON.stringify(data));
    return { ok: true };
  } catch (err) {
    logger.error('trackerStorage', 'pre-import backup write failed', { err });
    return { ok: false, error: 'Could not write pre-import backup.' };
  }
}

// TODO(Phase 7): supabaseTrackerStore goes here, implementing this same
// TrackerStore interface so useTracker doesn't need to change. Its load()
// pulls from Supabase first, falling back to localTrackerStore.load() if
// unreachable; its save() writes to Supabase and resolves conflicts
// against whatever's already there using `lastModified` (last-write-wins).
