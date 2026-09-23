'use client';

/**
 * useTracker — all Fish Tracker state and mutations. The React
 * equivalent of the live `fish-tracker.html` inline script's `data`
 * variable plus every function that mutates it. No JSX lives here.
 *
 * Hydration guard (the single most important thing in this file): the
 * hydration effect below is the ONLY place that calls `localTrackerStore
 * .load()`. Every mutation goes through `applyMutation`, which refuses
 * to persist anything until `hydrated` is true. React's first render has
 * no access to localStorage, so writing before hydration completes could
 * stomp real existing data with an in-memory-only default profile.
 * `localTrackerStore.load()` itself already never writes a fresh default
 * (see trackerStorage.ts) — this guard is the second, independent layer
 * protecting the same invariant at the call-site level.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  normalizeData, stampModified, isTrackerRenderable, makeProfile, parseImport,
  buildSingleExport, buildFullExport,
  type TrackerData, type Profile, type Tracker, type SortMode,
} from '../lib/trackerSchema';
import { cascadeFrom, orderedTrackers, genTrackId, pushCatch, fishById } from '../lib/trackerLogic';
import { localTrackerStore, writePreImportBackup } from '../lib/trackerStorage';
import { STORAGE_KEY_V2, SORT_LOCK_KEY, ETA_REFRESH_INTERVAL_MS } from '../lib/trackerConfig';
import { logger } from '../lib/logger';
import type { Tier } from '../lib/fishData';

export const TRACKER_SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'default-desc',  label: 'Default — rarest odds first' },
  { value: 'default-asc',   label: 'Default — most common first' },
  { value: 'rarity-desc',   label: 'Rarity — Mythic first' },
  { value: 'rarity-asc',    label: 'Rarity — Common first' },
  { value: 'xp-desc',       label: 'XP — high to low' },
  { value: 'xp-asc',        label: 'XP — low to high' },
  { value: 'nextfish-asc',  label: 'Next fish — soonest first' },
  { value: 'nextfish-desc', label: 'Next fish — longest wait first' },
  { value: 'manual',        label: 'Custom order (drag to reorder)' },
];

export type TimestampPanelState = { open: boolean; limit: number | 'all' };

export type ImportResult = { ok: boolean; message: string };
export type DeleteProfileResult = { ok: boolean; reason?: string };

/** Reads the sort-lock flag from localStorage. Default is locked when
 *  missing, matching the live site exactly. SSR-safe (returns the
 *  default outside the browser). */
function readStoredSortLock(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(SORT_LOCK_KEY);
  return stored === null ? true : stored === '1';
}

