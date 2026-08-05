import enUSMessages from '@/locales/en-US';
import zhCNMessages from '@/locales/zh-CN';
import { useSettingStore } from '@/stores';
import type { Locale } from 'antd/es/locale';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useMemo } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

export const DEFAULT_LOCALE = __APP_DEFAULT_LANGUAGE__;

const MESSAGES_MAP: Record<string, Record<string, string>> = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
};

/** antd locale 映射，供外层统一配置 ConfigProvider 使用 */
export const ANTD_LOCALE_MAP: Record<string, Locale> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

/** 获取当前语言，兜底默认语言 */
export function getLocale(): string {
  return useSettingStore.getState().language || DEFAULT_LOCALE;
}

/** 获取所有可用语言 */
export function getAllLocales(): string[] {
  return Object.keys(MESSAGES_MAP);
}

/** 切换语言（仅更新 store，由 IntlProvider 响应式生效） */
export function setLocale(lang: string): void {
  useSettingStore.getState().setLanguage(lang);
}

interface AppIntlProviderProps {
  children: React.ReactNode;
}

/**
 * 国际化 Provider —— 仅包裹 react-intl，不处理 antd locale。
 * antd 的 locale 由外层 AppProviders 统一在 ConfigProvider 上配置。
 */
const AppIntlProvider: React.FC<AppIntlProviderProps> = ({ children }) => {
  const language = useSettingStore((s) => s.language);

  const messages = useMemo(() => {
    return MESSAGES_MAP[language] || MESSAGES_MAP[DEFAULT_LOCALE];
  }, [language]);

  return (
    <ReactIntlProvider
      locale={language}
      messages={messages}
      defaultLocale={DEFAULT_LOCALE}
    >
      {children}
    </ReactIntlProvider>
  );
};

export default AppIntlProvider;
