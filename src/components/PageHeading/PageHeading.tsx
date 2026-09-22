import styles from './PageHeading.module.css';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
}

/** Centered page-top heading (title + optional subtitle) shared across content pages. */
export default function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
