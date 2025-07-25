import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type Language = 'zh-CN' | 'en-US';

export interface LayoutSettings {
  showBreadcrumb: boolean;
  showFooter: boolean;
  fixedHeader: boolean;
  sidebarCollapsed: boolean;
}

export interface SettingsStore {
  language: Language;
  layout: LayoutSettings;
  setLanguage: (language: Language) => void;
  setLayout: (layout: Partial<LayoutSettings>) => void;
}

export const useSettingsStore = create(
  persist(
    immer<SettingsStore>((set) => ({
      language: 'zh-CN',
      layout: {
        showBreadcrumb: true,
        showFooter: true,
        fixedHeader: false,
        sidebarCollapsed: true,
      },
      setLanguage: (language) =>
        set((state) => {
          state.language = language;
        }),
      setLayout: (layout) =>
        set((state) => {
          Object.assign(state.layout, layout);
        }),
    })),
    {
      name: 'settings-storage',
    },
  ),
);
