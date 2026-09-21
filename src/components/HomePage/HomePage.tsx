import NavCard from '../NavCard/NavCard';
import styles from './HomePage.module.css';

/**
 * Data for the four homepage navigation cards.
 * Add, remove, or reorder here — the grid renders whatever is in this array.
 */
const NAV_CARDS = [
  {
    emoji: '🐠',
    title: 'Fish Dex',
    desc: 'Browse all 60 fish across every tier. Filter by rarity, sort by growth or speed.',
    href: '/fishdex',
    cta: 'Open Fish Dex →',
  },
  {
    emoji: '📖',
    title: 'How to Play',
    desc: 'Learn the basics — fish stats, boosts, passes, gems, and every UI element explained.',
    href: '/how-to-play',
    cta: 'Read the Guide →',
  },
  {
    emoji: '🔧',
    title: 'Game Mechanics',
    desc: 'The full breakdown of growth, speed, luck odds, and loot math — how the numbers work.',
    href: '/mechanics',
    cta: 'Explore Mechanics →',
  },
  {
    emoji: '💡',
    title: 'Tips & Tricks',
    desc: 'Advanced strategies and techniques to improve your gameplay and climb the leaderboard.',
    href: '/tips',
    cta: 'See All Tips →',
  },
];

/**
 * Stats bar data.
 * Each entry renders as a number + label pair.
 */
const STATS = [
  { value: '60',  label: 'Species' },
  { value: '300', label: 'Collectibles' },
  { value: '5',   label: 'Tiers' },
  { value: '6',   label: 'Rarities' },
];

export default function HomePage() {
  return (
    <div className="page-wrap">

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Roblox Fan Wiki</p>
        <h1 className={styles.heroTitle}>
          <span className={styles.wordBefish}>Be Fish </span>
          <span className={styles.wordWiki}>Wiki</span>
        </h1>
        <p className={styles.tagline}>
          300 collectibles. Every known stat. All in one place.
        </p>
        <div className={styles.heroCtas}>
          {/* Global button classes from globals.css — do not add btn styles to HomePage.module.css */}
          <a href="/fishdex" className="btn-primary">Browse Fish Dex</a>
          <a href="/how-to-play" className="btn-secondary">How to Play</a>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className={styles.statsBar}>
        {STATS.map(({ value, label }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statNumber}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </section>

      {/* ── What is Be Fish ── */}
      <section className={styles.about}>
        <h2 className={styles.sectionHeader}>What is Be Fish?</h2>
        <p className={styles.aboutText}>
          Be Fish is an idle fish and collection game on Roblox. You control a fish in the
          ocean — eat food to grow, and collect rare fish along the way. With 60 unique species
          each available in 5 tiers, there are 300 total collectibles to discover. Your equipped
          fish determines your Growth, Speed, and XP multiplier stats, all of which stack with
          boosts and passes to help you dominate the leaderboard. Compiled by top leaderboard players.
        </p>
      </section>

      {/* ── Nav cards ── */}
      <section className={styles.cards}>
        {NAV_CARDS.map((card) => (
          <NavCard key={card.href} {...card} />
        ))}
      </section>

    </div>
  );
}
