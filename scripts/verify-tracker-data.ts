/**
 * Verifies the Fish Tracker data layer against every fixture in
 * test-fixtures/tracker/, plus the private real fixture in
 * test-fixtures/private/ if present. This is the automated safety net
 * for the "zero data loss" requirement (docs/project-reference.md
 * "Fish Tracker storage contract") — every failure here means real user
 * data could be at risk and must be fixed before touching any UI.
 *
 * Run with: npx tsx scripts/verify-tracker-data.ts
 * (tsx is fetched on demand by npx — not a new persistent dependency.)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseImport, normalizeData, migrateV1, buildFullExport, buildSingleExport,
  makeProfile, isTrackerRenderable,
  type TrackerData, type Tracker, type Profile, type SortMode,
} from '../src/lib/trackerSchema';
import { cascadeFrom, orderedTrackers, alphabeticalOrder, genTrackId, pushCatch, fishById } from '../src/lib/trackerLogic';
import { CATCH_HISTORY_CAP, DEFAULT_PROFILE_NAME, SCHEMA_VERSION, STORAGE_KEY_V1, STORAGE_KEY_V2 } from '../src/lib/trackerConfig';
import { localTrackerStore } from '../src/lib/trackerStorage';
import { RARITY_ORDER, TIERS } from '../src/lib/fishData';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const fixtureDir = path.join(repoRoot, 'test-fixtures', 'tracker');
const privateFixture = path.join(repoRoot, 'test-fixtures', 'private', 'befish-tracker-24rolla-2026-09-23.json');

let passed = 0;
let failed = 0;

function check(label: string, cond: boolean, detail?: string): void {
  if (cond) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title: string): void {
  console.log(`\n${title}`);
}

function readJSON(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/* ── Deep superset check ──────────────────────────────────────────
   True if every key/value present in `original` is still present and
   unchanged in `after`, recursively. `after` may have extra keys (the
   documented additive fields) — this only asserts nothing original was
   lost or altered. */
function isDeepSupersetOf(after: unknown, original: unknown): boolean {
  if (original === null || typeof original !== 'object') {
    return after === original;
  }
  if (Array.isArray(original)) {
    if (!Array.isArray(after) || after.length !== original.length) return false;
    return original.every((v, i) => isDeepSupersetOf(after[i], v));
  }
  if (typeof after !== 'object' || after === null) return false;
  const afterObj = after as Record<string, unknown>;
  const originalObj = original as Record<string, unknown>;
  return Object.keys(originalObj).every(
    key => key in afterObj && isDeepSupersetOf(afterObj[key], originalObj[key]),
  );
}

function countTrackers(data: TrackerData): number {
  return data.profiles.reduce((sum, p) => sum + p.trackedFish.length, 0);
}

/* ── Frozen copy of the LIVE site's normalizeProfiles + import
   acceptance check (from main:fish-tracker.html), so round-trip
   compatibility is verified against the actual shipped logic, not this
   port's own version of it. Update this block if the live site's logic
   ever changes. ── */
type LiveProfileShape = { sortMode?: string; manualOrder?: unknown; [key: string]: unknown };
type LiveDataShape = { profiles: LiveProfileShape[]; [key: string]: unknown };

function liveNormalizeProfiles(parsed: LiveDataShape): LiveDataShape {
  parsed.profiles.forEach(p => {
    if (!p.sortMode || p.sortMode === 'default') p.sortMode = 'default-desc';
    if (!Array.isArray(p.manualOrder)) p.manualOrder = [];
  });
  return parsed;
}
function liveAcceptsImport(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false;
  const obj = json as Record<string, unknown>;
  return Array.isArray(obj.profiles) || Array.isArray(obj.trackedFish);
}

/* ── Frozen, independently-transliterated copy of the live site's
   orderedTrackers, for sort-parity comparison against this port's
   trackerLogic.ts implementation — deliberately NOT importing from
   trackerLogic.ts, since the point is to catch divergence introduced
   during the port. ── */
