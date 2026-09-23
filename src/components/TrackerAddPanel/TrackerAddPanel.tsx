'use client';

/** TrackerAddPanel — the "+ Track a Fish" popover, 1:1 with the live
 *  panel: search list with a rarity dot, tier buttons, a count input
 *  clamped to 0…CRAFT_TARGET-1, a duplicate warning, and a submit
 *  disabled until the selection is valid. Closes on outside click or
 *  Cancel. */

import { useEffect, useRef, useState } from 'react';
import { FISH, TIERS, RC, TC, type Tier } from '../../lib/fishData';
import { fishById } from '../../lib/trackerLogic';
import { CRAFT_TARGET } from '../../lib/trackerConfig';
import styles from './TrackerAddPanel.module.css';

interface TrackerAddPanelProps {
  /** `${fishId}|${tier}` keys already tracked in the active profile, for
   *  duplicate detection. */
  existingKeys: Set<string>;
  onSubmit: (fishId: string, tier: Tier, startCount: number) => void;
}

export default function TrackerAddPanel({ existingKeys, onSubmit }: TrackerAddPanelProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  // Raw string, not a number — matches live's DOM-input-value approach so
  // typing (including a momentarily empty/negative-looking field) isn't
  // fought; only the upper bound is capped while typing, same as live.
  const [countRaw, setCountRaw] = useState('0');
  const wrapRef = useRef<HTMLDivElement>(null);

  const q = search.trim().toLowerCase();
  const results = FISH.filter(f => !q || f.name.toLowerCase().includes(q));

  const dupeKey = selectedFishId && selectedTier ? `${selectedFishId}|${selectedTier}` : null;
  const isDupe = dupeKey !== null && existingKeys.has(dupeKey);
  const canSubmit = selectedFishId !== null && selectedTier !== null && !isDupe;

  function resetPanel(): void {
    setSearch('');
    setSelectedFishId(null);
    setSelectedTier(null);
    setCountRaw('0');
  }

  function toggleOpen(): void {
    setOpen(wasOpen => {
      if (!wasOpen) resetPanel();
      return !wasOpen;
    });
  }

  /* Outside click closes the panel. */
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent): void {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  function handleCountChange(value: string): void {
    // Only the upper bound is enforced while typing, matching live —
    // the lower bound and NaN fallback are handled at submit instead, so
    // clearing the field to retype isn't fought.
    if (Number(value) > CRAFT_TARGET - 1) {
      setCountRaw(String(CRAFT_TARGET - 1));
    } else {
      setCountRaw(value);
    }
  }

  function handleSubmit(): void {
    if (!canSubmit || !selectedFishId || !selectedTier) return;
    const startCount = Math.min(CRAFT_TARGET - 1, Math.max(0, Math.round(Number(countRaw)) || 0));
    onSubmit(selectedFishId, selectedTier, startCount);
    setOpen(false);
  }

  const dupeFish = isDupe && selectedFishId ? fishById(selectedFishId) : null;

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button type="button" className="btn-primary" onClick={toggleOpen}>+ Track a Fish</button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.section}>
            <input
              type="text"
              className={styles.search}
              placeholder="🔍 Search fish…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className={styles.results}>
              {results.length === 0 && <p className={styles.noResults}>No fish match.</p>}
              {results.map(f => {
                const rc = RC[f.rarity];
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={`${styles.fishItem}${f.id === selectedFishId ? ` ${styles.selected}` : ''}`}
                    style={{ '--rarity-color': rc.bar } as React.CSSProperties}
                    onClick={e => { e.stopPropagation(); setSelectedFishId(f.id); }}
                  >
                    <span className={styles.dot} />
                    <span className={styles.fishName}>{f.name}</span>
                    <span className={styles.fishRarity}>{f.rarity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.groupLabel}>Tier</div>
            <div className={styles.tierRow}>
              {TIERS.map(tier => (
                <button
                  key={tier}
                  type="button"
                  className={`${styles.tierBtn}${tier === selectedTier ? ` ${styles.tierBtnActive}` : ''}`}
                  style={{ '--chip-color': TC[tier] } as React.CSSProperties}
                  onClick={() => setSelectedTier(tier)}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.countLabel}>
              Current count
              <input
                type="number"
                className={styles.countInput}
                min={0}
                max={CRAFT_TARGET - 1}
                value={countRaw}
                onChange={e => handleCountChange(e.target.value)}
              />
            </label>
          </div>

          {dupeFish && selectedTier && (
            <div className={styles.dupeWarning}>
              Already tracking {dupeFish.name} ({selectedTier}) — edit that tracker below instead of creating a new one.
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className="btn-secondary btn--sm" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="btn-primary btn--sm" onClick={handleSubmit} disabled={!canSubmit}>
              Add Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
