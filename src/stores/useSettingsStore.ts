import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ─── 类型定义 ────────────────────────────────────────────

export type Language = 'zh-CN' | 'en-US';
export type LayoutMode = 'side' | 'top' | 'mix';
export type ContentWidth = 'fluid' | 'fixed';
export type SiderTheme = 'light' | 'dark';
export type TabsMode = 'card' | 'line';

/** 侧边栏 & 导航 */
export interface SiderSettings {
  collapsed: boolean;
  theme: SiderTheme;
  width: number;
  collapsedWidth: number;
  showLogo: boolean;
}

/** 顶栏 */
export interface HeaderSettings {
  fixed: boolean;
  showBreadcrumb: boolean;
  showSearch: boolean;
}

/** 内容区 */
export interface ContentSettings {
  contentWidth: ContentWidth;
  showFooter: boolean;
  footerText: string;
  enableWatermark: boolean;
  watermarkText: string;
}

/** 多标签页 */
export interface TabBarSettings {
  enabled: boolean;
  mode: TabsMode;
  showIcon: boolean;
  maxCount: number;
  dragSort: boolean;
}

/** 导航 & 交互 */
export interface NavigationSettings {
  layoutMode: LayoutMode;
  showProgressBar: boolean;
  enablePageTransition: boolean;
  enableKeepAlive: boolean;
  accordionMenu: boolean;
}

/** 无障碍 & 辅助 */
export interface AccessibilitySettings {
  colorWeak: boolean;
  grayMode: boolean;
  fontSize: number;
  compactMode: boolean;
}

export interface SettingsStore {
  language: Language;
  sider: SiderSettings;
  header: HeaderSettings;
  content: ContentSettings;
  tabBar: TabBarSettings;
  navigation: NavigationSettings;
  accessibility: AccessibilitySettings;

  setLanguage: (language: Language) => void;
  setSider: (sider: Partial<SiderSettings>) => void;
  setHeader: (header: Partial<HeaderSettings>) => void;
  setContent: (content: Partial<ContentSettings>) => void;
  setTabBar: (tabBar: Partial<TabBarSettings>) => void;
  setNavigation: (navigation: Partial<NavigationSettings>) => void;
  setAccessibility: (accessibility: Partial<AccessibilitySettings>) => void;
  toggleCollapsed: () => void;
  resetSettings: () => void;
}

// ─── 默认值 ─────────────────────────────────────────────

const defaultSider: SiderSettings = {
  collapsed: false,
  theme: 'dark',
  width: 220,
  collapsedWidth: 64,
  showLogo: true,
};

const defaultHeader: HeaderSettings = {
  fixed: true,
  showBreadcrumb: true,
  showSearch: false,
};

const defaultContent: ContentSettings = {
  contentWidth: 'fluid',
  showFooter: false,
  footerText: '© 2026 G-ADMIN · Crafted with ❤️',
  enableWatermark: false,
  watermarkText: '',
};

const defaultTabBar: TabBarSettings = {
  enabled: true,
  mode: 'card',
  showIcon: true,
  maxCount: 20,
  dragSort: false,
};

const defaultNavigation: NavigationSettings = {
  layoutMode: 'side',
  showProgressBar: true,
  enablePageTransition: true,
  enableKeepAlive: false,
  accordionMenu: true,
};

const defaultAccessibility: AccessibilitySettings = {
  colorWeak: false,
  grayMode: false,
  fontSize: 14,
  compactMode: false,
};

// ─── Store ──────────────────────────────────────────────

export const useSettingsStore = create(
  persist(
    immer<SettingsStore>((set) => ({
      language: 'zh-CN',
      sider: { ...defaultSider },
      header: { ...defaultHeader },
      content: { ...defaultContent },
      tabBar: { ...defaultTabBar },
      navigation: { ...defaultNavigation },
      accessibility: { ...defaultAccessibility },

      setLanguage: (language) =>
        set((state) => {
          state.language = language;
        }),
      setSider: (sider) =>
        set((state) => {
          Object.assign(state.sider, sider);
        }),
      setHeader: (header) =>
        set((state) => {
          Object.assign(state.header, header);
        }),
      setContent: (content) =>
        set((state) => {
          Object.assign(state.content, content);
        }),
      setTabBar: (tabBar) =>
        set((state) => {
          Object.assign(state.tabBar, tabBar);
        }),
      setNavigation: (navigation) =>
        set((state) => {
          Object.assign(state.navigation, navigation);
        }),
      setAccessibility: (accessibility) =>
        set((state) => {
          Object.assign(state.accessibility, accessibility);
        }),
      toggleCollapsed: () =>
        set((state) => {
          state.sider.collapsed = !state.sider.collapsed;
        }),
      resetSettings: () =>
        set((state) => {
          state.language = 'zh-CN';
          state.sider = { ...defaultSider };
          state.header = { ...defaultHeader };
          state.content = { ...defaultContent };
          state.tabBar = { ...defaultTabBar };
          state.navigation = { ...defaultNavigation };
          state.accessibility = { ...defaultAccessibility };
        }),
    })),
    {
      name: 'settings-storage',
      version: 2,
    },
  ),
);