function liveFishById(fishId: string) {
  return fishById(fishId); // same static FISH data either way — only the sort algorithm below is the thing under test
}
function liveOrderedTrackers(trackers: Tracker[], profile: Profile): Tracker[] {
  const mode = profile.sortMode || 'default-desc';

  if (mode === 'nextfish-asc' || mode === 'nextfish-desc') {
    const desc = mode === 'nextfish-desc';
    const withEta: { t: Tracker; eta: number }[] = [];
    const withoutEta: Tracker[] = [];
    trackers.forEach(t => {
      const avg = t.catches.length < 3 ? null : (() => {
        const times = t.catches.map(c => new Date(c.timestamp).getTime()).sort((a, b) => a - b);
        let total = 0;
        for (let i = 1; i < times.length; i++) total += times[i] - times[i - 1];
        return total / (times.length - 1);
      })();
      if (avg === null) { withoutEta.push(t); return; }
      const lastCatch = t.catches[t.catches.length - 1];
      const lastTs = new Date(lastCatch.timestamp).getTime();
      const remaining = Math.max(0, 50 - t.count);
      const eta = (avg * remaining) - (Date.now() - lastTs);
      withEta.push({ t, eta });
    });
    withEta.sort((a, b) => (desc ? b.eta - a.eta : a.eta - b.eta));
    const fallbackSorted = [...withoutEta].sort((a, b) => {
      const av = liveFishById(a.fishId)?.tiers[a.tier]?.oddsNum;
      const bv = liveFishById(b.fishId)?.tiers[b.tier]?.oddsNum;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return bv - av;
    });
    return [...withEta.map(x => x.t), ...fallbackSorted];
  }

  const metricSorts: Record<string, { metric: (t: Tracker) => number | null | undefined; desc: boolean }> = {
    'default-desc': { metric: t => liveFishById(t.fishId)?.tiers[t.tier]?.oddsNum, desc: true },
    'default-asc': { metric: t => liveFishById(t.fishId)?.tiers[t.tier]?.oddsNum, desc: false },
    'rarity-desc': { metric: t => RARITY_ORDER.indexOf(liveFishById(t.fishId)!.rarity), desc: true },
    'rarity-asc': { metric: t => RARITY_ORDER.indexOf(liveFishById(t.fishId)!.rarity), desc: false },
    'xp-desc': { metric: t => liveFishById(t.fishId)?.tiers[t.tier]?.xp, desc: true },
    'xp-asc': { metric: t => liveFishById(t.fishId)?.tiers[t.tier]?.xp, desc: false },
  };
  if (metricSorts[mode]) {
    const { metric, desc } = metricSorts[mode];
    return [...trackers].sort((a, b) => {
      const av = metric(a), bv = metric(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return desc ? bv - av : av - bv;
    });
  }

  const alphabetical = [...trackers].sort((a, b) => {
    const ni = a.fishName.localeCompare(b.fishName);
    return ni !== 0 ? ni : TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier);
  });
  if (mode === 'manual') {
    if (!profile.manualOrder || profile.manualOrder.length === 0) return alphabetical;
    const byId = new Map(trackers.map(t => [t.trackId, t]));
    const ordered = profile.manualOrder.filter((id: string) => byId.has(id)).map((id: string) => byId.get(id)!);
    const orderedIds = new Set(ordered.map(t => t.trackId));
    const rest = alphabetical.filter(t => !orderedIds.has(t.trackId));
    return [...ordered, ...rest];
  }
  return alphabetical;
}

/**
 * Full-export round-trip check with an EXPLICIT allowlist of the only
 * changes `normalizeData` is specified to make — nothing broader gets a
 * free pass, including "harmless-looking" extra keys that aren't on this
 * list:
 *   - root.activeProfileId: may change ONLY if the original didn't match
 *     any real profile (repaired to the first profile's id)
 *   - root.schemaVersion: may be set/overwritten to SCHEMA_VERSION
 *   - profile.sortMode: 'default' or missing -> 'default-desc', and ONLY that
 *   - profile.manualOrder: missing -> [], and ONLY that
 *   - tracker.catches: missing -> [], and ONLY that
 * Every other key, at every level (root/profile/tracker), must be
 * byte-identical between `original` and `after` — both "value changed"
 * and "a new key appeared that isn't on this list" are flagged. Returns
 * a list of human-readable problems; empty means it passed.
 */
