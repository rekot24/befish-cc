/**
 * Every Fish Tracker constant in one place (web-app-framework.md Layer 13
 * — no magic numbers/strings). Each value's meaning and source is noted
 * inline. Values marked "frozen contract" must never change without a
 * migration plan — they're read/write keys against real users' browser
 * storage (see docs/project-reference.md "Fish Tracker storage contract").
 */

/* ── Storage keys (frozen contract — see CLAUDE.md Key Decisions) ── */

/** Primary localStorage key. Read and write this exact key. Never rename. */
export const STORAGE_KEY_V2 = 'befish-tracker-v2';

/** Legacy localStorage key. Read once for migration if v2 is missing.
 *  Never delete or modify it — a v1-only user must stay recoverable. */
export const STORAGE_KEY_V1 = 'befish-tracker-v1';

/** Global (not per-profile) custom-sort-lock flag. `'1'` / `'0'` strings,
 *  matching the live site exactly. Default is locked when missing. */
export const SORT_LOCK_KEY = 'befish-tracker-sort-locked';

/** New (this port). Snapshot of v2 data written just before a full-backup
 *  import replaces everything, so a bad import is always one export away
 *  from undo. See trackerStorage.ts / useTracker's import flow. */
export const PRE_IMPORT_BACKUP_KEY = 'befish-tracker-v2-preimport-backup';

/* ── Linked local file — IndexedDB handle storage ── */
/** localStorage can't hold a FileSystemFileHandle (not JSON-serializable);
 *  IndexedDB can via structured clone. Ported unchanged from the live site. */
export const FS_DB_NAME = 'befish-tracker-fs';
export const FS_DB_VERSION = 1;
export const FS_STORE = 'handles';
export const FS_KEY = 'linkedFile';

/* ── Game rule constants ── */

/** Fixed by the game itself: 50 of a tier crafts into 1 of the next tier. */
export const CRAFT_TARGET = 50;

/* ── Catch history ── */

/** Rolling window cap — oldest catches drop once a tracker exceeds this
 *  many entries. Matches the live site's `pushCatch` behavior exactly. */
export const CATCH_HISTORY_CAP = 50;

/** Below this many catches, there isn't enough data for a reliable average
 *  interval, so ETA predictions stay hidden (live: `avgIntervalMs`). */
export const MIN_CATCHES_FOR_ETA = 3;

/* ── ETA formatting ── */

/** ETAs at or beyond this far out show as a calendar date instead of a
 *  relative duration ("~3h 12m" vs "10/2/2026"). 24 hours, in ms. */
export const ETA_ABS_DATE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/** How often ETAs re-render on their own, without any user action —
 *  matches the live site's `setInterval(renderAll, 60000)`. */
export const ETA_REFRESH_INTERVAL_MS = 60000;

/* ── Linked local file sync ── */

/** Trailing debounce before a linked-file write fires, so a burst of
 *  mutations (e.g. drag-to-reorder) collapses into one write. */
export const LINKED_FILE_DEBOUNCE_MS = 400;

/** Race timeout for `indexedDB.open()` on restore — some restricted/edge
 *  environments can hang without ever firing onsuccess/onerror. */
export const IDB_OPEN_TIMEOUT_MS = 2000;

/* ── Toasts ── */

/** How long a single toast stays visible before it starts fading out. */
export const TOAST_DURATION_MS = 4200;

/** Stagger between multiple toasts firing at once (e.g. a multi-tier
 *  crafting cascade), so they don't all pop in on top of each other. */
export const TOAST_STAGGER_MS = 260;

/* ── Timestamps panel ── */

/** Row-count options for the per-tracker timestamps panel. */
export const TIMESTAMP_LIMIT_OPTIONS = [5, 10, 20, 'all'] as const;

/* ── Schema ── */

/** Written into `TrackerData.schemaVersion` on every normalize/save. */
export const SCHEMA_VERSION = 2;

/* ── Naming ── */

/** Name given to the profile created on first visit, and to the profile a
 *  v1 migration wraps its trackers into. */
export const DEFAULT_PROFILE_NAME = 'Main Account';

/** Export filename prefix, matching the live site's `downloadJSON` calls. */
export const EXPORT_FILENAME_PREFIX = 'befish-tracker';

/** Filename label used for a full multi-profile backup export. */
export const EXPORT_FULL_BACKUP_LABEL = 'full-backup';
