import { PrimaryColor, ThemeMode } from '@/constants';
import { AliasToken } from 'antd/es/theme/internal';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ThemeStore {
  themeMode: ThemeMode;
  token: {
    colorPrimary: PrimaryColor;
  };
  setThemeMode: (theme: 'light' | 'dark') => void;
  setToken: (token: Partial<AliasToken>) => void;
}

export const useThemeStore = create(
  persist(
    immer<ThemeStore>((set) => ({
      themeMode: 'light',
      token: {
        colorPrimary: '#1677ff',
      },
      setThemeMode: (mode) =>
        set((state) => {
          state.themeMode = mode;
        }),
      setToken(token) {
        set((state) => {
          Object.assign(state.token, token);
        });
      },
    })),
    {
      name: 'theme-storage',
    },
  ),
);