function checkFullRoundTrip(original: TrackerData, after: TrackerData): string[] {
  const problems: string[] = [];

  /** Compares every key of `orig` against `after`, skipping keys in
   *  `allowedToChange`, and flags any key in `after` that's new (not in
   *  `orig`) and also not in `allowedToChange`. */
  function diffExceptAllowed(
    orig: Record<string, unknown>,
    after: Record<string, unknown>,
    allowedToChange: Set<string>,
    where: string,
  ): void {
    for (const key of Object.keys(orig)) {
      if (allowedToChange.has(key)) continue;
      if (JSON.stringify(after[key]) !== JSON.stringify(orig[key])) {
        problems.push(`${where}.${key} changed unexpectedly`);
      }
    }
    for (const key of Object.keys(after)) {
      if (allowedToChange.has(key) || key in orig) continue;
      problems.push(`${where} gained an unexpected new key '${key}'`);
    }
  }

  // ── root ──
  const origHadValidActiveId = original.profiles.some(p => p.profileId === original.activeProfileId);
  if (origHadValidActiveId) {
    if (after.activeProfileId !== original.activeProfileId) {
      problems.push(`root.activeProfileId changed even though the original was already valid: '${original.activeProfileId}' -> '${after.activeProfileId}'`);
    }
  } else if (!after.profiles.some(p => p.profileId === after.activeProfileId)) {
    problems.push(`root.activeProfileId was invalid ('${original.activeProfileId}') and was NOT repaired to a real profile`);
  }
  if (after.schemaVersion !== SCHEMA_VERSION) {
    problems.push(`root.schemaVersion expected ${SCHEMA_VERSION}, got ${after.schemaVersion}`);
  }
  diffExceptAllowed(
    original as unknown as Record<string, unknown>,
    after as unknown as Record<string, unknown>,
    new Set(['activeProfileId', 'schemaVersion', 'profiles']),
    'root',
  );

  // ── profiles ──
  if (original.profiles.length !== after.profiles.length) {
    problems.push(`profile count changed: ${original.profiles.length} -> ${after.profiles.length}`);
    return problems; // nothing further is comparable
  }

  original.profiles.forEach((origProfile, i) => {
    const afterProfile = after.profiles[i];

    const expectedSortMode =
      !origProfile.sortMode || (origProfile.sortMode as string) === 'default'
        ? 'default-desc'
        : origProfile.sortMode;
    if (afterProfile.sortMode !== expectedSortMode) {
      problems.push(`profile[${i}].sortMode expected '${expectedSortMode}' (from '${origProfile.sortMode}'), got '${afterProfile.sortMode}'`);
    }

    const expectedManualOrder = Array.isArray(origProfile.manualOrder) ? origProfile.manualOrder : [];
    if (JSON.stringify(afterProfile.manualOrder) !== JSON.stringify(expectedManualOrder)) {
      problems.push(`profile[${i}].manualOrder changed unexpectedly`);
    }

    diffExceptAllowed(
      origProfile as unknown as Record<string, unknown>,
      afterProfile as unknown as Record<string, unknown>,
      new Set(['sortMode', 'manualOrder', 'trackedFish']),
      `profile[${i}]`,
    );

    // ── trackers ──
    if (origProfile.trackedFish.length !== afterProfile.trackedFish.length) {
      problems.push(`profile[${i}]: tracker count changed: ${origProfile.trackedFish.length} -> ${afterProfile.trackedFish.length}`);
      return;
    }
    origProfile.trackedFish.forEach((origTracker, j) => {
      const afterTracker = afterProfile.trackedFish[j];

      const expectedCatches = Array.isArray(origTracker.catches) ? origTracker.catches : [];
      if (JSON.stringify(afterTracker.catches) !== JSON.stringify(expectedCatches)) {
        problems.push(`profile[${i}].trackedFish[${j}].catches changed unexpectedly`);
      }

      diffExceptAllowed(
        origTracker as unknown as Record<string, unknown>,
        afterTracker as unknown as Record<string, unknown>,
        new Set(['catches']),
        `profile[${i}].trackedFish[${j}]`,
      );
    });
  });

  return problems;
}

/* ================================================================ */

section('1. Fixture round-trip: parseImport -> normalizeData -> export is a deep superset of the input');

