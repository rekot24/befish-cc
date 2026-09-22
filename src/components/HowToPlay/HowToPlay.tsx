/** How to Play page component — renders all content sections using shared section components. */
import Link from 'next/link';
import SectionBlock from '../SectionBlock/SectionBlock';
import PageHeading from '../PageHeading/PageHeading';
import TipBox from '../TipBox/TipBox';
import InfoCard from '../InfoCard/InfoCard';
import InfoGrid from '../InfoGrid/InfoGrid';
import DataTable from '../DataTable/DataTable';
import styles from './HowToPlay.module.css';
import {
  FISH_STATS,
  SCREEN_ELEMENTS,
  BOOSTS,
  PASSES,
  GEM_AMOUNTS,
  TIER_CHAIN,
} from '../../lib/howToPlayData';

/** Capitalizes the first letter — used to build CSS module class names from data keys
 *  (e.g. 'golden' -> 'tierGolden'), matching the module's camelCase class naming. */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function HowToPlay() {
  return (
    <div className="page-wrap">
      <PageHeading
        title="How to Play"
        subtitle="Game mechanics, UI guide, boosts, passes, and everything else explained"
      />

      {/* ── The Basics ── */}
      <SectionBlock id="basics" icon="🐠" title="The Basics" variant="cyan"
        desc="Be Fish is an idle fish collection game on Roblox. You control a fish in the fish tank. Eat food pellets and other fish to grow larger and collect fish in your net. The fish you have equipped determines your Growth, Speed, and XP multiplier stats. Higher-tier and rarer fish have dramatically better stats."
      >
        <p className={styles.bodyText}>
          There are <strong>60 unique species</strong>, each in 5 tiers, for 300 total collectibles.
          You only ever get Normal-tier fish in your net — to get higher tiers, craft them by
          collecting multiples of the same species:
        </p>
        <div className={styles.tierChain}>
          {TIER_CHAIN.map((tier, i) => (
            <span key={tier.label} className={styles.tierChainItem}>
              {i > 0 && <span className={styles.tierArrow}>→ {TIER_CHAIN[i].multiplier}</span>}
              <span className={`${styles.tierPill} ${styles[`tier${capitalize(tier.key)}`]}`}>
                {tier.label}
              </span>
            </span>
          ))}
        </div>
        <TipBox>
          💡 Crafting 50 Normal turns into 1 Golden — then you start with 0 Golden of that fish.
          Next you need 50 more Golden to craft into Rainbow, and so on. Want the exact cumulative
          totals? See <Link href="/mechanics#merging">Game Mechanics → Merging &amp; Tiers</Link>.
        </TipBox>
      </SectionBlock>

      {/* ── Fish Stats ── */}
      <SectionBlock id="fish-stats" icon="📊" title="Fish Stats" variant="purple"
        desc="Every fish has two core stats displayed as a bar. The Fish Dex on this wiki converts those bars to a 1–100 numerical scale for easy comparison. Stats shown as ??? haven't been measured yet."
      >
        <InfoGrid>
          {FISH_STATS.map(stat => (
            <InfoCard key={stat.value} label={stat.label} value={stat.value} note={stat.note} />
          ))}
        </InfoGrid>
        <TipBox>
          💡 While growing big can feel rewarding, the real endgame is collecting fish for your
          FishDex. More time in the tank = more nets and better fish. Collecting fish also earns
          permanent bonuses — see <Link href="/mechanics#fishdex-bonus">Game Mechanics → Fishdex Collection Bonus</Link>.
        </TipBox>
      </SectionBlock>

      {/* ── Game Screen Guide ── */}
      <SectionBlock id="screen-guide" icon="🖥️" title="In-Tank Game Screen Guide" variant="cyan"
        desc="Every element you see during gameplay, explained:"
      >
        <DataTable
          headers={['Element', 'Location', 'Description']}
          rows={SCREEN_ELEMENTS.map(el => [el.element, el.location, el.desc])}
        />
        <TipBox>
          💡 Auto Farm will automatically collect food and rejoin if eaten. Every 20 minutes you
          reset to the lobby and it starts again. This is the best way to increase your collection
          — let this run as much as possible.
        </TipBox>
      </SectionBlock>

      {/* ── Boosts ── */}
      <SectionBlock id="boosts" icon="🫧" title="Boosts" variant="purple"
        desc="Boosts are temporary power-ups purchased with Robux. They last for a set duration, then expire. You can use more than one, but it only increases the time, not the bonus. Access them from the Boosts button at the bottom-right of the game screen. All boosts stack with passes and Fishdex bonuses."
      >
        <div className={styles.boostGrid}>
          {BOOSTS.map(boost => (
            <div key={boost.name} className={styles.boostCard}>
              <span className={`${styles.durTag} ${styles[`dur${capitalize(boost.durationColor)}`]}`}>
                {boost.duration}
              </span>
              <span className={styles.boostIcon}>{boost.icon}</span>
              <span className={styles.boostName}>{boost.name}</span>
              <p className={styles.boostDesc}>{boost.desc}</p>
            </div>
          ))}
        </div>
        <TipBox>
          💡 Luck boosts are the worst value — unlikely to make any significant impact for the
          cost. Don&apos;t buy boosts unless you&apos;ve already bought all the passes.
        </TipBox>
      </SectionBlock>

      {/* ── Passes ── */}
      <SectionBlock id="passes" icon="🎫" title="Passes" variant="cyan"
        desc="Passes are permanent upgrades purchased with Robux. One-time purchase that never expires and is always active — unlike boosts, which are temporary."
      >
        <div className={styles.passGrid}>
          {PASSES.map(pass => (
            <div key={pass.name} className={styles.passCard}>
              <span className={styles.passIcon}>{pass.icon}</span>
              <span className={styles.passName}>{pass.name}</span>
              <p className={styles.passDesc}>{pass.desc}</p>
            </div>
          ))}
        </div>
        <TipBox>
          💡 If you&apos;re only buying one pass, <strong>Double Loot</strong> gives the best
          return — it permanently doubles every net you get. If you plan to play for any
          significant amount of time, all the passes are worth getting.
        </TipBox>
      </SectionBlock>

      {/* ── Gems ── */}
      <SectionBlock id="gems" icon="💎" title="Gems" variant="purple"
        desc="Gems are the premium currency in Be Fish, purchased with Robux. Their primary use is to instantly skip Treasure Chest unlock timers, giving you immediate access to the fish inside and permanently increasing Luck. Pricing varies per account, time period, and geographic region."
      >
        <div className={styles.gemGrid}>
          {GEM_AMOUNTS.map(gem => (
            <div key={gem.amount} className={styles.gemCard}>
              <span className={styles.gemAmount}>{gem.amount}</span>
              <span className={styles.gemLabel}>Gems</span>
            </div>
          ))}
        </div>
        <TipBox>
          📦 Gems are the only way to achieve high levels of luck without waiting years. It takes
          roughly 14,500 chests opened to achieve 50,000 luck — about 54.5 million gems, or almost
          7 years of waiting. Mythic fish appear in nets at 50,000 Luck.
        </TipBox>
      </SectionBlock>

    </div>
  );
}
