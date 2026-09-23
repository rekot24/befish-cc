/**
 * Linked local file sync — IndexedDB handle storage plus File System
 * Access API writes, ported unchanged from the live site's behavior.
 * Only ever relevant on Chromium desktop (`'showSaveFilePicker' in
 * window`) and behind `featureFlags.trackerLinkedFile`; both gates are
 * checked at the call sites in `useLinkedFile`, not here.
 *
 * This file holds no persistent state of its own beyond the debounce
 * closure returned by `createLinkedFileWriter` — `useLinkedFile` (the
 * hook that wraps this file) owns `linkedFileHandle`/`linkedFileStatus`
 * as React state.
 */

import { FS_DB_NAME, FS_DB_VERSION, FS_STORE, FS_KEY, LINKED_FILE_DEBOUNCE_MS, IDB_OPEN_TIMEOUT_MS } from './trackerConfig';
import { logger } from './logger';

export const FS_ACCESS_SUPPORTED = typeof window !== 'undefined' && 'showSaveFilePicker' in window;

/* ── IndexedDB — minimal single-store helper, no library ── */
/* localStorage can't hold a FileSystemFileHandle (not JSON-serializable),
   but IndexedDB can via structured clone. */

function openFsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(FS_DB_NAME, FS_DB_VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(FS_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGetHandle(): Promise<FileSystemFileHandle | null> {
  const db = await openFsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FS_STORE, 'readonly');
    const req = tx.objectStore(FS_STORE).get(FS_KEY);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSetHandle(handle: FileSystemFileHandle): Promise<void> {
  const db = await openFsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FS_STORE, 'readwrite');
    tx.objectStore(FS_STORE).put(handle, FS_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbClearHandle(): Promise<void> {
  const db = await openFsDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FS_STORE, 'readwrite');
    tx.objectStore(FS_STORE).delete(FS_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timed out')), ms));
}

export type RestoreResult = { handle: FileSystemFileHandle; status: 'linked' | 'reconnect' } | null;

/**
 * Restores a previously linked file handle from IndexedDB, if any, and
 * checks its current permission without prompting (`queryPermission`
 * needs no user gesture — only `requestPermission` does). Races against
 * `IDB_OPEN_TIMEOUT_MS`, since `indexedDB.open()` can occasionally hang
 * without ever firing `onsuccess`/`onerror` in some restricted/edge-case
 * environments — falling through to "no linked file" is safer than
 * leaving the caller stuck forever.
 */
export async function restoreLinkedFile(): Promise<RestoreResult> {
  if (!FS_ACCESS_SUPPORTED) return null;
  try {
    const handle = await Promise.race([idbGetHandle(), timeout(IDB_OPEN_TIMEOUT_MS)]);
    if (!handle) return null;
    const perm = await handle.queryPermission({ mode: 'readwrite' });
    return { handle, status: perm === 'granted' ? 'linked' : 'reconnect' };
  } catch (err) {
    logger.warning('trackerFileSync', 'restoreLinkedFile failed, treating as unlinked', { err });
    return null;
  }
}

/** Re-requests permission on an already-known handle. Must be called from
 *  a user gesture (a click) — browsers require that for `requestPermission`,
 *  unlike `queryPermission`. */
export async function requestPermission(handle: FileSystemFileHandle): Promise<boolean> {
  const perm = await handle.requestPermission({ mode: 'readwrite' });
  return perm === 'granted';
}

/**
 * Opens the native save-file picker and stores the resulting handle in
 * IndexedDB. Must be called from a user gesture. Returns null if the user
 * cancels the picker (`AbortError`, logged at debug only — that's a
 * normal outcome, not a failure).
 */
export async function pickAndLinkFile(): Promise<FileSystemFileHandle | null> {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'befish-tracker-full-backup.json',
      types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
    });
    await idbSetHandle(handle);
    return handle;
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      logger.warning('trackerFileSync', 'link file picker error', { err });
    }
    return null;
  }
}

/** Clears the stored handle. The caller (useLinkedFile) also resets its
 *  own in-memory handle/status — this only touches IndexedDB. */
export async function unlinkFile(): Promise<void> {
  await idbClearHandle();
}

export type LinkedFileStatus = 'linked' | 'error';

export interface LinkedFileWriter {
  /** Writes immediately, bypassing the debounce — for explicit user
   *  actions (link, reconnect) and the visibility-change flush. */
  writeNow(): Promise<void>;
  /** Debounced write — what every tracker mutation should call. */
  scheduleWrite(): void;
  /** Flushes a pending debounced write immediately, if one is queued —
   *  call on `visibilitychange` → hidden so a write due right before a
   *  tab closes doesn't get lost in the debounce window. */
  flushIfPending(): void;
}

/**
 * Creates a debounced, single-in-flight writer for one linked file.
 * `getHandle`/`getData` are called fresh on every write (including a
 * queued re-run after an in-flight write finishes), so a write always
 * picks up whatever the handle/data currently are — never a stale
 * snapshot from when the write was originally scheduled.
 */
export function createLinkedFileWriter(
  getHandle: () => FileSystemFileHandle | null,
  getData: () => unknown,
  onStatusChange: (status: LinkedFileStatus) => void,
): LinkedFileWriter {
  let writeInFlight = false;
  let writeQueued = false;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function writeNow(): Promise<void> {
    const handle = getHandle();
    if (!handle) return;
    if (writeInFlight) { writeQueued = true; return; } // never overlap two writes
    writeInFlight = true;
    let status: LinkedFileStatus;
    try {
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(getData(), null, 2));
      await writable.close();
      status = 'linked';
    } catch (err) {
      // Permission revoked, file moved/deleted, etc. — don't interrupt normal tracker use.
      logger.warning('trackerFileSync', 'linked file write failed', { err });
      status = 'error';
    }
    writeInFlight = false;
    onStatusChange(status);
    if (writeQueued) {
      writeQueued = false;
      writeNow(); // one more pass to pick up whatever changed while we were writing
    }
  }

  function scheduleWrite(): void {
    if (!getHandle()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      writeNow();
    }, LINKED_FILE_DEBOUNCE_MS);
  }

  function flushIfPending(): void {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
      writeNow();
    }
  }

  return { writeNow, scheduleWrite, flushIfPending };
}