const fixtureFiles = fs.readdirSync(fixtureDir).filter(f => f.endsWith('.json')).sort();
for (const file of fixtureFiles) {
  const json = readJSON(path.join(fixtureDir, file));
  const parsed = parseImport(json);

  if (file === 'invalid.json') {
    check(`${file}: classified as invalid`, parsed.kind === 'invalid');
    continue;
  }
  if (parsed.kind === 'invalid') {
    check(`${file}: parseImport unexpectedly classified this as invalid`, false);
    continue;
  }

  if (parsed.kind === 'full') {
    const data = normalizeData(clone(parsed.data));
    const exported = buildFullExport(data);
    const problems = checkFullRoundTrip(parsed.data, exported);
    check(`${file}: full export preserves everything except the documented normalizations`, problems.length === 0, problems.join('; '));
  } else {
    const profile = makeProfile(parsed.profileName || 'Imported Profile', clone(parsed.trackedFish));
    const exported = buildSingleExport(profile);
    check(`${file}: exported trackedFish matches the import`, isDeepSupersetOf(exported.trackedFish, parsed.trackedFish));
  }
}

section('2. Real fixture (if present): tracker/catch/count totals unchanged before vs after');
if (fs.existsSync(privateFixture)) {
  const json = readJSON(privateFixture);
  const parsed = parseImport(json);
  if (parsed.kind === 'single') {
    const before = { trackers: parsed.trackedFish.length, catches: 0, counts: 0 };
    for (const t of parsed.trackedFish) {
      before.catches += t.catches?.length ?? 0;
      before.counts += t.count;
    }

    const profile = makeProfile(parsed.profileName || 'Imported Profile', clone(parsed.trackedFish));
    const after = { trackers: profile.trackedFish.length, catches: 0, counts: 0 };
    for (const t of profile.trackedFish) {
      after.catches += t.catches?.length ?? 0;
      after.counts += t.count;
    }

    console.log(`  trackers: ${before.trackers} -> ${after.trackers}`);
    console.log(`  total catches: ${before.catches} -> ${after.catches}`);
    console.log(`  sum of counts: ${before.counts} -> ${after.counts}`);
    check('real fixture: tracker count unchanged', before.trackers === after.trackers);
    check('real fixture: total catch count unchanged', before.catches === after.catches);
    check('real fixture: sum of counts unchanged', before.counts === after.counts);
  } else {
    check('real fixture: classified as a single-profile export', false, `got kind=${parsed.kind}`);
  }
} else {
  console.log('  (no private fixture present at test-fixtures/private/ — skipping)');
}

section('3. v1-flat.json migrates to one Main Account profile, nothing lost');
{
  const raw = readJSON(path.join(fixtureDir, 'v1-flat.json')) as { trackedFish: Tracker[] };
  const migrated = migrateV1(raw);
  check('exactly one profile created', migrated.profiles.length === 1);
  check('profile named Main Account', migrated.profiles[0].profileName === DEFAULT_PROFILE_NAME);
  check('all trackers present', migrated.profiles[0].trackedFish.length === raw.trackedFish.length,
    `${migrated.profiles[0].trackedFish.length} vs ${raw.trackedFish.length}`);
  const craftTargetTracker = migrated.profiles[0].trackedFish.find(t => 'craftTarget' in t);
  check('legacy craftTarget field preserved', !!craftTargetTracker && craftTargetTracker.craftTarget === 50);
}

section('4. edge-cases.json: nothing dropped, invalid trackers hidden (not deleted), bad activeProfileId repaired');
{
  const raw = readJSON(path.join(fixtureDir, 'edge-cases.json')) as TrackerData;
  const before = countTrackers(raw);
  const data = normalizeData(clone(raw));
  const after = countTrackers(data);
  check('tracker count unchanged (nothing dropped)', before === after, `${before} vs ${after}`);

  const profile = data.profiles[0];
  const noCatches = profile.trackedFish.find(t => t.trackId === 't_1700000011000_nocatches');
  check('missing catches becomes []', !!noCatches && Array.isArray(noCatches.catches) && noCatches.catches.length === 0);

  const longCatch = profile.trackedFish.find(t => t.trackId === 't_1700000012000_longcatch');
  check('pre-existing 55-entry catch list is left as-is by normalizeData (cap only applies on new pushCatch calls)',
    !!longCatch && longCatch.catches.length === 55);

  const unknownFish = profile.trackedFish.find(t => t.trackId === 't_1700000013000_unknownfish');
  check('unknown-fishId tracker still present in data', !!unknownFish);
  check('unknown-fishId tracker is not renderable', !!unknownFish && !isTrackerRenderable(unknownFish));

  const invalidTier = profile.trackedFish.find(t => t.trackId === 't_1700000014000_invalidtier');
  check('invalid-tier tracker still present in data', !!invalidTier);
  check('invalid-tier tracker is not renderable', !!invalidTier && !isTrackerRenderable(invalidTier));

  const hiddenCount = profile.trackedFish.filter(t => !isTrackerRenderable(t)).length;
  check('exactly 2 trackers hidden (unknown fish + invalid tier)', hiddenCount === 2, `got ${hiddenCount}`);

  check('bad activeProfileId repaired to an existing profile', data.profiles.some(p => p.profileId === data.activeProfileId));
}

