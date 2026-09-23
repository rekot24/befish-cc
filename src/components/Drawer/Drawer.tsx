'use client';

/** Drawer — shared slide-in panel shell: overlay, right-slide on desktop /
 *  bottom-sheet on mobile, header (title + close), scrollable body, and
 *  an optional pinned footer for action buttons that shouldn't scroll
 *  away. Escape and an overlay click both close it. Extracted from
 *  FilterDrawer so Fish Dex and the Fish Tracker's TrackerDrawer share
 *  one shell instead of two copies of the same CSS. */

import { useEffect, type ReactNode } from 'react';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  ariaLabel: string;
  /** Scrollable body content. */
  children: ReactNode;
  /** Optional pinned action bar below the body (e.g. Clear/Done) — not
   *  in the checklist's original prop list, but both FilterDrawer and
   *  TrackerDrawer need a non-scrolling footer, so it's added here
   *  rather than forced into `children` or duplicated per-caller. */
  foot?: ReactNode;
}

export default function Drawer({ open, onClose, title, ariaLabel, children, foot }: DrawerProps) {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      {/* Drawer panel */}
      <aside className={styles.drawer} aria-label={ariaLabel}>
        <div className={styles.head}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.body}>
          {children}
        </div>

        {foot && <div className={styles.foot}>{foot}</div>}
      </aside>
    </>
  );
}
