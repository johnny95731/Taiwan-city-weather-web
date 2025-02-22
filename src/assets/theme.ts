import type { Theme } from '@emotion/react';

export const THEME: Record<'light' | 'dark', Theme> = {
  light: {
    name: 'light',
    bgColor1: '#fff',
    cardGrad: 'linear-gradient(90deg, #f9f9f9, #E0E0FF)',
    menuHoverColor: '#0001',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    titleColor: '#212121',
    textColor1: '#000',
    textColor2: '#333',
  },
  dark: {
    name: 'dark',
    bgColor1: '#22232A',
    cardGrad: 'linear-gradient(90deg, #121416, #1F1548)',
    menuHoverColor: '#fff2',
    boxShadow: 'rgba(255, 255, 255, 0.08) 0px 3px 16px -4px',
    titleColor: '#f9f9fa',
    textColor1: '#fff',
    textColor2: '#e0e0e0',
  },
} as const;
