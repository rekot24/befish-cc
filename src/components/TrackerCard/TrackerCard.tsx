'use client';

/** TrackerCard — renders one tracked fish/tier combo, 1:1 with the live
 *  `trackerCardHTML`. Receives all data and callbacks as props; the only
 *  local state is whether its image failed to load (a UI-only concern,
 *  swapped to a placeholder via React state per the checklist, not DOM
 *  mutation like FishCard's `onerror` — FishCard has no placeholder
 *  content to swap to, this does).
 *
 *  Colors are set once as CSS custom properties on the card root
 *  (--tier-color, --rarity-bar, --rarity-bg, --rarity-txt, --fish-bg),
 *  following the FishCard precedent. The only inline style is the
 *  progress bar's dynamic width. */

import { useState } from 'react';
import Image from 'next/image';
import {
  fishById, avgIntervalMs, etaNextCatchMs, etaNextTierMs, fmtDuration, fmtETA, timestampRows,
} from '../../lib/trackerLogic';
import { TIERS, RC, TC } from '../../lib/fishData';
import { CRAFT_TARGET, TIMESTAMP_LIMIT_OPTIONS } from '../../lib/trackerConfig';
import type { Tracker } from '../../lib/trackerSchema';
import type { TimestampPanelState } from '../../hooks/useTracker';
import styles from './TrackerCard.module.css';

interface TrackerCardProps {
  tracker: Tracker;
  onCatch: (trackId: string) => void;
  onUndo: (trackId: string) => void;
  /** Caller shows its own confirm dialog before actually deleting —
   *  TrackerCard just reports the click. */
  onDeleteClick: (trackId: string) => void;
  timestampState: TimestampPanelState;
  onToggleTimestamps: (trackId: string) => void;
  onSetTimestampLimit: (trackId: string, limit: number | 'all') => void;
}

export default function TrackerCard({
  tracker, onCatch, onUndo, onDeleteClick,
  timestampState, onToggleTimestamps, onSetTimestampLimit,
}: TrackerCardProps) {
  const [imgError, setImgError] = useState(false);

  const fish = fishById(tracker.fishId);
  if (!fish) return null; // isTrackerRenderable already filters these out upstream; defensive only

  const rc = RC[fish.rarity];
  const tc = TC[tracker.tier];
  const tierIndex = TIERS.indexOf(tracker.tier);
  const imgSrc = `/img/${fish.id}-${tierIndex + 1}.png`;
  const pct = Math.min(100, Math.round((tracker.count / CRAFT_TARGET) * 100));
  const avg = avgIntervalMs(tracker.catches);

  const cardStyle = {
    '--tier-color': tc,
    '--rarity-bar': rc.bar,
    '--rarity-bg': rc.bg,
    '--rarity-txt': rc.txt,
    '--fish-bg': fish.bg,
  } as React.CSSProperties;

  const fishImage = imgError ? (
    <div className={styles.imgPlaceholder}>🐟</div>
  ) : (
    <Image
      src={imgSrc}
      alt={fish.name}
      width={56}
      height={56}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );

  return (
    <div className={styles.card} style={cardStyle}>
      {/* Desktop head */}
      <div className={styles.head}>
        <div className={styles.imgWrap}>{fishImage}</div>
        <div className={styles.title}>
          <div className={styles.fishName}>{fish.name}</div>
          <span className={styles.rarityBadge}>{fish.rarity}</span>
        </div>
        <div className={styles.headSide}>
          <div className={styles.tierBadge}>{tracker.tier}</div>
          <div className={styles.countBig}>{tracker.count}</div>
          <div className={styles.countOf}>of {CRAFT_TARGET}</div>
        </div>
      </div>

      {/* Mobile head */}
      <div className={styles.headMobile}>
        <div className={styles.fishName}>{fish.name}</div>
        <div className={styles.mobileRow}>
          <div className={styles.imgWrap}>{fishImage}</div>
          <div className={styles.mobileBadges}>
            <div className={styles.tierBadge}>{tracker.tier}</div>
            <span className={styles.rarityBadge}>{fish.rarity}</span>
          </div>
        </div>
        <div className={styles.mobileCount}>
          {tracker.count} <span className={styles.countOfInline}>of {CRAFT_TARGET}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressRow}>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Predictions */}
      {avg === null ? (
        <div className={styles.predictEmpty}>Log a few more catches to unlock time predictions.</div>
      ) : (
        <div className={styles.predict}>
          <div className={styles.predictRow}><span>Avg. interval</span><b>{fmtDuration(avg)}</b></div>
          <div className={styles.predictRow}><span>Next catch ETA</span><b>{fmtETA(etaNextCatchMs(tracker) ?? 0)}</b></div>
          <div className={styles.predictRow}><span>Next tier ETA</span><b>{fmtETA(etaNextTierMs(tracker) ?? 0)}</b></div>
        </div>
      )}

      {/* Timestamps */}
      <button
        type="button"
        className={styles.timestampsToggle}
        onClick={() => onToggleTimestamps(tracker.trackId)}
      >
        {timestampState.open ? 'Hide Timestamps' : 'Show Timestamps'}
      </button>
      {timestampState.open && (
        <div className={styles.timestampsPanel}>
          <div className={styles.tsLimitRow}>
            {TIMESTAMP_LIMIT_OPTIONS.map(n => (
              <button
                key={n}
                type="button"
                className={`${styles.tsLimitBtn}${timestampState.limit === n ? ` ${styles.active}` : ''}`}
                onClick={() => onSetTimestampLimit(tracker.trackId, n)}
              >
                {n === 'all' ? 'All' : n}
              </button>
            ))}
          </div>
          <div className={styles.tsGrid}>
            {timestampRows(tracker, timestampState.limit).map((row, i) => (
              <div className={styles.tsRowPair} key={i}>
                <div className={row.obtained ? `${styles.tsRowTime} ${styles.tsRowObtained}` : styles.tsRowTime}>
                  {row.time}
                </div>
                <div className={row.obtained ? `${styles.tsRowDelta} ${styles.tsRowObtained}` : styles.tsRowDelta}>
                  {row.obtained ? 'Date obtained' : (row.delta ?? '—')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button type="button" className={`btn-primary ${styles.catchBtn}`} onClick={() => onCatch(tracker.trackId)}>
          +1 Catch
        </button>
        <button
          type="button"
          className={styles.undoBtn}
          onClick={() => onUndo(tracker.trackId)}
          disabled={tracker.catches.length === 0}
        >
          Undo last catch
        </button>
      </div>

      <div className={styles.foot}>
        <button type="button" className={styles.deleteBtn} onClick={() => onDeleteClick(tracker.trackId)}>
          Delete
        </button>
      </div>
    </div>
  );
}
