/**
 * Code-level feature flags (web-app-framework.md Layer 2), standing in
 * until the Phase 7 Supabase settings store exists. Every feature gated
 * by a flag must check it before rendering or running — never run
 * unconditionally.
 *
 * TODO(Phase 7): move these into the settings-store table so they can be
 * toggled per-operator without a redeploy; this module's shape should stay
 * the same so callers don't need to change.
 */

export const featureFlags = {
  /** Linked local file sync (File System Access API). Chromium desktop only —
   *  also gated at call sites on `'showSaveFilePicker' in window`. */
  trackerLinkedFile: true,

  /** Drag-to-reorder (sortablejs) in the tracker grid's Custom sort mode. */
  trackerDragReorder: true,
} as const;
