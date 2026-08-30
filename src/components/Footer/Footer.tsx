import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.credit}>
          Made &amp; maintained by <strong>24rolla</strong>
        </div>
        <div className={styles.links}>
          <a
            className={`${styles.link} ${styles.youtube}`}
            href="https://www.youtube.com/channel/UCMQCHNgbMx_TY26QcFNcMag"
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶ YouTube
          </a>
          <a
            className={`${styles.link} ${styles.discord}`}
            href="https://discord.gg/CfsQmRjGbe"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Discord
          </a>
        </div>
        <div className={styles.disclaimer}>
          Fan-made wiki. Not affiliated with Roblox or the Be Fish developers.
        </div>
      </div>
    </footer>
  );
}
