'use client';

/** FishDex page component — control bar, filter drawer, card grid.
 *  All state lives in useFishDex hook. This component only renders UI. */

import { useFishDex } from '../../hooks/useFishDex';
import FishCard from '../FishCard/FishCard';
import FilterDrawer from '../FilterDrawer/FilterDrawer';
import PageHeading from '../PageHeading/PageHeading';
import styles from './FishDex.module.css';

export default function FishDex() {
  const dex = useFishDex();

  const sortStat = dex.sortKey.startsWith('growth') ? 'growth'
                 : dex.sortKey.startsWith('speed')  ? 'speed'
                 : dex.sortKey.startsWith('xp')     ? 'xp'
                 : dex.sortKey.startsWith('rarity') ? 'rarity'
                 : null;

  return (
    <div className="page-wrap">
      <PageHeading
        title="Fish Dex"
        subtitle="300 collectibles · 60 species · 5 tiers · stats on a 0–100 scale"
      />

      {/* Control bar */}
      <div className={styles.controlBar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search fish..."
          value={dex.searchQuery}
          onChange={e => dex.setSearchQuery(e.target.value)}
          aria-label="Search fish by name"
        />
        <button
          className={`${styles.filterBtn} ${dex.activeFilterCount > 0 ? styles.filterBtnActive : ''}`}
          onClick={() => dex.setDrawerOpen(true)}
          aria-expanded={dex.drawerOpen}
        >
          Sort / Filter
          {dex.activeFilterCount > 0 && (
            <span className={styles.filterBadge}>{dex.activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Result count */}
      <p className={styles.count}>
        Showing {dex.entries.length} card{dex.entries.length !== 1 ? 's' : ''} across{' '}
        {dex.speciesCount} species
      </p>

      {/* Card grid */}
      {dex.entries.length === 0 ? (
        <p className={styles.noResults}>No fish match your filters.</p>
      ) : (
        <div className={styles.grid}>
          {dex.entries.map(({ fish, tier }) => (
            <FishCard
              key={`${fish.id}-${tier}`}
              fish={fish}
              tier={tier}
              sortStat={sortStat}
            />
          ))}
        </div>
      )}

      {/* Filter drawer */}
      <FilterDrawer
        open={dex.drawerOpen}
        onClose={() => dex.setDrawerOpen(false)}
        sortKey={dex.sortKey}
        onSortChange={dex.setSortKey}
        activeTiers={dex.activeTiers}
        onToggleTier={dex.toggleTier}
        onSelectAllTiers={dex.selectAllTiers}
        onClearTiers={dex.clearTiers}
        activeRarities={dex.activeRarities}
        onToggleRarity={dex.toggleRarity}
        onSelectAllRarities={dex.selectAllRarities}
        onClearRarities={dex.clearRarities}
        hideUnmeasured={dex.hideUnmeasured}
        onToggleHideUnmeasured={() => dex.setHideUnmeasured(v => !v)}
        compareKeys={dex.compareKeys}
        compareSearch={dex.compareSearch}
        onCompareSearchChange={dex.setCompareSearch}
        onToggleCompareKey={dex.toggleCompareKey}
        onClearCompare={dex.clearCompare}
        filteredCompareFish={dex.filteredCompareFish}
        activeFilterCount={dex.activeFilterCount}
        onClearAll={dex.clearAllFilters}
      />
    </div>
  );
}
