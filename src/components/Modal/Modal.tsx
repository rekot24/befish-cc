'use client';

/** Modal — renders the alert/confirm/prompt dialog driven by useModal's
 *  state. Enter confirms, Escape cancels, focus lands on the input (for
 *  a prompt) or the confirm button (otherwise) when it opens.
 *
 *  The caller must render this as `<Modal key={state?.id ?? 'closed'} .../>`
 *  — a fresh `id` per modal.open() forces a remount for each new modal,
 *  which is how the prompt input resets to a new `defaultValue` without
 *  needing an effect to do it (React's recommended fix for "reset local
 *  state when a prop changes"). */

import { useEffect, useRef, useState } from 'react';
import type { ModalState } from '../../hooks/useModal';
import styles from './Modal.module.css';

interface ModalProps {
  state: ModalState | null;
  onCancel: () => void;
  onConfirm: (value?: string) => void;
}

export default function Modal({ state, onCancel, onConfirm }: ModalProps) {
  // Lazy initializer, not an effect: since the caller keys this component
  // by state.id, a fresh instance mounts per modal, so this only ever
  // runs once per open — no separate reset-on-prop-change needed.
  const [inputValue, setInputValue] = useState(() => state?.defaultValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  /* Enter confirms, Escape cancels. */
  useEffect(() => {
    if (!state) return;
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
      else if (e.key === 'Enter') { e.preventDefault(); onConfirm(state?.mode === 'prompt' ? inputValue : undefined); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [state, inputValue, onCancel, onConfirm]);

  /* Focus on open — the input for a prompt, the confirm button otherwise. */
  useEffect(() => {
    if (!state) return;
    const id = requestAnimationFrame(() => {
      if (state.mode === 'prompt') { inputRef.current?.focus(); inputRef.current?.select(); }
      else confirmBtnRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [state]);

  if (!state) return null;

  return (
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className={styles.box} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.title} id="modal-title">{state.title}</div>
        <div className={styles.message}>{state.message}</div>

        {state.mode === 'prompt' && (
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        )}

        <div className={styles.actions}>
          {state.mode !== 'alert' && (
            <button className="btn-secondary btn--sm" onClick={onCancel}>Cancel</button>
          )}
          <button
            ref={confirmBtnRef}
            className={`btn-primary btn--sm${state.danger ? ' btn--danger' : ''}`}
            onClick={() => onConfirm(state.mode === 'prompt' ? inputValue : undefined)}
          >
            {state.confirmText ?? 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
