export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeModeWithoutSystem = Exclude<ThemeMode, 'system'>;

export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  light: '亮色',
  dark: '暗黑',
  system: '跟随系统',
};
