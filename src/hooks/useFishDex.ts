'use client';

/** useFishDex — all Fish Dex state, filter, sort, and compare logic.
 *  The FishDex component reads from this hook and never manages state directly.
 *  This is the React equivalent of the stateful variables and render() function
 *  in the original fishdex.html inline script. */

import { useState, useMemo, useCallback } from 'react';
import { FISH, TIERS, RARITY_ORDER, type Fish, type Tier, type Rarity } from '../lib/fishData';

export type SortKey =
  | 'default'
  | 'growth-desc' | 'growth-asc'
  | 'speed-desc'  | 'speed-asc'
  | 'xp-desc'     | 'xp-asc'
  | 'rarity-asc'  | 'rarity-desc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',      label: 'Default order' },
  { value: 'speed-desc',   label: 'Speed — high to low' },
  { value: 'speed-asc',    label: 'Speed — low to high' },
  { value: 'growth-desc',  label: 'Growth — high to low' },
  { value: 'growth-asc',   label: 'Growth — low to high' },
  { value: 'xp-desc',      label: 'XP — high to low' },
  { value: 'xp-asc',       label: 'XP — low to high' },
  { value: 'rarity-asc',   label: 'Rarity — rarest first' },
  { value: 'rarity-desc',  label: 'Rarity — most common first' },
];

export type FishEntry = { fish: Fish; tier: Tier };

function tierHasStats(fish: Fish, tier: Tier): boolean {
  const td = fish.tiers[tier];
  return td.growth !== null || td.speed !== null;
}

export function useFishDex() {
  /* ── Filter state ── */
  const [activeTiers, setActiveTiers]       = useState<Set<Tier>>(new Set(TIERS));
  const [activeRarities, setActiveRarities] = useState<Set<Rarity>>(new Set(RARITY_ORDER));
  const [hideUnmeasured, setHideUnmeasured] = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [sortKey, setSortKey]               = useState<SortKey>('default');

  /* ── Compare state ── */
  const [compareKeys, setCompareKeys]       = useState<Set<string>>(new Set());
  const [compareSearch, setCompareSearch]   = useState('');
  const [drawerOpen, setDrawerOpen]         = useState(false);

  /* ── Toggle helpers ── */
  const toggleTier = useCallback((tier: Tier) => {
    setActiveTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier); else next.add(tier);
      return next;
    });
  }, []);

  const toggleRarity = useCallback((rarity: Rarity) => {
    setActiveRarities(prev => {
      const next = new Set(prev);
      if (next.has(rarity)) next.delete(rarity); else next.add(rarity);
      return next;
    });
  }, []);

  const toggleCompareKey = useCallback((key: string) => {
    setCompareKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const selectAllTiers    = useCallback(() => setActiveTiers(new Set(TIERS)), []);
  const selectAllRarities = useCallback(() => setActiveRarities(new Set(RARITY_ORDER)), []);
  const clearCompare      = useCallback(() => setCompareKeys(new Set()), []);

  /* Empty selection, not "select all" — matches the chip UI's off state. */
  const clearTiers    = useCallback(() => setActiveTiers(new Set()), []);
  const clearRarities = useCallback(() => setActiveRarities(new Set()), []);

  const clearAllFilters = useCallback(() => {
    setActiveTiers(new Set(TIERS));
    setActiveRarities(new Set(RARITY_ORDER));
    setHideUnmeasured(false);
    setCompareKeys(new Set());
    setSortKey('default');
  }, []);

  /* ── Active filter count (for badge) ── */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeTiers.size < TIERS.length) count++;
    if (activeRarities.size < RARITY_ORDER.length) count++;
    if (hideUnmeasured) count++;
    if (compareKeys.size > 0) count++;
    if (sortKey !== 'default') count++;
    return count;
  }, [activeTiers, activeRarities, hideUnmeasured, compareKeys, sortKey]);

  /* ── Derived: fish visible in compare panel ── */
  const comparableFish = useMemo(() =>
    FISH.filter(f => TIERS.some(t => tierHasStats(f, t))),
  []);

  const filteredCompareFish = useMemo(() => {
    const q = compareSearch.trim().toLowerCase();
    return q ? comparableFish.filter(f => f.name.toLowerCase().includes(q)) : comparableFish;
  }, [comparableFish, compareSearch]);

  /* ── Main filtered + sorted entries ── */
  const entries = useMemo((): FishEntry[] => {
    const q = searchQuery.trim().toLowerCase();

    const result: FishEntry[] = [];
    for (const fish of FISH) {
      if (!activeRarities.has(fish.rarity)) continue;
      if (q && !fish.name.toLowerCase().includes(q)) continue;
      for (const tier of TIERS) {
        if (!activeTiers.has(tier)) continue;
        const td = fish.tiers[tier];
        if (hideUnmeasured && td.speed === null && td.growth === null && td.xp === null) continue;
        const key = `${fish.id}|${tier}`;
        if (compareKeys.size > 0 && !compareKeys.has(key)) continue;
        result.push({ fish, tier });
      }
    }

    if (sortKey === 'default') {
      result.sort((a, b) => {
        const ri = RARITY_ORDER.indexOf(a.fish.rarity) - RARITY_ORDER.indexOf(b.fish.rarity);
        if (ri !== 0) return ri;
        const ii = a.fish.id.localeCompare(b.fish.id);
        if (ii !== 0) return ii;
        return TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier);
      });
      return result;
    }

    const desc = sortKey.endsWith('desc');

    if (sortKey.startsWith('rarity')) {
      return [...result].sort((a, b) => {
        const av = a.fish.tiers[a.tier].oddsNum ?? Infinity;
        const bv = b.fish.tiers[b.tier].oddsNum ?? Infinity;
        return desc ? bv - av : av - bv;
      });
    }

    const statKey = sortKey.startsWith('growth') ? 'growth'
                  : sortKey.startsWith('speed')  ? 'speed' : 'xp';

    return [...result].sort((a, b) => {
      const av = a.fish.tiers[a.tier][statKey];
      const bv = b.fish.tiers[b.tier][statKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return desc ? bv - av : av - bv;
    });
  }, [activeTiers, activeRarities, hideUnmeasured, searchQuery, sortKey, compareKeys]);

  const speciesCount = useMemo(() =>
    new Set(entries.map(e => e.fish.id)).size,
  [entries]);

  return {
    /* state */
    activeTiers, activeRarities, hideUnmeasured,
    searchQuery, sortKey, compareKeys, compareSearch,
    drawerOpen,
    /* derived */
    entries, speciesCount, activeFilterCount,
    comparableFish, filteredCompareFish,
    /* setters */
    setSearchQuery, setSortKey, setCompareSearch,
    setHideUnmeasured, setDrawerOpen,
    /* toggles */
    toggleTier, toggleRarity, toggleCompareKey,
    selectAllTiers, selectAllRarities,
    clearTiers, clearRarities,
    clearCompare, clearAllFilters,
  };
}
