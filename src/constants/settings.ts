/**
 * 应用设置类型定义与默认常量
 *
 * 配置优先级（字段级覆盖）：
 *   用户偏好 (profile.preferences) > 运行时配置 (runtimeConfig) > 常量默认值 (DEFAULT_SETTINGS)
 */

export interface AppSettings {
  /** 站点名称 */
  siteName: string;
  /** 站点 Logo URL */
  siteLogo: string;
  /** 主题模式 */
  themeMode: 'light' | 'dark';
  /** 主题色 */
  primaryColor: string;
  /** 布局模式 */
  layoutMode: 'side' | 'top';
  /** 语言 */
  locale: string;
  /** 显示面包屑 */
  breadcrumb: boolean;
  /** 默认首页路径 */
  homePath: string;
  /** 表格密度 */
  tableDensity: 'default' | 'middle' | 'small';
  /** 默认分页数 */
  pageSize: number;
  /** 自动保存表单草稿 */
  autoSave: boolean;
  /** 启用快捷键 */
  shortcuts: boolean;
  /** 邮件通知 */
  emailNotif: boolean;
  /** 短信通知 */
  smsNotif: boolean;
  /** 推送通知 */
  pushNotif: boolean;
}

/** 系统常量默认配置（最低优先级） */
export const DEFAULT_SETTINGS: AppSettings = {
  siteName: 'React Umi Admin',
  siteLogo: '',
  themeMode: 'light',
  primaryColor: '#1677ff',
  layoutMode: 'side',
  locale: 'zh-CN',
  breadcrumb: true,
  homePath: '/dashboard',
  tableDensity: 'default',
  pageSize: 10,
  autoSave: true,
  shortcuts: true,
  emailNotif: true,
  smsNotif: false,
  pushNotif: true,
};

/**
 * 合并设置：常量 < runtimeConfig < preferences
 * 仅覆盖 DEFAULT_SETTINGS 中已定义的字段，且值非 undefined/null
 */
export function mergeSettings(
  runtimeConfig?: Record<string, unknown>,
  preferences?: Record<string, unknown>,
): AppSettings {
  const merged = { ...DEFAULT_SETTINGS };
  const keys = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[];

  // 第二层：运行时配置覆盖常量
  if (runtimeConfig) {
    for (const key of keys) {
      if (runtimeConfig[key] !== null) {
        (merged as any)[key] = runtimeConfig[key];
      }
    }
  }

  // 第三层：用户偏好覆盖运行时配置
  if (preferences) {
    for (const key of keys) {
      if (preferences[key] !== null) {
        (merged as any)[key] = preferences[key];
      }
    }
  }

  return merged;
}