section('5. Round trip: this port\'s export is accepted by a frozen copy of the live import/normalize logic');
{
  const raw = readJSON(path.join(fixtureDir, 'v2-full-backup.json')) as TrackerData;
  const data = normalizeData(clone(raw));
  const exported = buildFullExport(data);
  check('live import logic accepts the export (has profiles[])', liveAcceptsImport(exported));
  const liveNormalized = liveNormalizeProfiles(clone(exported));
  check('live normalizeProfiles runs without throwing and preserves profile count',
    liveNormalized.profiles.length === exported.profiles.length);
}

section('6. cascadeFrom: crafting cascade, multi-tier chain, catch cap');
{
  // 49 -> +1 crafts and resets to 0, creating the next tier
  const t: Tracker = {
    trackId: genTrackId(), fishId: '01', fishName: 'Goldfish', tier: 'Normal',
    startCount: 0, count: 49, catches: [{ count: 49, timestamp: new Date().toISOString() }],
  };
  const trackedFish: Tracker[] = [t];
  t.count++; // simulate the +1 catch that reaches 50
  const toasts: string[] = [];
  cascadeFrom(t, trackedFish, toasts);
  check('tracker resets to 0 after crafting', t.count === 0);
  check('exactly one toast for a single craft', toasts.length === 1, `got ${toasts.length}`);
  const golden = trackedFish.find(x => x.tier === 'Golden');
  check('next-tier (Golden) tracker created', !!golden);
  check('next-tier tracker has dateObtained', !!golden?.dateObtained);
  check('next-tier tracker seeded with exactly one catch', golden?.catches.length === 1);

  // Multi-tier chain: pre-seed Golden and Rainbow at 49 so bumping Normal
  // to 50 cascades all the way through to Glowing in one call.
  const chainStart: Tracker = {
    trackId: genTrackId(), fishId: '02', fishName: 'Sardine', tier: 'Normal',
    startCount: 0, count: 50, catches: [{ count: 50, timestamp: new Date().toISOString() }],
  };
  const chainFish: Tracker[] = [
    chainStart,
    { trackId: genTrackId(), fishId: '02', fishName: 'Sardine', tier: 'Golden', startCount: 0, count: 49, catches: [{ count: 49, timestamp: new Date().toISOString() }] },
    { trackId: genTrackId(), fishId: '02', fishName: 'Sardine', tier: 'Rainbow', startCount: 0, count: 49, catches: [{ count: 49, timestamp: new Date().toISOString() }] },
  ];
  const chainToasts: string[] = [];
  cascadeFrom(chainStart, chainFish, chainToasts);
  const glowing = chainFish.find(x => x.tier === 'Glowing');
  check('multi-tier cascade reaches Glowing', !!glowing);
  check('multi-tier cascade produced multiple toasts', chainToasts.length >= 3, `got ${chainToasts.length}`);

  // Catch cap
  const capCatches: { count: number; timestamp: string }[] = [];
  for (let i = 0; i < CATCH_HISTORY_CAP; i++) {
    capCatches.push({ count: i, timestamp: new Date(Date.now() + i).toISOString() });
  }
  pushCatch(capCatches, { count: 999, timestamp: new Date().toISOString() });
  check(`catch cap holds at ${CATCH_HISTORY_CAP}`, capCatches.length === CATCH_HISTORY_CAP, `got ${capCatches.length}`);
  check('oldest entry dropped, newest kept', capCatches[capCatches.length - 1].count === 999);
}

