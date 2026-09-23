/**
 * Ambient types for the parts of the File System Access API that
 * TypeScript's bundled DOM lib doesn't declare yet (permission methods,
 * the global picker function). `FileSystemFileHandle` itself and
 * `createWritable()` are already covered by lib.dom.d.ts — this file
 * only fills the gaps trackerFileSync.ts actually uses.
 *
 * Chromium desktop only (Chrome/Edge/Brave/Opera) — every call site
 * already gates on `'showSaveFilePicker' in window` before using any of
 * this, so these types just need to exist for `tsc`, not be universally
 * accurate across browsers.
 */

type FileSystemPermissionMode = 'read' | 'readwrite';
type FileSystemPermissionState = 'granted' | 'denied' | 'prompt';

interface FileSystemHandlePermissionDescriptor {
  mode?: FileSystemPermissionMode;
}

interface FileSystemFileHandle {
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<FileSystemPermissionState>;
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<FileSystemPermissionState>;
}

interface SaveFilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: SaveFilePickerAcceptType[];
}

interface Window {
  showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
}
