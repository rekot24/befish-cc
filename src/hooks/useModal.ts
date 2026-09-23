'use client';

/**
 * useModal — a promise-based port of the live site's showAlert /
 * showConfirm / showPrompt. Never use native prompt()/confirm()/alert()
 * — they no-op inside embedded previews (VS Code, etc.) and don't match
 * the site's design. Pair with the Modal component, which reads
 * `modalState` and calls `cancel`/`confirm` back.
 */

import { useCallback, useRef, useState } from 'react';

export type ModalMode = 'alert' | 'confirm' | 'prompt';

export type ModalState = {
  /** Unique per open — lets <Modal key={modalState.id}> remount fresh for
   *  each new modal instead of needing an effect to reset local state
   *  (e.g. the prompt input) when a second modal opens back-to-back. */
  id: number;
  title: string;
  message: string;
  mode: ModalMode;
  defaultValue?: string;
  confirmText?: string;
  danger?: boolean;
};

type Resolver = (value: unknown) => void;
type ModalConfig = Omit<ModalState, 'id'>;

let modalIdCounter = 0;

export function useModal() {
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const resolveRef = useRef<Resolver | null>(null);

  const openModal = useCallback((config: ModalConfig): Promise<unknown> => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setModalState({ ...config, id: modalIdCounter++ });
    });
  }, []);

  const close = useCallback((result: unknown): void => {
    setModalState(null);
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.(result);
  }, []);

  /** Cancel/Escape/overlay-click — resolves `null` for a prompt, `false` otherwise. */
  const cancel = useCallback((): void => {
    close(modalState?.mode === 'prompt' ? null : false);
  }, [close, modalState]);

  /** Confirm/Enter — resolves the given value for a prompt (the current
   *  input text), `true` otherwise. */
  const confirm = useCallback((value?: string): void => {
    close(modalState?.mode === 'prompt' ? (value ?? '') : true);
  }, [close, modalState]);

  const showAlert = useCallback((message: string, title = 'Notice'): Promise<void> => {
    return openModal({ title, message, mode: 'alert', confirmText: 'OK' }) as Promise<void>;
  }, [openModal]);

  const showConfirm = useCallback((
    message: string,
    opts?: { title?: string; confirmText?: string; danger?: boolean },
  ): Promise<boolean> => {
    return openModal({
      title: opts?.title ?? 'Are you sure?',
      message,
      mode: 'confirm',
      confirmText: opts?.confirmText ?? 'Confirm',
      danger: opts?.danger ?? false,
    }) as Promise<boolean>;
  }, [openModal]);

  const showPrompt = useCallback((
    message: string,
    opts?: { title?: string; defaultValue?: string; confirmText?: string },
  ): Promise<string | null> => {
    return openModal({
      title: opts?.title ?? 'Input needed',
      message,
      mode: 'prompt',
      defaultValue: opts?.defaultValue ?? '',
      confirmText: opts?.confirmText ?? 'OK',
    }) as Promise<string | null>;
  }, [openModal]);

  return { modalState, cancel, confirm, showAlert, showConfirm, showPrompt };
}
