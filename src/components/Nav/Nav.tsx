'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Nav.module.css';

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/fishdex',      label: 'Fish Dex' },
  { href: '/fish-tracker', label: 'Tracker' },
  { href: '/how-to-play',  label: 'How to Play' },
  { href: '/mechanics',    label: 'Mechanics' },
  { href: '/tips',         label: 'Tips & Tricks' },
];

const STORAGE_KEY = 'befish-theme';

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Apply theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    const initial = saved ?? preferred;
    // Read localStorage/matchMedia after mount so SSR and the first client
    // render match; setting state here (not in the initializer) avoids a
    // hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>

        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoFish}>🐟</span>
          Be Fish <span>Wiki</span>
        </Link>

        {/* Desktop + mobile open links */}
        <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`${styles.link} ${pathname === href ? styles.linkActive : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Toggle light/dark mode"
        >
          {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
        </button>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

      </div>
    </nav>
  );
}
