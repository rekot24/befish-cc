'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { searchIndex, SearchEntry } from '../../lib/searchIndex';
import { SEARCH_MAX_RESULTS } from '../../lib/searchConfig';
import styles from './Search.module.css';

const fuse = new Fuse(searchIndex, {
  keys: ['title', 'body', 'section'],
  threshold: 0.35,
  includeMatches: true,
});

/**
 * Groups results by page name for display.
 */
function groupByPage(results: SearchEntry[]): Record<string, SearchEntry[]> {
  return results.reduce((acc, entry) => {
    if (!acc[entry.page]) acc[entry.page] = [];
    acc[entry.page].push(entry);
    return acc;
  }, {} as Record<string, SearchEntry[]>);
}

/**
 * Highlights the matched portion of a string.
 * Returns an array of {text, highlight} segments.
 */
function highlight(text: string, query: string): { text: string; hl: boolean }[] {
  if (!query) return [{ text, hl: false }];
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return [{ text, hl: false }];
  return [
    { text: text.slice(0, idx), hl: false },
    { text: text.slice(idx, idx + query.length), hl: true },
    { text: text.slice(idx + query.length), hl: false },
  ];
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Open on / keypress (skip if user is typing in another input) */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* Focus input when opened */
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Run search */
  const handleQuery = useCallback((value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const hits = fuse.search(value).slice(0, SEARCH_MAX_RESULTS).map(r => r.item);
    setResults(hits);
  }, []);

  const grouped = groupByPage(results);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {/* Collapsed pill */}
      {!open && (
        <button
          className={styles.pill}
          onClick={() => setOpen(true)}
          aria-label="Open search"
        >
          <SearchIcon />
          <span className={styles.pillText}>Search wiki...</span>
          <kbd className={styles.shortcut}>/</kbd>
        </button>
      )}

      {/* Expanded input */}
      {open && (
        <div className={styles.expanded}>
          <SearchIcon active />
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={e => handleQuery(e.target.value)}
            placeholder="Search wiki..."
            aria-label="Search"
            autoComplete="off"
          />
          <kbd className={styles.escHint}>esc</kbd>
        </div>
      )}

      {/* Results overlay */}
      {open && (
        <div className={styles.overlay} role="listbox" aria-label="Search results">
          {query && results.length === 0 && (
            <p className={styles.noResults}>No results for &ldquo;{query}&rdquo;</p>
          )}
          {query && results.length > 0 && (
            <div className={styles.groups}>
              {Object.entries(grouped).map(([page, entries]) => (
                <div key={page} className={styles.group}>
                  <p className={styles.groupLabel}>{page}</p>
                  {entries.map(entry => (
                    <Link
                      key={entry.url}
                      href={entry.url}
                      className={styles.result}
                      onClick={() => { setOpen(false); setQuery(''); }}
                      role="option"
                    >
                      <div className={styles.resultIcon}>
                        <PageIcon />
                      </div>
                      <div className={styles.resultText}>
                        <span className={styles.resultTitle}>
                          {highlight(entry.title, query).map((seg, i) =>
                            seg.hl
                              ? <em key={i} className={styles.match}>{seg.text}</em>
                              : <span key={i}>{seg.text}</span>
                          )}
                        </span>
                        <span className={styles.resultMeta}>
                          {entry.page} <span className={styles.dot}>·</span> {entry.section}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
          {!query && (
            <p className={styles.hint}>Type to search mechanics, tips, and guides</p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ active = false }: { active?: boolean }) {
  return (
    <svg
      className={active ? styles.iconActive : styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg
      className={styles.pageIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