section('7. Sort parity: this port\'s orderedTrackers matches a frozen transliteration of the live sort logic');
{
  const now = Date.now();
  const mkCatches = (n: number, spacingMs: number) =>
    Array.from({ length: n }, (_, i) => ({ count: i + 1, timestamp: new Date(now - (n - i) * spacingMs).toISOString() }));

  const sample: Tracker[] = [
    { trackId: 'a', fishId: '01', fishName: 'Goldfish', tier: 'Normal', startCount: 0, count: 10, catches: mkCatches(4, 3600_000) },
    { trackId: 'b', fishId: '60', fishName: 'Whale Shark', tier: 'Normal', startCount: 0, count: 10, catches: [] },
    { trackId: 'c', fishId: '21', fishName: 'Piranha', tier: 'Golden', startCount: 0, count: 10, catches: mkCatches(5, 1800_000) },
    { trackId: 'd', fishId: '09', fishName: 'Starfish', tier: 'Rainbow', startCount: 0, count: 10, catches: [] },
  ];
  const baseProfile: Profile = {
    profileId: 'p_test', profileName: 'Sort Test', createdAt: new Date().toISOString(),
    sortMode: 'default-desc', manualOrder: [], trackedFish: sample,
  };

  // All 9 SortMode values — 'manual' included, with a representative
  // manualOrder so it's a meaningful comparison, not just the empty-order
  // alphabetical-fallback case (that's tested separately below).
  const modes: { mode: SortMode; manualOrder?: string[] }[] = [
    { mode: 'default-desc' }, { mode: 'default-asc' },
    { mode: 'rarity-desc' },  { mode: 'rarity-asc' },
    { mode: 'xp-desc' },      { mode: 'xp-asc' },
    { mode: 'nextfish-desc' }, { mode: 'nextfish-asc' },
    { mode: 'manual', manualOrder: ['d', 'a'] },
  ];
  check('all 9 SortMode values are covered by this loop', modes.length === 9, `got ${modes.length}`);
  for (const { mode, manualOrder } of modes) {
    const profile: Profile = { ...baseProfile, sortMode: mode, manualOrder: manualOrder ?? [] };
    const mine = orderedTrackers(sample, profile).map(t => t.trackId);
    const reference = liveOrderedTrackers(sample, profile).map(t => t.trackId);
    check(`sort '${mode}' matches the live reference`, JSON.stringify(mine) === JSON.stringify(reference),
      `mine=${JSON.stringify(mine)} reference=${JSON.stringify(reference)}`);
  }

  // manual, in more detail: empty manualOrder falls back to alphabetical
  const manualEmpty: Profile = { ...baseProfile, sortMode: 'manual', manualOrder: [] };
  const manualEmptyResult = orderedTrackers(sample, manualEmpty).map(t => t.trackId);
  const expectedAlpha = alphabeticalOrder(sample).map(t => t.trackId);
  check('manual with empty manualOrder falls back to alphabetical',
    JSON.stringify(manualEmptyResult) === JSON.stringify(expectedAlpha));

  // manual order is respected, and trackers NOT in manualOrder (i.e. newly
  // tracked since the order was last saved) are appended after it
  const manualSet: Profile = { ...baseProfile, sortMode: 'manual', manualOrder: ['d', 'a'] };
  const manualSetResult = orderedTrackers(sample, manualSet).map(t => t.trackId);
  check('manual order is respected, new (unlisted) trackers appended after',
    manualSetResult[0] === 'd' && manualSetResult[1] === 'a' && manualSetResult.length === sample.length,
    JSON.stringify(manualSetResult));

  // stale trackIds in manualOrder (referencing a tracker that no longer
  // exists, e.g. deleted since the order was saved) are silently ignored,
  // not left as gaps or errors
  const manualStale: Profile = {
    ...baseProfile, sortMode: 'manual',
    manualOrder: ['d', 't_deleted_no_longer_exists', 'a', 'also_stale'],
  };
  const manualStaleResult = orderedTrackers(sample, manualStale).map(t => t.trackId);
  check('stale trackIds in manualOrder are ignored (filtered out, not left as gaps)',
    manualStaleResult[0] === 'd' && manualStaleResult[1] === 'a' && manualStaleResult.length === sample.length,
    JSON.stringify(manualStaleResult));
}

