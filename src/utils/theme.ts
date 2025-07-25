// --- 系统主题监听器封装 ---

import { ThemeModeWithoutSystem } from '@/constants';

let mediaQuery: MediaQueryList | null = null;
let listener: ((e: MediaQueryListEvent) => void) | null = null;

export const startSystemThemeWatcher = (
  setSystemTheme: (v: ThemeModeWithoutSystem) => void,
) => {
  if (mediaQuery) return; // 防止重复监听

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  listener = (e) => {
    const mode: ThemeModeWithoutSystem = e.matches ? 'dark' : 'light';
    setSystemTheme(mode);
  };
  mediaQuery.addEventListener('change', listener);
};

export const stopSystemThemeWatcher = () => {
  if (mediaQuery && listener) {
    mediaQuery.removeEventListener('change', listener);
    mediaQuery = null;
    listener = null;
  }
};
