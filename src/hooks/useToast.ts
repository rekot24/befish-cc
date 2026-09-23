'use client';

/**
 * useToast — a port of the live toast stack. Each toast fades/slides in
 * on the next paint after mounting (matching live's
 * requestAnimationFrame(() => el.classList.add('show'))), stays for
 * TOAST_DURATION_MS, then fades out before being removed. `showToasts`
 * fires several with TOAST_STAGGER_MS between each, for a multi-tier
 * crafting cascade.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { TOAST_DURATION_MS, TOAST_STAGGER_MS } from '../lib/trackerConfig';

export type ToastItem = { id: string; message: string; show: boolean };

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const framesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Clear anything still pending if the page unmounts mid-toast. Read
    // into locals here (not inside the cleanup) since these Set objects
    // are mutated in place and never reassigned — this just satisfies the
    // lint rule's "don't read ref.current inside cleanup" preference.
    const timers = timersRef.current;
    const frames = framesRef.current;
    return () => {
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
    };
  }, []);

  const showToast = useCallback((message: string): void => {
    const id = `toast_${Date.now()}_${idCounter++}`;
    setToasts(prev => [...prev, { id, message, show: false }]);

    const frame = requestAnimationFrame(() => {
      framesRef.current.delete(frame);
      setToasts(prev => prev.map(t => (t.id === id ? { ...t, show: true } : t)));
    });
    framesRef.current.add(frame);

    const hideTimer = setTimeout(() => {
      timersRef.current.delete(hideTimer);
      setToasts(prev => prev.map(t => (t.id === id ? { ...t, show: false } : t)));
      const removeTimer = setTimeout(() => {
        timersRef.current.delete(removeTimer);
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
      timersRef.current.add(removeTimer);
    }, TOAST_DURATION_MS);
    timersRef.current.add(hideTimer);
  }, []);

  /** Shows several toasts staggered by TOAST_STAGGER_MS each — for a
   *  crafting cascade that produces more than one toast at once. */
  const showToasts = useCallback((messages: string[]): void => {
    messages.forEach((msg, i) => {
      const timer = setTimeout(() => {
        timersRef.current.delete(timer);
        showToast(msg);
      }, i * TOAST_STAGGER_MS);
      timersRef.current.add(timer);
    });
  }, [showToast]);

  return { toasts, showToast, showToasts };
}
