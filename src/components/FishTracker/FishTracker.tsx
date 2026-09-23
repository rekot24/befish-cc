'use client';

/** FishTracker — the page component. UI only: reads useTracker,
 *  useLinkedFile, useModal, and useToast, and wires them together. All
 *  confirm dialogs (delete tracker/profile, reset order, unlink,
 *  replace-all-data) live here, not in the hooks or the dumb components
 *  below — this is the one place that's allowed to orchestrate them. */

import { useEffect, useMemo, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import { useTracker } from '../../hooks/useTracker';
import { useLinkedFile } from '../../hooks/useLinkedFile';
import { useModal } from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { featureFlags } from '../../lib/featureFlags';
import { slugify, dateStamp } from '../../lib/trackerLogic';
import { EXPORT_FILENAME_PREFIX, EXPORT_FULL_BACKUP_LABEL } from '../../lib/trackerConfig';
import type { Tier } from '../../lib/fishData';
import PageHeading from '../PageHeading/PageHeading';
import TrackerCard from '../TrackerCard/TrackerCard';
import TrackerAddPanel from '../TrackerAddPanel/TrackerAddPanel';
import TrackerDrawer from '../TrackerDrawer/TrackerDrawer';
import Modal from '../Modal/Modal';
import Toast from '../Toast/Toast';
import styles from './FishTracker.module.css';

/** Sortable's drag animation duration, named per the standing "no magic
 *  numbers" rule — this one is a UI layout/animation constant, which the
 *  rule treats as the exception living as a local named constant rather
 *  than in trackerConfig.ts. */
const SORTABLE_ANIMATION_MS = 150;

function downloadJSON(obj: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FishTracker() {
  const tracker = useTracker();
  const linkedFile = useLinkedFile(() => tracker.data);
  const modal = useModal();
  const toast = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const sortableRef = useRef<Sortable | null>(null);

  /* Wire the linked-file scheduler into useTracker once both hooks exist
     (see useTracker's docstring for why this indirection is needed). */
  useEffect(() => {
    tracker.setLinkedFileScheduler(() => linkedFile.scheduleWrite());
    return () => tracker.setLinkedFileScheduler(null);
  }, [tracker, linkedFile]);

  const existingKeys = useMemo(() => {
    if (!tracker.activeProfile) return new Set<string>();
    return new Set(tracker.activeProfile.trackedFish.map(t => `${t.fishId}|${t.tier}`));
  }, [tracker.activeProfile]);

  /* ── Drag reorder ── */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (tracker.sortLocked || !featureFlags.trackerDragReorder || !tracker.hydrated) {
      sortableRef.current?.destroy();
      sortableRef.current = null;
      return;
    }

    sortableRef.current = Sortable.create(grid, {
      animation: SORTABLE_ANIMATION_MS,
      ghostClass: styles.ghost,
      onEnd: (evt) => {
        const { oldIndex, newIndex, item } = evt;
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

        // React owns this DOM (it's rendered from tracker.visibleTrackers).
        // Sortable has already physically moved `item` by this point —
        // revert that DOM move back to its original position first, then
        // let setManualOrder -> a normal React re-render do the actual
        // reordering. Leaving Sortable's own mutation in place would
        // desync React's reconciliation from the real DOM on next render.
        const parent = item.parentElement;
        if (parent) {
          const siblingsWithoutItem = Array.from(parent.children).filter(el => el !== item);
          const referenceNode = siblingsWithoutItem[oldIndex] ?? null;
          parent.insertBefore(item, referenceNode);
        }

        const currentOrder = tracker.visibleTrackers.map(t => t.trackId);
        const reordered = [...currentOrder];
        const [movedId] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, movedId);
        tracker.setManualOrder(reordered); // also sets sortMode: 'manual'
      },
    });

    return () => {
      sortableRef.current?.destroy();
      sortableRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-creating Sortable on every visibleTrackers change would fight active drags; onEnd reads tracker.visibleTrackers fresh via closure over the tracker object each time this effect re-runs (sortLocked/hydrated changes), which is the only time recreation is actually needed
  }, [tracker.sortLocked, tracker.hydrated]);

  /* ── Confirm-wrapped mutations (the one place these confirms live) ── */

  async function handleDeleteTracker(trackId: string): Promise<void> {
    const t = tracker.activeProfile?.trackedFish.find(x => x.trackId === trackId);
    if (!t) return;
    const ok = await modal.showConfirm(
      `Delete tracker for ${t.fishName} (${t.tier})? This can't be undone.`,
      { title: 'Delete Tracker', confirmText: 'Delete', danger: true },
    );
    if (ok) tracker.deleteTracker(trackId);
  }

  async function handleDeleteProfile(): Promise<void> {
    const profile = tracker.activeProfile;
    if (!profile) return;
    const ok = await modal.showConfirm(
      `Delete profile "${profile.profileName}"? This deletes all ${profile.trackedFish.length} tracker(s) under it and can't be undone.`,
      { title: 'Delete Profile', confirmText: 'Delete', danger: true },
    );
    if (!ok) return;
    const result = tracker.deleteProfile(profile.profileId);
    if (!result.ok && result.reason) {
      await modal.showAlert(result.reason, 'Unable to Delete');
    }
  }

  async function handleNewProfile(): Promise<void> {
    const name = await modal.showPrompt('Enter a name for the new profile:', { title: 'New Profile', confirmText: 'Create' });
    if (name && name.trim()) tracker.newProfile(name);
  }

  async function handleResetManualOrder(): Promise<void> {
    const ok = await modal.showConfirm("Clear your custom drag order? This can't be undone.", {
      title: 'Reset Custom Order', confirmText: 'Reset', danger: true,
    });
    if (ok) tracker.resetManualOrder();
  }

  async function handleImportFile(file: File): Promise<void> {
    const text = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      await modal.showAlert('That file is not valid JSON.', 'Import Failed');
      return;
    }

    const looksFull = !!(parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).profiles));
    if (looksFull) {
      const ok = await modal.showConfirm(
        'This will replace ALL current profiles and trackers with the imported backup. Continue?',
        { title: 'Replace All Data', confirmText: 'Replace', danger: true },
      );
      if (!ok) return;
    }

    const result = tracker.importFile(parsed);
    if (!result.ok) {
      await modal.showAlert(result.message, 'Import Failed');
    } else {
      toast.showToast(result.message);
    }
  }

  async function handleLinkFileClick(): Promise<void> {
    if (linkedFile.status === 'reconnect' || linkedFile.status === 'error') {
      await linkedFile.reconnect();
      return;
    }
    if (linkedFile.status === 'linked') {
      const ok = await modal.showConfirm(
        `Stop syncing to "${linkedFile.fileName}"? Your data stays in this browser either way.`,
        { title: 'Unlink File', confirmText: 'Unlink' },
      );
      if (ok) await linkedFile.unlink();
      return;
    }
    await linkedFile.link();
  }

  function handleCatch(trackId: string): void {
    const toasts = tracker.addCatch(trackId);
    if (toasts.length) toast.showToasts(toasts);
  }

  function handleExportProfile(): void {
    const data = tracker.exportProfile();
    if (!data) return;
    downloadJSON(data, `${EXPORT_FILENAME_PREFIX}-${slugify(data.profileName)}-${dateStamp()}.json`);
  }

  function handleExportAll(): void {
    const data = tracker.exportAll();
    if (!data) return;
    downloadJSON(data, `${EXPORT_FILENAME_PREFIX}-${EXPORT_FULL_BACKUP_LABEL}-${dateStamp()}.json`);
  }

  function handleCreateTracker(fishId: string, tier: Tier, startCount: number): void {
    tracker.createTracker(fishId, tier, startCount);
  }

  /* ── Render states ── */

  // Before hydration: a light placeholder, never the empty state (so a
  // flash of "No fish tracked" doesn't alarm a user who actually has data).
  if (!tracker.hydrated) {
    return (
      <div className="page-wrap">
        <PageHeading title="Fish Tracker" subtitle="Log your catches, watch tier-craft progress, and predict your next catch" />
        <p className={styles.loading}>Loading your tracker…</p>
      </div>
    );
  }

  if (tracker.loadError) {
    return (
      <div className="page-wrap">
        <PageHeading title="Fish Tracker" subtitle="Log your catches, watch tier-craft progress, and predict your next catch" />
        <div className={styles.loadError}>
          <p>{tracker.loadError}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              const raw = window.localStorage.getItem('befish-tracker-v2');
              if (raw) downloadJSON(JSON.parse(raw), `befish-tracker-raw-export-${dateStamp()}.json`);
            }}
          >
            Export raw tracker data
          </button>
        </div>
      </div>
    );
  }

  const linkedFileBadge = linkedFile.status === 'reconnect' || linkedFile.status === 'error';

  return (
    <div className="page-wrap">
      <PageHeading title="Fish Tracker" subtitle="Log your catches, watch tier-craft progress, and predict your next catch" />

      <div className={styles.controlBar}>
        <TrackerAddPanel existingKeys={existingKeys} onSubmit={handleCreateTracker} />
        <button
          type="button"
          className={styles.drawerBtn}
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
        >
          {tracker.activeProfile?.profileName ?? 'Profile'}
          {linkedFileBadge && <span className={styles.drawerBadge} aria-label="Linked file needs attention" />}
        </button>
      </div>

      <p className={styles.count}>
        {tracker.visibleTrackers.length > 0
          ? `Tracking ${tracker.visibleTrackers.length} fish/tier combo${tracker.visibleTrackers.length !== 1 ? 's' : ''}`
          : ''}
      </p>

      {tracker.hiddenInvalidCount > 0 && (
        <p className={styles.invalidNotice}>
          {tracker.hiddenInvalidCount} tracker{tracker.hiddenInvalidCount !== 1 ? 's' : ''} couldn&apos;t be displayed
          (unrecognized fish or tier) — the underlying data is untouched.
        </p>
      )}

      {tracker.visibleTrackers.length === 0 ? (
        <p className={styles.noResults}>No fish tracked yet. Click &quot;+ Track a Fish&quot; to get started.</p>
      ) : (
        <div ref={gridRef} className={`${styles.grid}${tracker.sortLocked ? '' : ` ${styles.unlocked}`}`}>
          {tracker.visibleTrackers.map(t => (
            <div key={t.trackId} data-trackid={t.trackId}>
              <TrackerCard
                tracker={t}
                onCatch={handleCatch}
                onUndo={tracker.undoCatch}
                onDeleteClick={handleDeleteTracker}
                timestampState={tracker.getTimestampState(t.trackId)}
                onToggleTimestamps={tracker.toggleTimestamps}
                onSetTimestampLimit={tracker.setTimestampLimit}
              />
            </div>
          ))}
        </div>
      )}

      {tracker.activeProfile && (
        <TrackerDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          profiles={tracker.data?.profiles ?? []}
          activeProfileId={tracker.activeProfile.profileId}
          onSwitchProfile={tracker.switchProfile}
          onRenameProfile={tracker.renameProfile}
          onDeleteProfile={handleDeleteProfile}
          onNewProfile={handleNewProfile}
          sortMode={tracker.activeProfile.sortMode}
          onSortChange={tracker.setSortMode}
          sortLocked={tracker.sortLocked}
          onSetSortLocked={tracker.setSortLocked}
          onResetManualOrder={handleResetManualOrder}
          hasManualOrder={tracker.activeProfile.manualOrder.length > 0}
          onExportProfile={handleExportProfile}
          onExportAll={handleExportAll}
          onImportFile={handleImportFile}
          linkedFileSupported={linkedFile.supported}
          linkedFileStatus={linkedFile.status}
          linkedFileName={linkedFile.fileName}
          onLinkFile={handleLinkFileClick}
        />
      )}

      <Modal key={modal.modalState?.id ?? 'closed'} state={modal.modalState} onCancel={modal.cancel} onConfirm={modal.confirm} />
      <Toast toasts={toast.toasts} />
    </div>
  );
}
