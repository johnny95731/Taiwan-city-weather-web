import type { Theme } from '@emotion/react';

export const THEME: Record<'light' | 'dark', Theme> = {
  light: {
    name: 'light',
    cardGrad: 'linear-gradient(90deg, #f9f9f9, #E0E0FF)',
    bgColor: '#fff',
    hoverBgColor: '#0001',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    outline: '0004',
    textColor1: '#000',
    textColor2: '#333',
  },
  dark: {
    name: 'dark',
    cardGrad: 'linear-gradient(90deg, #121416, #1F1548)',
    bgColor: '#22232A',
    hoverBgColor: '#fff2',
    boxShadow: 'rgba(255, 255, 255, 0.08) 0px 3px 16px -4px',
    outline: '#fff4',
    textColor1: '#fff',
    textColor2: '#e0e0e0',
  },
} as const;
