'use client';

/** TrackerDrawer — "Profiles / Sort / Data" in the shared Drawer shell.
 *  Three sections styled like FilterDrawer's: Profile (list, switch,
 *  inline rename, delete, + New Profile), Sort (dropdown + Custom lock/
 *  reset when manual is selected), and Data & Sync (export/import/link
 *  file). All confirms (delete profile, reset order, unlink) are the
 *  caller's job — the props here are already "do it," matching
 *  TrackerCard's onDeleteClick pattern; the caller wires showConfirm in
 *  before passing these down. */

import { useRef, useState } from 'react';
import Drawer from '../Drawer/Drawer';
import { TRACKER_SORT_OPTIONS } from '../../hooks/useTracker';
import type { Profile, SortMode } from '../../lib/trackerSchema';
import styles from './TrackerDrawer.module.css';

export type LinkedFileDisplayState = 'unlinked' | 'linked' | 'reconnect' | 'error';

interface TrackerDrawerProps {
  open: boolean;
  onClose: () => void;

  /* Profile section */
  profiles: Profile[];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  onRenameProfile: (id: string, name: string) => void;
  onDeleteProfile: () => void; // acts on the active profile; caller confirms first
  onNewProfile: () => void; // caller shows its own name prompt

  /* Sort section */
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  sortLocked: boolean;
  onSetSortLocked: (locked: boolean) => void;
  onResetManualOrder: () => void; // caller confirms first
  hasManualOrder: boolean;

  /* Data & Sync section */
  onExportProfile: () => void;
  onExportAll: () => void;
  onImportFile: (file: File) => void;
  linkedFileSupported: boolean;
  linkedFileStatus: LinkedFileDisplayState;
  linkedFileName: string | null;
  onLinkFile: () => void;
}

export default function TrackerDrawer({
  open, onClose,
  profiles, activeProfileId, onSwitchProfile, onRenameProfile, onDeleteProfile, onNewProfile,
  sortMode, onSortChange, sortLocked, onSetSortLocked, onResetManualOrder, hasManualOrder,
  onExportProfile, onExportAll, onImportFile,
  linkedFileSupported, linkedFileStatus, linkedFileName, onLinkFile,
}: TrackerDrawerProps) {
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const committedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startRename(profile: Profile): void {
    committedRef.current = false;
    setEditingProfileId(profile.profileId);
    setEditValue(profile.profileName);
  }

  /** Guarded so Enter -> blur (or Escape -> blur, or a plain click-away
   *  blur) never commits twice for the same edit, matching the live
   *  site's own `committed` flag. */
  function commitRename(value: string): void {
    if (committedRef.current) return;
    committedRef.current = true;
    if (editingProfileId) onRenameProfile(editingProfileId, value);
    setEditingProfileId(null);
  }

  function handleSortSelect(mode: SortMode): void {
    onSortChange(mode);
    // Deselecting Custom re-locks + implicitly hides the lock/reset row
    // below, matching live's closeCustomPanel() behavior.
    if (mode !== 'manual' && !sortLocked) onSetSortLocked(true);
  }

  function handleImportChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) onImportFile(file);
    e.target.value = ''; // allow re-selecting the same filename later
  }

  const linkButtonLabel =
    linkedFileStatus === 'linked' ? `🔗 Synced: ${linkedFileName ?? ''} ✓`
    : linkedFileStatus === 'reconnect' ? '⚠ Reconnect File'
    : linkedFileStatus === 'error' ? '⚠ Sync Failed — Click to Reconnect'
    : '🔗 Link Local File';

  return (
    <Drawer open={open} onClose={onClose} title="Profiles / Sort / Data" ariaLabel="Profiles, sort, and data settings">
      {/* ── Profile ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Profile</span>
        </div>
        <div className={styles.profileList}>
          {profiles.map(p => {
            const isActive = p.profileId === activeProfileId;
            const isEditing = editingProfileId === p.profileId;
            return (
              <div key={p.profileId} className={styles.profileRow}>
                {isEditing ? (
                  <input
                    className={styles.renameInput}
                    autoFocus
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRename(editValue);
                      else if (e.key === 'Escape') commitRename(p.profileName);
                    }}
                    onBlur={() => commitRename(editValue)}
                  />
                ) : (
                  <button
                    type="button"
                    className={`${styles.profileBtn}${isActive ? ` ${styles.profileBtnActive}` : ''}`}
                    onClick={() => onSwitchProfile(p.profileId)}
                  >
                    {p.profileName}
                  </button>
                )}
                {isActive && !isEditing && (
                  <button
                    type="button"
                    className={styles.iconBtn}
                    title="Rename active profile"
                    onClick={() => startRename(p)}
                  >
                    ✎
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.profileActions}>
          <button
            type="button"
            className="btn-secondary btn--sm btn--danger"
            onClick={onDeleteProfile}
            disabled={profiles.length <= 1}
          >
            Delete
          </button>
          <button type="button" className="btn-secondary btn--sm" onClick={onNewProfile}>
            + New Profile
          </button>
        </div>
      </section>

      {/* ── Sort ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Sort by</span>
        </div>
        <select
          className={styles.sortSelect}
          value={sortMode}
          onChange={e => handleSortSelect(e.target.value as SortMode)}
        >
          {TRACKER_SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {sortMode === 'manual' && (
          <div className={styles.customPanel}>
            <label className={styles.lockRow}>
              <input
                type="checkbox"
                checked={sortLocked}
                onChange={e => onSetSortLocked(e.target.checked)}
              />
              Custom sort lock
            </label>
            <button
              type="button"
              className={styles.textLinkBtn}
              onClick={onResetManualOrder}
              disabled={sortLocked || !hasManualOrder}
            >
              Reset custom order
            </button>
          </div>
        )}
      </section>

      {/* ── Data & Sync ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Data & Sync</span>
        </div>
        <div className={styles.dataActions}>
          <button type="button" className="btn-secondary btn--sm" onClick={onExportProfile}>
            ⬇ Export Profile
          </button>
          <button type="button" className="btn-secondary btn--sm" onClick={onExportAll}>
            ⬇ Export All Profiles
          </button>
          <button type="button" className="btn-secondary btn--sm" onClick={() => fileInputRef.current?.click()}>
            ⬆ Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImportChange}
          />
          {linkedFileSupported && (
            <button
              type="button"
              className={`btn-secondary btn--sm${linkedFileStatus === 'linked' ? ` ${styles.linkedActive}` : ''}`}
              onClick={onLinkFile}
            >
              {linkButtonLabel}
            </button>
          )}
        </div>
        <p className={styles.dataNote}>
          Data is stored in this browser. Export before clearing browser data or switching devices
          {linkedFileSupported && ' — or link a local file (Chrome/Edge) to sync automatically'}.
        </p>
      </section>
    </Drawer>
  );
}
