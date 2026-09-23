/**
 * Single debug/log interface for the app (web-app-framework.md Layer 3/7).
 * No raw `console.*` calls anywhere in tracker code — route everything
 * through this module instead, so log verbosity and destination can be
 * controlled from one place.
 *
 * Mode switch: outside production, everything is loud (console output,
 * including debug). In production, `debug` is a no-op and warning/error
 * stay quiet — no raw internal messages get surfaced to end users; only
 * the calling code's own user-facing UI (e.g. a toast) should do that.
 */

type LogMeta = Record<string, unknown> | undefined;

const isDev = process.env.NODE_ENV !== 'production';

/** True in any non-production build — same switch every log level checks. */
function loud(): boolean {
  return isDev;
}

/** Verbose, developer-only tracing. No-op in production. */
function debug(category: string, msg: string, meta?: LogMeta): void {
  if (!loud()) return;
  console.debug(`[${category}]`, msg, meta ?? '');
}

/** Routine informational events. Quiet (no console output) in production. */
function info(category: string, msg: string, meta?: LogMeta): void {
  if (!loud()) return;
  console.info(`[${category}]`, msg, meta ?? '');
}

/** Recoverable problems worth noting but not alarming a user over. */
function warning(category: string, msg: string, meta?: LogMeta): void {
  if (!loud()) return;
  console.warn(`[${category}]`, msg, meta ?? '');
}

/**
 * Failures. Always recorded outside production; in production this stays
 * quiet too (no raw error text shown to users) — callers are responsible
 * for their own user-facing fallback UI.
 *
 * TODO(Phase 7): also write to Supabase `app_logs` here, gated by the
 * `debug_enabled` settings-store flag, so production errors are visible
 * to the developer without exposing raw messages to users.
 */
function error(category: string, msg: string, meta?: LogMeta): void {
  if (!loud()) return;
  console.error(`[${category}]`, msg, meta ?? '');
}

export const logger = { debug, info, warning, error };
