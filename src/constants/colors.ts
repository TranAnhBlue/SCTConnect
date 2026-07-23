export const Colors = {
  // Primary
  primary: '#1565C0',
  primaryDark: '#003c8f',
  primaryLight: '#5e92f3',

  // Accent
  accent: '#2E7D32',
  accentLight: '#60ad5e',

  // Status
  statusPending: '#9E9E9E',
  statusProcessing: '#F9A825',
  statusDone: '#2E7D32',
  statusRejected: '#C62828',

  // Semantic
  warning: '#F9A825',
  error: '#C62828',
  success: '#2E7D32',
  info: '#1565C0',

  // Neutrals
  background: '#F2F4F7',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#5A6275',
  textHint: '#9E9E9E',
  textOnPrimary: '#FFFFFF',

  // Tab / Navigation
  tabActive: '#1565C0',
  tabInactive: '#9E9E9E',

  // Tag colors
  tagNew: '#FF5722',

  // Overlay
  overlay: 'rgba(0,0,0,0.45)',
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
