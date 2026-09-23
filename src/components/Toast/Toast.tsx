/** Toast — renders the notification stack driven by useToast. Pure
 *  render, no state of its own. */

import type { ToastItem } from '../../hooks/useToast';
import styles from './Toast.module.css';

interface ToastProps {
  toasts: ToastItem[];
}

export default function Toast({ toasts }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.stack}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast}${t.show ? ` ${styles.show}` : ''}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
