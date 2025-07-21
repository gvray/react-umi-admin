import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ThemeStore {
  theme: 'light' | 'dark';
  primaryColor: string;
  sidebarCollapsed: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create(
  persist(
    immer<ThemeStore>((set) => ({
      theme: 'light',
      primaryColor: '#1890ff',
      sidebarCollapsed: false,
      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),
      setPrimaryColor: (color) =>
        set((state) => {
          state.primaryColor = color;
        }),
      setSidebarCollapsed: (collapsed) =>
        set((state) => {
          state.sidebarCollapsed = collapsed;
        }),
    })),
    {
      name: 'theme-storage',
    },
  ),
);
