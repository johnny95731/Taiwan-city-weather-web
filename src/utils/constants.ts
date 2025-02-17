import type { Theme } from '@emotion/react';

export const REFRESH_CD = 3e3; // 3 sec


export const THEME: Record<'light' | 'dark', Theme> = {
  light: {
    backgroundColor: '#ededed',
    headerColor: '#fff',
    foregroundColor: '#f9f9f9',
    menuHoverColor: '#eaeaea',
    optionMenuColor: '#fff',
    optionMenuHoverColor: '#eee',
    optionMenuShadow: '0px 0px 15px #0003',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#333',
    textColor: '#060606',
  },
  dark: {
    backgroundColor: '#1F2022',
    headerColor: '#333',
    foregroundColor: '#121416',
    menuHoverColor: '#353535',
    optionMenuColor: '#5e5e5e',
    optionMenuHoverColor: '#666',
    optionMenuShadow: '0px 0px 15px #707070',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#fff',
    textColor: '#eee',
  },
} as const;
