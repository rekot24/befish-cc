# Checklist: Nav, Footer, globals.css, Root Layout

Builds the site shell — the pieces that appear on every page.
After this checklist, localhost:3000 should show a styled page with
a working nav and footer wrapping the default Next.js homepage content.

Reference: `CLAUDE.md` for conventions, color system, and structure.

---

## 1. Replace `src/app/globals.css`

Replace the entire file with the following. This establishes the full
color system, typography, resets, and global utility classes.

```css
/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

/* ── CSS Variables — Dark Mode (default) ── */
:root {
  /* Core palette */
  --color-cyan: #00b8d9;
  --color-purple: #7b2fbe;
  --color-orange: #f97316;

  /* Backgrounds */
  --page-bg: #070c1c;
  --nav-bg: #04080f;
  --card-bg: #0b1226;
  --card-bg-alt: #0d1530;
  --footer-bg: #04080f;

  /* Borders */
  --border: #1e2d4a;

  /* Text */
  --text-hi: #f0f4ff;
  --text-mid: #8899bb;
  --text-low: #4a5a7a;

  /* Semantic aliases */
  --accent: var(--color-cyan);
  --section-header: var(--color-purple);
  --cta: var(--color-orange);

  /* Nav */
  --nav-height: 56px;
}

/* ── CSS Variables — Light Mode ── */
[data-theme="light"] {
  --page-bg: #eaf6fb;
  --nav-bg: #0d1f3c;
  --card-bg: #ffffff;
  --card-bg-alt: #f0f8fd;
  --footer-bg: #0d1f3c;
  --border: #c8dff0;
  --text-hi: #0d1f3c;
  --text-mid: #4a6080;
  --text-low: #8aaabb;
}

/* ── Reset & Base ── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--page-bg);
  color: var(--text-hi);
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* ── Typography ── */
h1, h2, h3, h4 {
  font-family: 'Fredoka One', sans-serif;
  line-height: 1.2;
  color: var(--text-hi);
}

h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.4rem, 3vw, 2rem); }
h3 { font-size: 1.2rem; }

p { color: var(--text-mid); }

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* ── Layout Utilities ── */
.page-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  flex: 1;
}

main {
  flex: 1;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--page-bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-purple); }
```

---

## 2. Create `src/components/Nav/Nav.module.css`

Create the file with these contents:

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border);
  height: var(--nav-height);
}

.navInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Logo */
.logo {
  font-family: 'Fredoka One', sans-serif;
  font-size: 1.3rem;
  color: var(--text-hi);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.logo span {
  color: var(--color-cyan);
}

.logoFish {
  display: inline-block;
  animation: swim 4s ease-in-out infinite;
}

@keyframes swim {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-3px) rotate(5deg); }
}

/* Links */
.links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

.link {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-mid);
  text-decoration: none;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}

.link:hover {
  color: var(--text-hi);
  background: rgba(255,255,255,0.06);
  text-decoration: none;
}

.linkActive {
  color: var(--color-cyan);
}

.linkActive:hover {
  color: var(--color-cyan);
}

/* Theme toggle */
.themeToggle {
  margin-left: auto;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-mid);
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}

.themeToggle:hover {
  color: var(--text-hi);
  border-color: var(--color-cyan);
}

/* Hamburger toggle button */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
}

.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-mid);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}

/* Mobile */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .themeToggle {
    margin-left: 0;
  }

  .links {
    display: none;
    position: absolute;
    top: var(--nav-height);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    background: var(--nav-bg);
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 1rem;
    gap: 0.25rem;
  }

  .linksOpen {
    display: flex;
  }

  .link {
    padding: 0.6rem 0.75rem;
    font-size: 1rem;
  }
}
```

---

## 3. Create `src/components/Nav/Nav.tsx`

```tsx
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
```

---

## 4. Create `src/components/Footer/Footer.module.css`

```css
.footer {
  background: var(--footer-bg);
  border-top: 1px solid var(--border);
  padding: 1.5rem;
  margin-top: auto;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.credit {
  font-size: 0.875rem;
  color: var(--text-mid);
}

.credit strong {
  color: var(--color-cyan);
}

.links {
  display: flex;
  gap: 0.75rem;
}

.link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.85rem;
  border-radius: 20px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.link:hover {
  opacity: 0.85;
  text-decoration: none;
}

.youtube {
  background: #ff0000;
  color: #fff;
}

.discord {
  background: #5865f2;
  color: #fff;
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--text-low);
}
```

---

## 5. Create `src/components/Footer/Footer.tsx`

```tsx
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
```

---

## 6. Replace `src/app/layout.tsx`

Replace the entire file with:

```tsx
import type { Metadata } from 'next';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Be Fish Wiki — Roblox Fish Stats, Odds & Guide',
    template: '%s — Be Fish Wiki',
  },
  description:
    'The complete Be Fish Roblox wiki. Browse all 60 fish, growth and speed stats, tier progression, boosts, passes, and tips for beginners and veterans.',
  metadataBase: new URL('https://befish.cc'),
  openGraph: {
    siteName: 'Be Fish Wiki',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

---

## 7. Replace `src/app/page.tsx`

Replace with a minimal placeholder so the homepage compiles cleanly:

```tsx
export default function HomePage() {
  return (
    <div className="page-wrap">
      <h1>Be Fish <span style={{ color: 'var(--color-cyan)' }}>Wiki</span></h1>
      <p>Homepage coming soon.</p>
    </div>
  );
}
```

---

## 8. Delete `src/app/page.module.css`

This file is the scaffold default and is no longer needed.
Delete it: `src/app/page.module.css`

---

## 9. Verify locally

- Run `npm run dev` if not already running
- Open `http://localhost:3000`
- Confirm: nav appears with all 6 links, 🐟 fish logo animates, theme toggle works
- Confirm: footer appears with YouTube and Discord buttons
- Confirm: no TypeScript or ESLint errors in the terminal
- Resize to mobile width — hamburger menu should appear and open/close

---

## 10. Commit and push

```
git add .
git commit -m "add Nav, Footer, globals.css, root layout"
git push
```

---

## Implementation Notes

- Replaced `src/app/globals.css`, created `src/components/Nav/{Nav.tsx,Nav.module.css}`
  and `src/components/Footer/{Footer.tsx,Footer.module.css}`, replaced
  `src/app/layout.tsx` and `src/app/page.tsx`, deleted `src/app/page.module.css`
  — all exactly as specified.
- Deviation: `eslint-config-next`'s `react-hooks/set-state-in-effect` rule flagged
  the `setTheme(initial)` call inside Nav's mount effect (calling setState
  synchronously in an effect). Kept the logic as specified — it's the standard
  "read theme after mount to avoid an SSR/localStorage hydration mismatch"
  pattern — and added a one-line `eslint-disable-next-line` with a comment
  explaining why, rather than restructuring it (a lazy `useState` initializer
  would read `localStorage` during the client's first render and cause an
  actual hydration mismatch, which is worse).
- Verified: `tsc --noEmit` and `eslint src` both clean, `next build` succeeds,
  and the rendered homepage HTML contains all 6 nav links (Home marked active),
  the fish logo, theme toggle, and footer YouTube/Discord links + disclaimer.
  Hamburger/mobile menu was verified by code review of the `@media (max-width:
  768px)` rules in `Nav.module.css`, not a live resize (no browser available
  in this session).
- No bugs found otherwise.
```
