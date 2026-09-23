'use client';

/** ErrorBoundary — wraps the Fish Tracker only (not the whole app). A
 *  render crash can never strand a user's data: the fallback reads
 *  `befish-tracker-v2` straight from localStorage and offers it as a
 *  download, independent of whatever crashed in the tree below. Error
 *  boundaries require a class component — there's no hook equivalent. */

import { Component, type ReactNode } from 'react';
import { logger } from '../../lib/logger';
import { STORAGE_KEY_V2 } from '../../lib/trackerConfig';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  exportedEmpty: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, exportedEmpty: false };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    logger.error('ErrorBoundary', 'Fish Tracker crashed', { error, componentStack: info.componentStack });
  }

  /** Reads localStorage directly rather than going through trackerStorage
   *  or any hook — this fallback has to work standalone, independent of
   *  whatever crashed in the tree it's replacing. */
  handleExport = (): void => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY_V2) : null;
    if (!raw) {
      this.setState({ exportedEmpty: true });
      return;
    }
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `befish-tracker-raw-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <p className={styles.message}>
            Something went wrong displaying the tracker. Your data is still safe in this browser
            — export it now as a precaution, then try reloading the page.
          </p>
          <button type="button" className="btn-primary" onClick={this.handleExport}>
            Export raw tracker data
          </button>
          {this.state.exportedEmpty && (
            <p className={styles.note}>No tracker data was found in this browser.</p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
