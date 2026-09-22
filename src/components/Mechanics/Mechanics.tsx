/** Game Mechanics page component. Dense reference content —
 *  tables, formulas, and stat callouts using the shared section components. */
import Link from 'next/link';
import SectionBlock from '../SectionBlock/SectionBlock';
import PageHeading from '../PageHeading/PageHeading';
import TipBox from '../TipBox/TipBox';
import InfoCard from '../InfoCard/InfoCard';
import InfoGrid from '../InfoGrid/InfoGrid';
import DataTable from '../DataTable/DataTable';
import styles from './Mechanics.module.css';
import {
  PASS_MECHANICS,
  FISHDEX_REWARDS,
  LUCK_THRESHOLDS,
  TREASURE_STATS,
  MERGING_ROWS,
  AFK_STATS,
  LUCK_DROP_ROWS,
} from '../../lib/mechanicsData';

export default function Mechanics() {
  return (
    <div className="page-wrap">
      <PageHeading
        title="Game Mechanics"
        subtitle="How growth, speed, luck, and loot actually work under the hood"
      />

      {/* ── Growth ── */}
      <SectionBlock id="growth" icon="📏" title="Growth"
        desc="Every fish has a Growth Multiplier that scales how much size you gain from each food pellet or fish you eat. Higher rarity and higher tier both push this number up dramatically — see the exact per-fish Growth stat for every species and tier on the Fish Dex. Different food types also carry different base size values, so a Growth Multiplier is a multiplier on top of whatever you're eating, not a flat amount."
      >
        <TipBox>
          📐 The size number displayed above your fish keeps climbing <strong>indefinitely</strong> — there is no ceiling
          on the stat itself. What does stop is the physical model: your fish&apos;s hitbox and visual size cap out at{' '}
          <strong>335,580 size</strong>. Past that point the number keeps growing forever, but your fish stops visibly
          getting bigger in the tank.
        </TipBox>
      </SectionBlock>

      {/* ── XP & Loot Bar ── */}
      <SectionBlock id="xp-loot" icon="⚡" title="XP & Loot Bar"
        desc="Your XP Multiplier controls how fast the loot bar at the bottom of the screen fills up. The amount of food needed to fill the bar is inversely proportional to your XP Multiplier — double your multiplier and you need roughly half as much food. Practically: a bigger multiplier means more nets, faster, for the same amount of eating."
      >
        <TipBox>
          🎣 The <strong>Double Loot</strong> pass doesn&apos;t change how fast the bar fills — it changes what happens
          when it fills. Instead of 1 fish per completed bar, you get 2. See{' '}
          <Link href="/how-to-play#passes">How to Play → Passes</Link> for purchasing details.
        </TipBox>
      </SectionBlock>

      {/* ── Speed ── */}
      <SectionBlock id="speed" icon="💨" title="Speed"
        desc="Speed Multiplier scales by rarity and tier — check the Fish Dex for exact numbers per species. Faster fish survive longer and catch food more reliably by reaching it first. Speed doesn't directly multiply your loot bar fill rate the way XP Multiplier does, but it improves your effective XP over time — a faster fish intercepts more food per minute, which means more XP earned per minute even at the same XP Multiplier."
      >
      </SectionBlock>

      {/* ── How Size Affects Speed ── */}
      <SectionBlock id="size-speed" icon="🐢" title="How Size Affects Speed"
        desc="Swim speed decreases as your size number grows — this is by design, but it's gentle. Even at 1 billion size, your fish still moves at roughly 54% of its starting speed. Your fish's individual Speed stat multiplies on top of this penalty rather than replacing it: a naturally fast fish largely offsets the size penalty, while a naturally slow fish feels the penalty far more noticeably."
      >
        <TipBox>
          ⚠️ The visual model stops growing at 335,580 size (see <Link href="#growth">Growth</Link> above), but the
          speed penalty is tied to the underlying size <em>number</em>, not the model — so it keeps getting steeper
          long after your fish has visually maxed out.
        </TipBox>
      </SectionBlock>

      {/* ── Shop Upgrades (Passes) ── */}
      <SectionBlock id="passes" icon="🎫" title="Shop Upgrades (Game Passes)"
        desc="A mechanical summary of what each pass actually does numerically. For pricing and purchase recommendations, see How to Play → Passes."
      >
        <InfoGrid>
          {PASS_MECHANICS.map(p => (
            <InfoCard key={p.label} label={p.label} value={p.value} note={p.note} />
          ))}
        </InfoGrid>
      </SectionBlock>

      {/* ── Shop Boosts ── */}
      <SectionBlock id="boosts" icon="🫧" title="Shop Boosts (Consumable Buffs)"
        desc="Boosts are temporary Growth / Speed / Luck / XP buffs with fixed durations. For pricing, see How to Play → Boosts. The one mechanic worth understanding: buying multiples of the same boost stacks their duration, not their bonus amount."
      >
        <TipBox>
          🧪 Example: activating 4 Super XP potions back-to-back gives you <strong>+250% XP for 2 hours</strong> — it
          does <em>not</em> give you +1000% XP for 30 minutes. Plan boost usage around longer play sessions rather than
          stacking for a bigger spike.{' '}
          <a href="https://youtu.be/KOAienbGgu0" target="_blank" rel="noopener noreferrer">▶ Watch</a>
        </TipBox>
      </SectionBlock>

      {/* ── Fishdex Collection Bonus ── */}
      <SectionBlock id="fishdex-bonus" icon="🏅" title="Fishdex Collection Bonus"
        desc="The Fishdex holds all 300 entries (60 species × 5 tiers). Every 10 unique entries you collect grants a permanent milestone reward:"
      >
        <InfoGrid>
          {FISHDEX_REWARDS.map(r => (
            <InfoCard key={r.label} label={r.label} value={r.value} note={r.note} />
          ))}
        </InfoGrid>
        <TipBox>
          📖 This is free, permanent progression — expanding your collection directly compounds your Luck and Growth
          for every future run.
        </TipBox>
      </SectionBlock>

      {/* ── Luck ── */}
      <SectionBlock id="luck" icon="🍀" title="Luck"
        desc="Your total Luck stat is a sum of every source stacked together:"
      >
        <div className={styles.formula}>
          Total Luck = <strong>100% base</strong> + Treasure bonus + Fishdex bonus + Group bonus{' '}
          (<strong>+50%</strong>) + Lucky pass (<strong>+100%</strong>) + active boosts
        </div>
        <TipBox>
          ⚠️ Important distinction: Luck affects <strong>rarity</strong> only — your odds of Common vs. Uncommon vs.
          Rare vs. Epic vs. Legendary vs. Mythic. It has <strong>no effect</strong> on <strong>tier</strong>{' '}
          (Normal → Golden → Rainbow → Glowing → Shadow), which is purely a function of crafting — see{' '}
          <Link href="#merging">Merging &amp; Tiers</Link> below.
        </TipBox>
      </SectionBlock>

      {/* ── Luck & Drop Chances ── */}
      <SectionBlock id="luck-drops" icon="🎲" title="Luck & Drop Chances"
        desc="Luck itself caps at 1,000,000%. Here's how rarity odds shift as Luck climbs from base to cap:"
      >
        <DataTable
          headers={['Luck', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']}
          rows={LUCK_DROP_ROWS.map(r => [r.luck, r.common, r.uncommon, r.rare, r.epic, r.legendary, r.mythic])}
        />
        <p className={styles.tableNote}>
          Percentages are rounded to available precision — small rounding differences from an exact 100% total are
          expected, especially in the tiny tail values.
        </p>
        <InfoGrid>
          {LUCK_THRESHOLDS.map(t => (
            <InfoCard key={t.label} label={t.label} value={t.value} note={t.note} />
          ))}
        </InfoGrid>
        <TipBox>
          🧱 <strong>The grind wall:</strong> Rare caps at 2,500% Luck but Mythic doesn&apos;t even unlock until
          50,000% — a 47,500%-wide gap with almost nothing new happening in it. At roughly 1 Treasure chest per
          4 hours, closing that gap takes on the order of <strong>7 years</strong> of Luck accumulation. This is
          the single biggest reason players buy Gems to skip chest timers — see{' '}
          <Link href="/how-to-play#gems">How to Play → Gems</Link> for the chest math.
        </TipBox>
      </SectionBlock>

      {/* ── Luck Distribution ── */}
      <SectionBlock id="luck-distribution" icon="📊" title="Luck Distribution Probability"
        desc="At every Luck value, all six rarity chances always add up to exactly 100% — Luck never changes how often you get a fish, only which rarity that fish turns out to be. Every percentage point gained by Uncommon, Rare, Epic, Legendary, or Mythic as Luck rises comes directly out of the Common pool, which starts at 89% at base Luck and shrinks continuously."
      >
        <TipBox>
          💡 Higher Luck doesn&apos;t give you <em>more</em> fish overall — it gives you the <em>same</em> number of
          fish with fewer being Common and more being something rarer.
        </TipBox>
      </SectionBlock>

      {/* ── Treasures ── */}
      <SectionBlock id="treasures" icon="🎁" title="Treasures"
        desc="Treasures are the primary way to permanently raise your Luck. Each one gives 3 fish rolled with your current Luck stat plus a +100,000% Luck bonus applied just for that roll — so Treasures reliably pull much better fish than a normal net."
      >
        <InfoGrid>
          {TREASURE_STATS.map(t => (
            <InfoCard key={t.label} label={t.label} value={t.value} note={t.note} />
          ))}
        </InfoGrid>
        <TipBox>
          💎 The Gem cost to open a Treasure early decreases the longer you wait — roughly{' '}
          <strong>3,600 gems</strong> with 4 hours left, down to about <strong>3,585 gems</strong> with 3h59m left.
          Queuing several Treasures and letting the timer run down before spending Gems stretches your balance much
          further than instantly opening them.
        </TipBox>
      </SectionBlock>

      {/* ── Merging & Tiers ── */}
      <SectionBlock id="merging" icon="🔀" title="Merging & Tiers"
        desc="Every 50 copies of a fish at its current tier merge into 1 copy at the next tier: Normal → Golden → Rainbow → Glowing → Shadow. Tier is completely separate from rarity — it's pure crafting, unaffected by Luck."
      >
        <DataTable
          headers={['Target tier', 'Normal fish required (cumulative)']}
          rows={MERGING_ROWS.map(r => [r.tier, r.required])}
        />
        <p className={styles.tableNote}>
          These are cumulative totals including every tier along the way — reaching Rainbow needs 2,551 Normal-tier
          equivalents total, Glowing needs 125,000 more on top of that (127,551 total), and Shadow needs a further
          6,250,000 on top of that (6,377,551 total).
        </p>
      </SectionBlock>

      {/* ── AFK Auto-Farm ── */}
      <SectionBlock id="afk" icon="🤖" title="AFK Auto-Farm"
        desc="Auto Farm automatically steers your fish toward the nearest visible food. When no food is in range, it may path toward the lobby teleporter — and can occasionally get stuck against a wall."
      >
        <InfoGrid>
          {AFK_STATS.map(s => (
            <InfoCard key={s.label} label={s.label} value={s.value} note={s.note} />
          ))}
        </InfoGrid>
        <TipBox>
          🤖 Autos move in a bouncy zigzag and always prioritize nearby food — they never actively chase players.
          Moving toward one as if to eat it will cause it to divert, even if it is larger than you. When multiple
          manual players are in the tank, autos collide more frequently and can look like they&apos;re chasing — the
          actual manual player is the one whose path makes deliberate sense.
        </TipBox>
      </SectionBlock>

      {/* ── Leaderboards ── */}
      <SectionBlock id="leaderboards" icon="🏆" title="Leaderboards"
        desc="The in-tank leaderboard sorts by size and shows rank, username, equipped fish, and current size. Separately, the Rarest Fish, Most Kills, and Fish Collected boards are visible from the lobby and painted on the tank wall."
      >
        <TipBox>
          🏆 All leaderboards only display the <strong>top 17</strong> entries without scrolling — on mobile, pull
          up on the board to reveal more.
        </TipBox>
      </SectionBlock>

    </div>
  );
}
