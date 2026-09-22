import styles from './InfoCard.module.css';

interface InfoCardProps {
  label: string;
  value: string;
  note?: string;
}

/** A single stat callout tile (label + value, optional note) — used for Growth/Speed/XP,
 *  gem amounts, and similar single-number displays. */
export default function InfoCard({ label, value, note }: InfoCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}
