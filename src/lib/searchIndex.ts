export type SearchEntry = {
  title: string;       // section or topic title
  body: string;        // searchable text excerpt
  url: string;         // full path with anchor e.g. /mechanics#growth-formula
  page: string;        // display name e.g. "Mechanics"
  section: string;     // subsection label e.g. "Growth Formula"
};

/**
 * Site-wide search index.
 * Entries are added here as each content page is built (Phase 3).
 * Body text should be a plain-language summary of the section content —
 * enough for Fuse.js to match natural language queries.
 */
export const searchIndex: SearchEntry[] = [
  // Phase 3 — How to Play entries go here
  // Phase 3 — Game Mechanics entries go here
  // Phase 3 — Tips & Tricks entries go here
];
