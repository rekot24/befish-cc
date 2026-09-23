/** FishCard — renders one fish × tier combination.
 *  Receives all data as props — no state, no hooks, no side effects.
 *  Card structure is locked; see design-decisions.md before changing layout. */

import Image from 'next/image';
import { TIERS, type Fish, type Tier, RC, TC } from '../../lib/fishData';
import styles from './FishCard.module.css';

interface FishCardProps {
  fish: Fish;
  tier: Tier;
  /** The stat currently being sorted by — highlighted in the card */
  sortStat?: 'growth' | 'speed' | 'xp' | 'rarity' | null;
}

export default function FishCard({ fish, tier, sortStat }: FishCardProps) {
  const td      = fish.tiers[tier];
  const rc      = RC[fish.rarity];
  const tc      = TC[tier];
  const imgSrc  = `/img/${fish.id}-${TIERS.indexOf(tier) + 1}.png`;
  const allNull = td.growth === null && td.speed === null && td.xp === null;

  return (
    <div
      className={`${styles.card}${allNull ? ` ${styles.allUnknown}` : ''}`}
      style={{
        '--tier-color':    tc,
        '--rarity-color':  fish.bg,
      } as React.CSSProperties}
    >
      <div className={styles.tierBadge}>{tier}</div>

      {/* Top — rarity ingame color background */}
      <div className={styles.top}>
        <div className={styles.topInfo}>
          <div className={styles.fishName}>{fish.name}</div>
          <div className={styles.rarityBadge}>{fish.rarity}</div>
          <div className={`${styles.odds}${sortStat === 'rarity' ? ` ${styles.highlight}` : ''}`}>
            {td.odds}
          </div>
        </div>
        <div className={styles.imgWrap}>
          <Image
            src={imgSrc}
            alt={fish.name}
            width={63}
            height={63}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>

      {/* Body — white stats, rarity-colored bars */}
      <div className={styles.body}>
        <StatRow
          label="Growth"
          value={td.growth}
          color={rc.bar}
          highlight={sortStat === 'growth'}
        />
        <StatRow
          label="Speed"
          value={td.speed}
          color={rc.bar}
          highlight={sortStat === 'speed'}
        />
        <div className={styles.xpRow}>
          <span style={sortStat === 'xp' ? { color: rc.bar, fontWeight: 700 } : undefined}>
            XP multiplier
          </span>
          {td.xp !== null
            ? <span
                className={`${styles.xpVal}${sortStat === 'xp' ? ` ${styles.highlight}` : ''}`}
                style={sortStat === 'xp' ? { color: rc.bar } : undefined}
              >
                {td.xp}x
              </span>
            : <span className={styles.xpUnknown}>???</span>
          }
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label, value, color, highlight,
}: {
  label: string;
  value: number | null;
  color: string;
  highlight: boolean;
}) {
  return (
    <div className={styles.statRow}>
      <div
        className={`${styles.statLabel}${highlight ? ` ${styles.highlight}` : ''}`}
        style={highlight ? { color } : undefined}
      >
        {label}
      </div>
      {value !== null ? (
        <>
          <div className={styles.barTrack}>
            <div
              className={`${styles.barFill}${highlight ? ` ${styles.highlight}` : ''}`}
              style={{ width: `${value}%`, background: color }}
            />
          </div>
          <div
            className={`${styles.statVal}${highlight ? ` ${styles.highlight}` : ''}`}
            style={highlight ? { color } : undefined}
          >
            {value}
          </div>
        </>
      ) : (
        <>
          <div className={styles.barUnknown} />
          <div className={`${styles.statVal} ${styles.unknown}`}>???</div>
        </>
      )}
    </div>
  );
}
