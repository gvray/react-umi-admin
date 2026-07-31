export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeModeWithoutSystem = Exclude<ThemeMode, 'system'>;

export type ColorPrimary =
  | '#1677ff'
  | '#1890ff'
  | '#f5222d'
  | '#fa541c'
  | '#faad14'
  | '#a0d911'
  | '#52c41a'
  | '#13c2c2'
  | '#2f54eb'
  | '#722ed1'
  | '#eb2f96';

/** 主题色对应的国际化 key，顺序与 ColorPrimary 一致 */
export const PRIMARY_COLOR_INTL_KEYS: Record<ColorPrimary, string> = {
  '#1677ff': 'theme.color.dawnBlue',
  '#1890ff': 'theme.color.geekBlue',
  '#f5222d': 'theme.color.dustRed',
  '#fa541c': 'theme.color.volcano',
  '#faad14': 'theme.color.sunsetOrange',
  '#a0d911': 'theme.color.lime',
  '#52c41a': 'theme.color.polarGreen',
  '#13c2c2': 'theme.color.cyan',
  '#2f54eb': 'theme.color.geekBlue',
  '#722ed1': 'theme.color.goldenPurple',
  '#eb2f96': 'theme.color.magenta',
};
