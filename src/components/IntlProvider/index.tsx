import enUSMessages from '@/locales/en-US';
import zhCNMessages from '@/locales/zh-CN';
import { useSettingStore } from '@/stores';
import { ConfigProvider } from 'antd';
import type { Locale } from 'antd/es/locale';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useMemo } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

const DEFAULT_LOCALE = __APP_DEFAULT_LANGUAGE__;

const MESSAGES_MAP: Record<string, Record<string, string>> = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
};

const ANTD_LOCALE_MAP: Record<string, Locale> = {
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

const AppIntlProvider: React.FC<AppIntlProviderProps> = ({ children }) => {
  const language = useSettingStore((s) => s.language);

  const { messages, antdLocale } = useMemo(() => {
    const msgs = MESSAGES_MAP[language] || MESSAGES_MAP[DEFAULT_LOCALE];
    const antd = ANTD_LOCALE_MAP[language] || ANTD_LOCALE_MAP[DEFAULT_LOCALE];
    return { messages: msgs, antdLocale: antd };
  }, [language]);

  return (
    <ReactIntlProvider
      locale={language}
      messages={messages}
      defaultLocale={DEFAULT_LOCALE}
    >
      <ConfigProvider locale={antdLocale}>{children}</ConfigProvider>
    </ReactIntlProvider>
  );
};

export default AppIntlProvider;
