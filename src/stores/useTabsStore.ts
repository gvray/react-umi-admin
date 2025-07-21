import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TabItem {
  key: string;
  label: string;
  path: string;
  closable?: boolean;
}

interface TabsState {
  tabs: TabItem[];
  activeTab: string;
}

interface TabsActions {
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  clearTabs: () => void;
}

const initialTab: TabItem = {
  key: '/',
  label: '首页',
  path: '/',
  closable: false,
};
const initialState: TabsState = {
  tabs: [initialTab],
  activeTab: '/',
};

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    immer((set) => ({
      ...initialState,

      addTab: (tab) =>
        set((state) => {
          const exists = state.tabs.find((t) => t.key === tab.key);
          if (!exists) {
            state.tabs.push(tab);
          }
          state.activeTab = tab.key;
        }),

      removeTab: (key) =>
        set((state) => {
          state.tabs = state.tabs.filter((t) => t.key !== key);
          if (state.activeTab === key && state.tabs.length > 0) {
            state.activeTab = state.tabs[state.tabs.length - 1].key;
          }
        }),

      setActiveTab: (key) =>
        set((state) => {
          state.activeTab = key;
        }),

      clearTabs: () =>
        set((state) => {
          state.tabs = [initialTab];
          state.activeTab = initialTab.key;
        }),
    })),
    {
      name: 'tabs-storage',
      version: 1,
      partialize: (state) => ({
        tabs: state.tabs,
        activeTab: state.activeTab,
      }),
    },
  ),
);
