/** Tips & Tricks page component. Uses the same shared section components
 *  as How to Play — SectionBlock, InfoCard, InfoGrid, TipBox, PageHeading. */
import Link from 'next/link';
import SectionBlock from '../SectionBlock/SectionBlock';
import PageHeading from '../PageHeading/PageHeading';
import TipBox from '../TipBox/TipBox';
import InfoCard from '../InfoCard/InfoCard';
import InfoGrid from '../InfoGrid/InfoGrid';
import styles from './Tips.module.css';
import {
  GETTING_STARTED_TIPS,
  GENERAL_TIPS,
  AUTO_FARMER_TIPS,
  PASS_PRIORITY,
  LEADERBOARDS,
  LEADERBOARD_TIPS,
} from '../../lib/tipsData';

export default function Tips() {
  return (
    <div className="page-wrap">
      <PageHeading
        title="Tips & Tricks"
        subtitle="Strategies for collecting rare fish, growing fast, and climbing the leaderboard"
      />

      {/* ── Getting Started ── */}
      <SectionBlock id="getting-started" icon="🐣" title="Getting Started"
        desc="A few quick wins that new players often miss:"
      >
        <ul className={styles.tipsList}>
          {GETTING_STARTED_TIPS.map((tip, i) => (
            <li key={i} className={styles.tipItem}>
              {tip.text}
              {tip.link && (
                <> <a href={tip.link.href} target="_blank" rel="noopener noreferrer"
                  className={styles.tipLink}>{tip.link.label}</a></>
              )}
            </li>
          ))}
        </ul>
      </SectionBlock>

      {/* ── Luck Milestones ── */}
      <SectionBlock id="luck" icon="🍀" title="Luck Milestones"
        desc="Luck is the single most impactful stat in Be Fish — both Legendary and Mythic fish are locked behind Luck thresholds, and nothing else in the game moves the needle on rare drops as much."
      >
        <TipBox>
          💡 See the full breakpoint-by-breakpoint odds table at{' '}
          <Link href="/mechanics#luck-drops">Game Mechanics → Luck &amp; Drop Chances</Link>.
        </TipBox>
      </SectionBlock>

      {/* ── General Tips ── */}
      <SectionBlock id="general" icon="🎁" title="General Tips"
        desc="This is a farming game. The best way to advance is by leaving Auto Farm on 24/7. Combined with passes active, you'll collect fish much faster."
      >
        <ul className={styles.tipsList}>
          {GENERAL_TIPS.map((tip, i) => (
            <li key={i} className={styles.tipItem}>
              {tip.text}
              {tip.link && (
                <> <a href={tip.link.href} target="_blank" rel="noopener noreferrer"
                  className={styles.tipLink}>{tip.link.label}</a></>
              )}
            </li>
          ))}
        </ul>
        <TipBox>
          💡 Aggressive players are usually new players on lower-tier fish. Don&apos;t get caught up
          trying to outgrow them. Getting nets is what matters. If it really bothers you, switch tanks.
        </TipBox>
      </SectionBlock>

      {/* ── Spotting Auto Farmers ── */}
      <SectionBlock id="auto-farmers" icon="🤖" title="Spotting Auto Farmers"
        desc="Understanding how Auto Farm behaves can help you identify AFK players, avoid false reads on 'aggressive' fish, and navigate busy tanks more effectively."
      >
        <ul className={styles.tipsList}>
          {AUTO_FARMER_TIPS.map((tip, i) => (
            <li key={i} className={styles.tipItem}>{tip.text}</li>
          ))}
        </ul>
      </SectionBlock>

      {/* ── Pass Priority ── */}
      <SectionBlock id="pass-priority" icon="🎫" title="Pass Priority"
        desc="If you're going to invest Robux in passes, here's the recommended order based on long-term value:"
      >
        <ol className={styles.passList}>
          {PASS_PRIORITY.map(pass => (
            <li key={pass.rank} className={styles.passItem}>
              <span className={styles.passRank}>{pass.rank}</span>
              <div className={styles.passText}>
                <span className={styles.passName}>{pass.name}</span>
                <p className={styles.passDesc}>{pass.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionBlock>

      {/* ── Leaderboards ── */}
      <SectionBlock id="leaderboards" icon="🏆" title="Leaderboards"
        desc="There are 3 leaderboards in Be Fish:"
      >
        <InfoGrid>
          {LEADERBOARDS.map(lb => (
            <InfoCard key={lb.value} value={lb.value} note={lb.note} />
          ))}
        </InfoGrid>
        <ul className={styles.tipsList}>
          {LEADERBOARD_TIPS.map((tip, i) => (
            <li key={i} className={styles.tipItem}>{tip.text}</li>
          ))}
        </ul>
      </SectionBlock>

    </div>
  );
}