section('8. Storage layer: localTrackerStore.load()/save() behavior on a mock localStorage');
{
  /** Minimal in-memory Storage-like mock so trackerStorage.ts's
   *  `isBrowser()` check (`typeof window.localStorage !== 'undefined'`)
   *  is satisfied under Node. `writeCount` lets tests assert "zero
   *  writes" precisely, not just infer it from final state. */
  class MemoryStorage {
    store = new Map<string, string>();
    writeCount = 0;
    getItem(key: string): string | null {
      return this.store.has(key) ? this.store.get(key)! : null;
    }
    setItem(key: string, value: string): void {
      this.writeCount++;
      this.store.set(key, value);
    }
    removeItem(key: string): void { this.store.delete(key); }
    clear(): void { this.store.clear(); }
    get length(): number { return this.store.size; }
    key(index: number): string | null { return Array.from(this.store.keys())[index] ?? null; }
  }

  function installMockWindow(mock: MemoryStorage): void {
    (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = { localStorage: mock };
  }

  // (a) load() on empty storage performs zero writes
  {
    const mock = new MemoryStorage();
    installMockWindow(mock);
    const result = localTrackerStore.load();
    check('(a) load() on empty storage reports source "first-visit"', result.ok && result.source === 'first-visit');
    check('(a) load() on empty storage performs zero writes', mock.writeCount === 0, `writeCount=${mock.writeCount}`);
  }

  // (b) corrupt JSON in v2 is never overwritten by load() — including a
  // subsequent (second) load() call, so this isn't a one-shot fluke
  {
    const mock = new MemoryStorage();
    const corrupt = '{ this is not valid json !!!';
    mock.store.set(STORAGE_KEY_V2, corrupt);
    installMockWindow(mock);

    const result1 = localTrackerStore.load();
    check('(b) corrupt v2 JSON: load() returns ok:false', result1.ok === false);
    check('(b) corrupt v2 JSON: unchanged after load()', mock.store.get(STORAGE_KEY_V2) === corrupt);
    check('(b) corrupt v2 JSON: load() itself performed zero writes', mock.writeCount === 0, `writeCount=${mock.writeCount}`);

    // A subsequent load attempt must behave identically — still no write.
    const result2 = localTrackerStore.load();
    check('(b) corrupt v2 JSON: still ok:false on a subsequent load()', result2.ok === false);
    check('(b) corrupt v2 JSON: still unchanged after a subsequent load()', mock.store.get(STORAGE_KEY_V2) === corrupt);
    check('(b) corrupt v2 JSON: still zero writes after a subsequent load()', mock.writeCount === 0, `writeCount=${mock.writeCount}`);
  }

  // (c) v1 -> v2 migration leaves befish-tracker-v1 byte-identical
  {
    const mock = new MemoryStorage();
    const v1Raw = JSON.stringify({
      trackedFish: [{ trackId: 't_x', fishId: '01', fishName: 'Goldfish', tier: 'Normal', startCount: 0, count: 5, catches: [] }],
    });
    mock.store.set(STORAGE_KEY_V1, v1Raw);
    installMockWindow(mock);

    const result = localTrackerStore.load();
    check('(c) v1 migration: load() reports source "v1-migrated"', result.ok && result.source === 'v1-migrated');
    check('(c) v1 migration: v1 key left byte-identical', mock.store.get(STORAGE_KEY_V1) === v1Raw);
    check('(c) v1 migration: v2 key was written (the one allowed migration write)', mock.store.has(STORAGE_KEY_V2));
    check('(c) v1 migration: exactly one write occurred', mock.writeCount === 1, `writeCount=${mock.writeCount}`);
  }

  // Clean up the global so nothing after this section accidentally
  // observes a mock `window`.
  delete (globalThis as unknown as { window?: unknown }).window;
}

/* ================================================================ */
console.log(`\n${'='.repeat(60)}`);
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('FAILED — do not proceed to UI work until this is clean.');
  process.exit(1);
} else {
  console.log('ALL CHECKS PASSED');
  process.exit(0);
}
