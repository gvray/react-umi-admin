import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SettingsStore {
  language: 'zh-CN' | 'en-US';
  showBreadcrumb: boolean;
  showFooter: boolean;
  fixedHeader: boolean;
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
  setShowBreadcrumb: (show: boolean) => void;
  setShowFooter: (show: boolean) => void;
  setFixedHeader: (fixed: boolean) => void;
}

export const useSettingsStore = create(
  persist(
    immer<SettingsStore>((set) => ({
      language: 'zh-CN',
      showBreadcrumb: true,
      showFooter: true,
      fixedHeader: true,
      setLanguage: (language) =>
        set((state) => {
          state.language = language;
        }),
      setShowBreadcrumb: (show) =>
        set((state) => {
          state.showBreadcrumb = show;
        }),
      setShowFooter: (show) =>
        set((state) => {
          state.showFooter = show;
        }),
      setFixedHeader: (fixed) =>
        set((state) => {
          state.fixedHeader = fixed;
        }),
    })),
    {
      name: 'settings-storage',
    },
  ),
);
