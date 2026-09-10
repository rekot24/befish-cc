import Link from 'next/link';
import styles from './NavCard.module.css';

/**
 * NavCard — a homepage navigation card linking to a major site section.
 *
 * @param {string} emoji   - Icon displayed at the top of the card
 * @param {string} title   - Card heading
 * @param {string} desc    - One-line description of the section
 * @param {string} href    - Internal route the card links to
 * @param {string} cta     - Link label text (e.g. "Open Fish Dex →")
 */
interface NavCardProps {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

export default function NavCard({ emoji, title, desc, href, cta }: NavCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
      <span className={styles.cta}>{cta}</span>
    </Link>
  );
}