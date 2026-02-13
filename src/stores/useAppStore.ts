import { PrimaryColor, ThemeMode } from '@/constants';
import { DEFAULT_SERVER_CONFIG, type ServerConfig } from '@/constants/settings';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ─── 类型 ───────────────────────────────────────────────

export type SiderTheme = 'light' | 'dark';

interface SiderPrefs {
  collapsed: boolean;
  theme: SiderTheme;
  width: number;
  collapsedWidth: number;
  showLogo: boolean;
}

interface HeaderPrefs {
  fixed: boolean;
}

interface ContentPrefs {
  showFooter: boolean;
  footerText: string;
}

interface AccessibilityPrefs {
  colorWeak: boolean;
  grayMode: boolean;
}

// ─── State & Actions ────────────────────────────────────

interface AppState {
  /** 服务端配置（只读，每次启动从 API 拉取，不持久化） */
  serverConfig: ServerConfig;

  /** 客户端 UI 偏好（持久化到 localStorage） */
  themeMode: ThemeMode;
  colorPrimary: PrimaryColor;
  sider: SiderPrefs;
  header: HeaderPrefs;
  content: ContentPrefs;
  accessibility: AccessibilityPrefs;
}

interface AppActions {
  /** 启动时写入服务端配置 */
  setServerConfig: (config: ServerConfig) => void;

  setThemeMode: (mode: ThemeMode) => void;
  setColorPrimary: (color: PrimaryColor) => void;
  setSider: (patch: Partial<SiderPrefs>) => void;
  setHeader: (patch: Partial<HeaderPrefs>) => void;
  setContent: (patch: Partial<ContentPrefs>) => void;
  setAccessibility: (patch: Partial<AccessibilityPrefs>) => void;
  toggleCollapsed: () => void;
  resetPreferences: () => void;
}

// ─── 默认值 ─────────────────────────────────────────────

const defaultSider: SiderPrefs = {
  collapsed: false,
  theme: 'light',
  width: 220,
  collapsedWidth: 64,
  showLogo: true,
};

const defaultHeader: HeaderPrefs = {
  fixed: true,
};

const defaultContent: ContentPrefs = {
  showFooter: false,
  footerText: '© 2026 G-ADMIN · Crafted with ❤️',
};

const defaultAccessibility: AccessibilityPrefs = {
  colorWeak: false,
  grayMode: false,
};

// ─── Store ──────────────────────────────────────────────

export const useAppStore = create<AppState & AppActions>()(
  persist(
    immer((set) => ({
      // ── 服务端配置（不持久化，见 partialize） ──
      serverConfig: { ...DEFAULT_SERVER_CONFIG },

      // ── 客户端偏好 ──
      themeMode: 'light' as ThemeMode,
      colorPrimary: '#1677ff' as PrimaryColor,
      sider: { ...defaultSider },
      header: { ...defaultHeader },
      content: { ...defaultContent },
      accessibility: { ...defaultAccessibility },

      // ── Actions ──

      setServerConfig: (config) =>
        set((s) => {
          s.serverConfig = config;
        }),

      setThemeMode: (mode) =>
        set((s) => {
          s.themeMode = mode;
        }),

      setColorPrimary: (color) =>
        set((s) => {
          s.colorPrimary = color;
        }),

      setSider: (patch) =>
        set((s) => {
          Object.assign(s.sider, patch);
        }),

      setHeader: (patch) =>
        set((s) => {
          Object.assign(s.header, patch);
        }),

      setContent: (patch) =>
        set((s) => {
          Object.assign(s.content, patch);
        }),

      setAccessibility: (patch) =>
        set((s) => {
          Object.assign(s.accessibility, patch);
        }),

      toggleCollapsed: () =>
        set((s) => {
          s.sider.collapsed = !s.sider.collapsed;
        }),

      resetPreferences: () =>
        set((s) => {
          s.themeMode = 'light';
          s.colorPrimary = '#1677ff';
          s.sider = { ...defaultSider };
          s.header = { ...defaultHeader };
          s.content = { ...defaultContent };
          s.accessibility = { ...defaultAccessibility };
        }),
    })),
    {
      name: 'app-preferences',
      version: 1,
      partialize: (state) => ({
        themeMode: state.themeMode,
        colorPrimary: state.colorPrimary,
        sider: state.sider,
        header: state.header,
        content: state.content,
        accessibility: state.accessibility,
      }),
    },
  ),
);
