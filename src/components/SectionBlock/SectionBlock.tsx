import styles from './SectionBlock.module.css';

interface SectionBlockProps {
  /** Section anchor ID — used by search results and sticky nav links */
  id: string;
  /** Emoji icon shown in the header bar */
  icon: string;
  /** Section heading text */
  title: string;
  /** 'cyan' = primary header style, 'purple' = alternate header style.
   *  Alternate between them across sections on the same page. */
  variant?: 'cyan' | 'purple';
  /** Optional short description shown below the header */
  desc?: string;
  /** Section body content — info grids, tables, tip boxes, etc. */
  children?: React.ReactNode;
}

/** A single collapsible content section: icon + title header bar over a body. Used to
 *  build every content page (How to Play, Mechanics, Tips) out of consistent blocks. */
export default function SectionBlock({
  id,
  icon,
  title,
  variant = 'cyan',
  desc,
  children,
}: SectionBlockProps) {
  return (
    <section
      id={id}
      className={styles.block}
      aria-labelledby={`${id}-heading`}
    >
      <div className={`${styles.header} ${variant === 'purple' ? styles.headerPurple : ''}`}>
        <span className={styles.icon} aria-hidden="true">{icon}</span>
        <h2 id={`${id}-heading`} className={styles.title}>{title}</h2>
      </div>
      <div className={styles.body}>
        {desc && <p className={styles.desc}>{desc}</p>}
        {children}
      </div>
    </section>
  );
}