export function useTracker() {
  const [hydrated, setHydrated] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [data, setData] = useState<TrackerData | null>(null);
  const [sortLocked, setSortLockedState] = useState(true); // real value read on mount, see hydration effect
  const [tick, setTick] = useState(0); // bumped every 60s so ETA-derived views re-render, matching live's setInterval(renderAll, 60000)
  const [tsPanelState, setTsPanelState] = useState<Record<string, TimestampPanelState>>({});

  /** Always the latest `data`, readable synchronously inside callbacks
   *  without needing `data` in their dependency arrays (which would
   *  change identity on every mutation and defeat memoization). Written
   *  only inside effects/callbacks, never during render — every place
   *  that calls `setData` also assigns this ref in the same breath. */
  const dataRef = useRef<TrackerData | null>(null);

  /** Set by the page component once `useLinkedFile` exists, so every
   *  tracker mutation can schedule a linked-file write without the two
   *  hooks needing to know about each other's internals. Null (safe
   *  no-op) until then, and whenever no file is linked. */
  const linkedFileScheduleRef = useRef<(() => void) | null>(null);
  const setLinkedFileScheduler = useCallback((fn: (() => void) | null) => {
    linkedFileScheduleRef.current = fn;
  }, []);

  /* ── Hydration (runs once, on mount) ── */
  useEffect(() => {
    const result = localTrackerStore.load();
    if (result.ok) {
      // Reading localStorage after mount, then setting state, is the
      // standard SSR/hydration-mismatch-safe pattern (same as Nav.tsx's
      // theme read) — a lazy useState initializer would read localStorage
      // during the client's first render instead, which is worse.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(result.data);
      dataRef.current = result.data;
      if (result.source !== 'v2') {
        logger.info('useTracker', `hydrated from ${result.source}`);
      }
    } else {
      logger.error('useTracker', 'hydration failed', { error: result.error });
      setLoadError(result.error);
    }
    setSortLockedState(readStoredSortLock());
    setHydrated(true);
  }, []);

  /* ── 60s ETA refresh tick, matching live's setInterval(renderAll, 60000) ── */
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), ETA_REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  /* ── Multi-tab: another tab's write re-hydrates this one, so two open
     tabs don't silently clobber each other. New (defensive) — the live
     site had no multi-tab handling. ── */
  useEffect(() => {
    function onStorage(e: StorageEvent): void {
      if (e.key !== STORAGE_KEY_V2 || e.storageArea !== window.localStorage) return;
      const result = localTrackerStore.load();
      if (result.ok) {
        setData(result.data);
        dataRef.current = result.data;
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /**
   * Runs `mutator` against a structured-clone of the current data,
   * stamps `lastModified`, persists (save + schedule linked-file write,
   * both gated on `hydrated`), updates state, and returns whatever
   * `mutator` returned (e.g. cascade toasts). No-ops (returns undefined)
   * if there's no data yet to mutate.
   */
  const applyMutation = useCallback(<R,>(mutator: (draft: TrackerData) => R): R | undefined => {
    if (!dataRef.current) return undefined;
    const next = structuredClone(dataRef.current);
    const result = mutator(next);
    stampModified(next, next.activeProfileId);
    setData(next);
    dataRef.current = next;

    if (!hydrated) {
      logger.warning('useTracker', 'applyMutation ran before hydration completed — skipping persist (should not happen)');
      return result;
    }
    const saveResult = localTrackerStore.save(next);
    if (!saveResult.ok) {
      logger.error('useTracker', 'save failed', { error: saveResult.error });
    }
    linkedFileScheduleRef.current?.();
    return result;
  }, [hydrated]);

  /* ── Derived ── */
  const activeProfile = useMemo((): Profile | null => {
    if (!data) return null;
    return data.profiles.find(p => p.profileId === data.activeProfileId) ?? data.profiles[0] ?? null;
  }, [data]);

  const visibleTrackers = useMemo((): Tracker[] => {
    if (!activeProfile) return [];
    const renderable = activeProfile.trackedFish.filter(isTrackerRenderable);
    return orderedTrackers(renderable, activeProfile);
    // `tick` is intentionally in the deps below with no reference in the body
    // above — it only exists to force this memo to recompute every 60s so
    // ETA-based sort/display (nextfish modes, "Next catch ETA" text) stays
    // current, matching live's setInterval(renderAll, 60000).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile, tick]);

  const hiddenInvalidCount = useMemo((): number => {
    if (!activeProfile) return 0;
    return activeProfile.trackedFish.length - activeProfile.trackedFish.filter(isTrackerRenderable).length;
  }, [activeProfile]);

  /* ── Mutations ── */

  const createTracker = useCallback((fishId: string, tier: Tier, startCount: number): void => {
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      if (!profile) return;
      const fish = fishById(fishId);
      profile.trackedFish.push({
        trackId: genTrackId(), fishId, fishName: fish?.name ?? fishId, tier,
        startCount, count: startCount, catches: [],
      });
    });
  }, [applyMutation]);

  /** Adds a catch and runs the crafting cascade. Returns toast messages
   *  for the caller to display (never touches UI directly). */
  const addCatch = useCallback((trackId: string): string[] => {
    return applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      const tracker = profile?.trackedFish.find(t => t.trackId === trackId);
      if (!profile || !tracker) return [];
      tracker.count++;
      pushCatch(tracker.catches, { count: tracker.count, timestamp: new Date().toISOString() });
      const toasts: string[] = [];
      cascadeFrom(tracker, profile.trackedFish, toasts);
      return toasts;
    }) ?? [];
  }, [applyMutation]);

  const undoCatch = useCallback((trackId: string): void => {
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      const tracker = profile?.trackedFish.find(t => t.trackId === trackId);
      if (!tracker || tracker.catches.length === 0) return;
      tracker.catches.pop();
      tracker.count = Math.max(0, tracker.count - 1);
    });
  }, [applyMutation]);

  /** Deletes a tracker outright. The caller (TrackerCard) is responsible
   *  for its own confirm dialog before calling this — no confirms live
   *  in the hook layer, matching Component -> Hook -> Store. */
  const deleteTracker = useCallback((trackId: string): void => {
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      if (!profile) return;
      profile.trackedFish = profile.trackedFish.filter(t => t.trackId !== trackId);
    });
  }, [applyMutation]);

  const switchProfile = useCallback((profileId: string): void => {
    applyMutation(draft => {
      if (profileId !== draft.activeProfileId) draft.activeProfileId = profileId;
    });
  }, [applyMutation]);

  /** Creates a new profile and switches to it. Returns false (no-op) for
   *  a blank/whitespace-only name. */
  const newProfile = useCallback((name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    applyMutation(draft => {
      const profile = makeProfile(trimmed);
      draft.profiles.push(profile);
      draft.activeProfileId = profile.profileId;
    });
    return true;
  }, [applyMutation]);

  const renameProfile = useCallback((profileId: string, name: string): void => {
    const trimmed = name.trim();
    if (!trimmed) return;
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === profileId);
      if (profile) profile.profileName = trimmed;
    });
  }, [applyMutation]);

  /** Deletes a profile and everything under it. Refuses (never below 1
   *  profile) instead of the caller having to check first. Like
   *  deleteTracker, the confirm dialog belongs to the caller. */
  const deleteProfile = useCallback((profileId: string): DeleteProfileResult => {
    if (!dataRef.current) return { ok: false, reason: 'Tracker data is not loaded yet.' };
    if (dataRef.current.profiles.length <= 1) {
      return { ok: false, reason: "Can't delete the last remaining profile." };
    }
    applyMutation(draft => {
      draft.profiles = draft.profiles.filter(p => p.profileId !== profileId);
      if (draft.activeProfileId === profileId) {
        draft.activeProfileId = draft.profiles[0]?.profileId ?? draft.activeProfileId;
      }
    });
    return { ok: true };
  }, [applyMutation]);

  const setSortMode = useCallback((mode: SortMode): void => {
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      if (profile) profile.sortMode = mode;
    });
  }, [applyMutation]);

  const setManualOrder = useCallback((order: string[]): void => {
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      if (!profile) return;
      profile.manualOrder = order;
      profile.sortMode = 'manual';
    });
  }, [applyMutation]);

  const resetManualOrder = useCallback((): void => {
    applyMutation(draft => {
      const profile = draft.profiles.find(p => p.profileId === draft.activeProfileId);
      if (!profile) return;
      profile.manualOrder = [];
      if (profile.sortMode === 'manual') profile.sortMode = 'default-desc';
    });
  }, [applyMutation]);

  /** Global (not per-profile), matching the live site — persisted
   *  directly to localStorage here rather than through applyMutation,
   *  since it isn't part of TrackerData at all. */
  const setSortLocked = useCallback((locked: boolean): void => {
    setSortLockedState(locked);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SORT_LOCK_KEY, locked ? '1' : '0');
    }
  }, []);

  const exportProfile = useCallback((): { profileName: string; trackedFish: Tracker[] } | null => {
    return activeProfile ? buildSingleExport(activeProfile) : null;
  }, [activeProfile]);

  const exportAll = useCallback((): TrackerData | null => {
    return dataRef.current ? buildFullExport(dataRef.current) : null;
  }, []);

  /**
   * Handles both import shapes. A full-backup import writes a pre-import
   * backup first (the caller must have already shown the danger confirm
   * — same "Replace All Data" flow as live), then replaces everything. A
   * single-profile import is added as a new profile with the live
   * site's `(2)`, `(3)` name de-dupe.
   */
  const importFile = useCallback((json: unknown): ImportResult => {
    const parsed = parseImport(json);

    if (parsed.kind === 'invalid') {
      return { ok: false, message: 'That file does not look like a Fish Tracker export.' };
    }

    if (parsed.kind === 'full') {
      if (dataRef.current) {
        const backupResult = writePreImportBackup(dataRef.current);
        if (!backupResult.ok) {
          logger.error('useTracker', 'pre-import backup failed — proceeding with import anyway', { error: backupResult.error });
        }
      }
      const normalized = normalizeData(structuredClone(parsed.data));
      setData(normalized);
      dataRef.current = normalized;
      if (hydrated) {
        const saveResult = localTrackerStore.save(normalized);
        if (!saveResult.ok) logger.error('useTracker', 'save failed after full import', { error: saveResult.error });
        linkedFileScheduleRef.current?.();
      }
      return { ok: true, message: 'Backup imported. A pre-import copy of your previous data was kept.' };
    }

    // Single-profile import.
    const message = applyMutation(draft => {
      let name = parsed.profileName || 'Imported Profile';
      const existingNames = new Set(draft.profiles.map(p => p.profileName));
      if (existingNames.has(name)) {
        let n = 2;
        while (existingNames.has(`${name} (${n})`)) n++;
        name = `${name} (${n})`;
      }
      const profile = makeProfile(name, parsed.trackedFish);
      draft.profiles.push(profile);
      draft.activeProfileId = profile.profileId;
      return `Imported as new profile "${name}".`;
    });
    return message ? { ok: true, message } : { ok: false, message: 'Import failed — tracker data was not loaded yet.' };
  }, [applyMutation, hydrated]);

  /* ── Timestamp panel — in-memory only, not persisted, matching live ── */

  const getTimestampState = useCallback((trackId: string): TimestampPanelState => {
    return tsPanelState[trackId] ?? { open: false, limit: 5 };
  }, [tsPanelState]);

  const toggleTimestamps = useCallback((trackId: string): void => {
    setTsPanelState(prev => ({
      ...prev,
      [trackId]: { open: !(prev[trackId]?.open ?? false), limit: prev[trackId]?.limit ?? 5 },
    }));
  }, []);

  const setTimestampLimit = useCallback((trackId: string, limit: number | 'all'): void => {
    setTsPanelState(prev => ({
      ...prev,
      [trackId]: { open: prev[trackId]?.open ?? false, limit },
    }));
  }, []);

  return {
    /* state */
    hydrated, loadError, data, sortLocked,
    /* derived */
    activeProfile, visibleTrackers, hiddenInvalidCount,
    /* mutations */
    createTracker, addCatch, undoCatch, deleteTracker,
    switchProfile, newProfile, renameProfile, deleteProfile,
    setSortMode, setManualOrder, resetManualOrder, setSortLocked,
    importFile, exportProfile, exportAll,
    /* timestamps panel (per-card, in-memory) */
    getTimestampState, toggleTimestamps, setTimestampLimit,
    /* linked-file wiring, set by the page once useLinkedFile exists */
    setLinkedFileScheduler,
  };
}
