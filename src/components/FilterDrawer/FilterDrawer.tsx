'use client';

/** FilterDrawer — Sort, Filter, and Compare controls, using the shared
 *  Drawer shell. Receives all state and handlers from useFishDex via
 *  props — no state here. */

import Drawer from '../Drawer/Drawer';
import { TIERS, RARITY_ORDER, TC, RC, type Tier, type Rarity, type Fish, TIER_ABBR } from '../../lib/fishData';
import { SORT_OPTIONS, type SortKey } from '../../hooks/useFishDex';
import styles from './FilterDrawer.module.css';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;

  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;

  activeTiers: Set<Tier>;
  onToggleTier: (tier: Tier) => void;
  onSelectAllTiers: () => void;
  onClearTiers: () => void;

  activeRarities: Set<Rarity>;
  onToggleRarity: (rarity: Rarity) => void;
  onSelectAllRarities: () => void;
  onClearRarities: () => void;

  hideUnmeasured: boolean;
  onToggleHideUnmeasured: () => void;

  compareKeys: Set<string>;
  compareSearch: string;
  onCompareSearchChange: (q: string) => void;
  onToggleCompareKey: (key: string) => void;
  onClearCompare: () => void;
  filteredCompareFish: Fish[];

  activeFilterCount: number;
  onClearAll: () => void;
}

export default function FilterDrawer({
  open, onClose,
  sortKey, onSortChange,
  activeTiers, onToggleTier, onSelectAllTiers, onClearTiers,
  activeRarities, onToggleRarity, onSelectAllRarities, onClearRarities,
  hideUnmeasured, onToggleHideUnmeasured,
  compareKeys, compareSearch, onCompareSearchChange, onToggleCompareKey, onClearCompare,
  filteredCompareFish,
  activeFilterCount, onClearAll,
}: FilterDrawerProps) {
  const allTiersActive    = activeTiers.size === TIERS.length;
  const allRaritiesActive = activeRarities.size === RARITY_ORDER.length;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Sort / Filter"
      ariaLabel="Sort and filter options"
      foot={
        <>
          <button className={styles.clearBtn} onClick={onClearAll}>
            Clear all {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </>
      }
    >
      {/* Sort */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Sort by</span>
        </div>
        <select
          className={styles.sortSelect}
          value={sortKey}
          onChange={e => onSortChange(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </section>

      {/* Tier filter */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Tier</span>
          <button
            className={styles.sectionAction}
            onClick={allTiersActive ? onClearTiers : onSelectAllTiers}
          >
            {allTiersActive ? 'Clear all' : 'Select all'}
          </button>
        </div>
        <div className={styles.chips}>
          {TIERS.map(tier => (
            <button
              key={tier}
              className={`${styles.chip} ${activeTiers.has(tier) ? styles.chipActive : styles.chipOff}`}
              style={{ '--chip-color': TC[tier] } as React.CSSProperties}
              onClick={() => onToggleTier(tier)}
            >
              {tier}
            </button>
          ))}
        </div>
      </section>

      {/* Rarity filter */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Rarity</span>
          <button
            className={styles.sectionAction}
            onClick={allRaritiesActive ? onClearRarities : onSelectAllRarities}
          >
            {allRaritiesActive ? 'Clear all' : 'Select all'}
          </button>
        </div>
        <div className={styles.chips}>
          {RARITY_ORDER.map(rarity => (
            <button
              key={rarity}
              className={`${styles.chip} ${activeRarities.has(rarity) ? styles.chipActive : styles.chipOff}`}
              style={{ '--chip-color': RC[rarity].ingamebg } as React.CSSProperties}
              onClick={() => onToggleRarity(rarity)}
            >
              {rarity}
            </button>
          ))}
        </div>
      </section>

      {/* Measured only toggle */}
      <section className={styles.section}>
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Measured fish only</span>
          <button
            className={`${styles.toggle} ${hideUnmeasured ? styles.toggleOn : ''}`}
            onClick={onToggleHideUnmeasured}
            role="switch"
            aria-checked={hideUnmeasured}
            aria-label="Show only fish with measured stats"
          >
            <span className={styles.toggleDot} />
          </button>
        </div>
      </section>

      {/* Compare */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>
            Compare specific fish
            {compareKeys.size > 0 && (
              <span className={styles.compareBadge}>{compareKeys.size}</span>
            )}
          </span>
          {compareKeys.size > 0 && (
            <button className={styles.sectionAction} onClick={onClearCompare}>Clear</button>
          )}
        </div>
        <input
          className={styles.compareSearch}
          type="text"
          placeholder="Search species..."
          value={compareSearch}
          onChange={e => onCompareSearchChange(e.target.value)}
        />
        <div className={styles.compareList}>
          {filteredCompareFish.length === 0 && (
            <p className={styles.noResults}>No fish match.</p>
          )}
          {filteredCompareFish.map(fish => (
            <div key={fish.id} className={styles.compareItem}>
              <span
                className={styles.compareDot}
                style={{ '--dot-color': RC[fish.rarity].ingamebg } as React.CSSProperties}
              />
              <span className={styles.compareName}>{fish.name}</span>
              <div className={styles.tierChips}>
                {TIERS.map(tier => {
                  const td = fish.tiers[tier];
                  const hasStats = td.growth !== null || td.speed !== null;
                  if (!hasStats) return null;
                  const key = `${fish.id}|${tier}`;
                  const selected = compareKeys.has(key);
                  return (
                    <button
                      key={tier}
                      className={`${styles.tierChip} ${selected ? styles.tierChipSel : ''}`}
                      style={{ '--chip-color': TC[tier] } as React.CSSProperties}
                      onClick={() => onToggleCompareKey(key)}
                      title={tier}
                    >
                      {TIER_ABBR[tier]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Drawer>
  );
}
