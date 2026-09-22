/** Reusable stat/info card — label, icon, value, and note are all optional
 *  except value. Used for fish stats, boosts, passes, gems, and any other
 *  callout card across the site. */
import styles from './InfoCard.module.css';

interface InfoCardProps {
  /** Small label above the value — e.g. "SIZE GAIN", "10 MIN" */
  label?: string;
  /** Emoji icon shown between label and value */
  icon?: string;
  /** Primary value — fish stat name, boost name, gem amount, etc. */
  value: string;
  /** Supporting description below the value */
  note?: string;
}

export default function InfoCard({ label, icon, value, note }: InfoCardProps) {
  return (
    <div className={styles.card}>
      {label && <span className={styles.label}>{label}</span>}
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.value}>{value}</span>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
