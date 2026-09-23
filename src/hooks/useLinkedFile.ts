'use client';

/**
 * useLinkedFile — wraps trackerFileSync's IndexedDB/File System Access
 * logic as React state: exposes status, the current linked filename, and
 * separate link/reconnect/unlink actions. Restores a previously linked
 * file on mount and flushes a pending debounced write when the tab is
 * hidden. Chromium desktop only, and gated on `featureFlags
 * .trackerLinkedFile` — everywhere else `supported` is false and every
 * action is a no-op.
 *
 * Confirming "unlink" with the user is the caller's job (a modal, which
 * is a UI concern), not this hook's — this only performs the unlink once
 * asked, matching Component -> Hook -> Store.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FS_ACCESS_SUPPORTED, restoreLinkedFile, requestPermission, pickAndLinkFile, unlinkFile,
  createLinkedFileWriter, type LinkedFileWriter, type LinkedFileStatus as WriteOutcome,
} from '../lib/trackerFileSync';
import { featureFlags } from '../lib/featureFlags';
import { logger } from '../lib/logger';

export type LinkedFileState = 'unlinked' | 'linked' | 'reconnect' | 'error';

export function useLinkedFile(getData: () => unknown) {
  const [status, setStatus] = useState<LinkedFileState>('unlinked');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleRef = useRef<FileSystemFileHandle | null>(null);
  const writerRef = useRef<LinkedFileWriter | null>(null);

  // Keep the data getter "live" without recreating the writer every render.
  // Synced from an effect (not during render) — a write reading this a
  // moment stale is harmless, unlike writing to a ref during render.
  const getDataRef = useRef(getData);
  useEffect(() => {
    getDataRef.current = getData;
  }, [getData]);

  const supported = FS_ACCESS_SUPPORTED && featureFlags.trackerLinkedFile;

  useEffect(() => {
    if (!supported) return;
    writerRef.current = createLinkedFileWriter(
      () => handleRef.current,
      () => getDataRef.current(),
      (outcome: WriteOutcome) => setStatus(outcome === 'linked' ? 'linked' : 'error'),
    );
  }, [supported]);

  /* Restore a previously linked file on mount — queryPermission needs no
     user gesture, so this can run automatically. */
  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    restoreLinkedFile().then(result => {
      if (cancelled || !result) return;
      handleRef.current = result.handle;
      setFileName(result.handle.name);
      setStatus(result.status);
    });
    return () => { cancelled = true; };
  }, [supported]);

  /* Flush on tab hide/close — without this, a write due right before
     closing the tab could sit in the debounce window and never happen. */
  useEffect(() => {
    if (!supported) return;
    function onVisibilityChange(): void {
      if (document.visibilityState === 'hidden') {
        writerRef.current?.flushIfPending();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [supported]);

  /** Debounced write — call this from every tracker mutation. Safe to
   *  call even when nothing is linked (no-op). */
  const scheduleWrite = useCallback((): void => {
    writerRef.current?.scheduleWrite();
  }, []);

  /** Opens the native save-file picker. No-op if the user cancels. */
  const link = useCallback(async (): Promise<void> => {
    if (!supported) return;
    try {
      const handle = await pickAndLinkFile();
      if (!handle) return; // user cancelled
      handleRef.current = handle;
      setFileName(handle.name);
      await writerRef.current?.writeNow(); // write current state immediately on link
      setStatus('linked');
    } catch (err) {
      logger.warning('useLinkedFile', 'link error', { err });
    }
  }, [supported]);

  /** Re-requests permission on the already-known handle. Must be called
   *  from a user gesture (a click) — the caller is responsible for that. */
  const reconnect = useCallback(async (): Promise<void> => {
    if (!supported || !handleRef.current) return;
    try {
      const granted = await requestPermission(handleRef.current);
      if (granted) {
        await writerRef.current?.writeNow(); // explicit user action — bypass the debounce
        setStatus('linked');
      } else {
        setStatus('reconnect');
      }
    } catch (err) {
      logger.warning('useLinkedFile', 'reconnect error', { err });
    }
  }, [supported]);

  /** Clears the linked file. Caller should confirm with the user first
   *  (data stays in the browser either way — this only stops syncing). */
  const unlink = useCallback(async (): Promise<void> => {
    handleRef.current = null;
    setFileName(null);
    setStatus('unlinked');
    await unlinkFile();
  }, []);

  return { supported, status, fileName, scheduleWrite, link, reconnect, unlink };
}
