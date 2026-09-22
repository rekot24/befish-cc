import styles from './TipBox.module.css';

interface TipBoxProps {
  children: React.ReactNode;
}

/** A small cyan-tinted callout box for tips/notes inline within section body copy. */
export default function TipBox({ children }: TipBoxProps) {
  return <div className={styles.box}>{children}</div>;
}
