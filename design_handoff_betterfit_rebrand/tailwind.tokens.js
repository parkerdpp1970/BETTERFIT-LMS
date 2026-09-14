// Drop into tailwind.config.js -> theme.extend. Mirrors tokens/*.css (M3 role names, kebab-case -> bracket access e.g. bg-primary, text-on-primary, bg-surface-container-low).
export const colors = {
  primary: { DEFAULT: '#D70029', deep: '#A8001C', bright: '#FF2D55', container: '#FFD9E2', fixed: '#FFD9E2', 'fixed-dim': '#FF9EB5' },
  'on-primary': { DEFAULT: '#FFFFFF', container: '#40000F' },
  secondary: { DEFAULT: '#1C1C1E', container: '#E7E4E2' },
  'on-secondary': { DEFAULT: '#FFFFFF', container: '#1C1C1E' },
  tertiary: { DEFAULT: '#1C1C1E', container: '#E7E4E2' },
  'on-tertiary': { DEFAULT: '#FFFFFF', container: '#1C1C1E' },
  success: { DEFAULT: '#166534', container: '#E3EEE6' },
  'on-success': { DEFAULT: '#FFFFFF', container: '#14532D' },
  error: { DEFAULT: '#B91C1C', container: '#FEE2E2' },
  'on-error': { DEFAULT: '#FFFFFF', container: '#7F1D1D' },
  warning: { DEFAULT: '#A85A00', container: '#F5EBDD' },
  'on-warning': { DEFAULT: '#FFFFFF', container: '#78350F' },
  info: { DEFAULT: '#1D4ED8', container: '#DBEAFE' },
  'on-info': { DEFAULT: '#FFFFFF', container: '#1E3A8A' },
  surface: {
    DEFAULT: '#F5F3F2', dim: '#D6D2D0', bright: '#FFFFFF',
    'container-lowest': '#FFFFFF', 'container-low': '#EEEBEA', container: '#E7E4E2',
    'container-high': '#E0DCDA', 'container-highest': '#D6D2D0',
  },
  'on-surface': { DEFAULT: '#1C1C1E', variant: '#4A4646', muted: '#706B6A' },
  outline: { DEFAULT: '#918B89', variant: '#D6D2D0' },
  'inverse-surface': '#1C1C1E',
  'inverse-on-surface': '#EEEBEA',
  'inverse-primary': '#FF9EB5',
  link: { DEFAULT: '#C4002B', hover: '#A8001C' },
  focus: '#007AFF',
};

export const backgroundImage = {
  'primary-gradient': 'linear-gradient(135deg, #E0007A 0%, #D70029 55%, #A8001C 100%)',
  'primary-gradient-hover': 'linear-gradient(135deg, #C8006E 0%, #BE0024 55%, #8F0018 100%)',
  'primary-gradient-pressed': 'linear-gradient(135deg, #A8001C 0%, #7A0014 100%)',
};

export const fontFamily = {
  sans: ['Nunito', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
};

// text-display-lg, text-headline-md, text-body-md, text-label-lg ...
export const fontSize = {
  'display-lg': ['57px', { lineHeight: '64px', fontWeight: '800', letterSpacing: '-0.02em' }],
  'display-md': ['45px', { lineHeight: '52px', fontWeight: '800', letterSpacing: '-0.02em' }],
  'display-sm': ['36px', { lineHeight: '44px', fontWeight: '800', letterSpacing: '-0.02em' }],
  'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.01em' }],
  'headline-md': ['28px', { lineHeight: '36px', fontWeight: '700', letterSpacing: '-0.01em' }],
  'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.01em' }],
  'title-lg': ['22px', { lineHeight: '28px', fontWeight: '700' }],
  'title-md': ['16px', { lineHeight: '24px', fontWeight: '700' }],
  'title-sm': ['14px', { lineHeight: '20px', fontWeight: '700' }],
  'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
  'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
  'label-lg': ['14px', { lineHeight: '20px', fontWeight: '700', letterSpacing: '0.01em' }],
  'label-md': ['12px', { lineHeight: '16px', fontWeight: '700', letterSpacing: '0.01em' }],
  'label-sm': ['11px', { lineHeight: '16px', fontWeight: '700', letterSpacing: '0.01em' }],
};

export const borderRadius = { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '28px', full: '9999px' };

export const boxShadow = {
  'elevation-1': '0 1px 2px rgba(28,28,30,0.10), 0 1px 3px 1px rgba(28,28,30,0.06)',
  'elevation-2': '0 1px 2px rgba(28,28,30,0.10), 0 2px 6px 2px rgba(28,28,30,0.08)',
  'elevation-3': '0 1px 3px rgba(28,28,30,0.12), 0 4px 8px 3px rgba(28,28,30,0.10)',
  'elevation-4': '0 2px 3px rgba(28,28,30,0.12), 0 6px 10px 4px rgba(28,28,30,0.12)',
  'elevation-5': '0 4px 4px rgba(28,28,30,0.14), 0 8px 12px 6px rgba(28,28,30,0.14)',
  'elevation-primary': '0 6px 16px -4px rgba(215,0,41,0.45)',
};

export const transitionTimingFunction = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
};

export const spacing = { 0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px', 20: '80px' };

// Usage:
// import * as bf from './tokens/tailwind.tokens.js';
// export default { theme: { extend: { ...bf } } }
