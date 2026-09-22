import styles from './InfoGrid.module.css';

interface InfoGridProps {
  children: React.ReactNode;
}

/** Responsive grid wrapper that arranges InfoCards side by side, wrapping on narrow screens. */
export default function InfoGrid({ children }: InfoGridProps) {
  return <div className={styles.grid}>{children}</div>;
}
