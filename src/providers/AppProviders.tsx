import { useAppTheme } from '@/hooks';
import ThemeTokenInjector from '@/layouts/components/ThemeTokenInjector';
import { useSettingStore } from '@/stores';
import { runtimeConfig } from '@/utils/runtime-config';
import { App, ConfigProvider } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AppIntlProvider, {
  ANTD_LOCALE_MAP,
  DEFAULT_LOCALE,
} from './IntlProvider';
import StyledThemeProvider from './StyledThemeProvider';

/**
 * 全局根级 Provider 组合。
 *
 * 设计原则：
 * 1. 只放「所有页面共享」的 Provider（包括 layout: false 的登录/注册/404 等）。
 * 2. 不放「仅后台布局需要」的 Provider（如 RouteMetaProvider、SideNav UI 壳子），那些留在 Layout。
 * 3. 包裹位置：rootContainer 注入，umi 路由渲染前即生效。
 * 4. 只有一个 ConfigProvider，theme + locale + App 统一配置，避免嵌套。
 *
 * @see https://umijs.org/docs/api/runtime-config#rootcontainer
 */
const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { system } = runtimeConfig.get();
  const colorPrimary = useSettingStore((s) => s.colorPrimary);
  const colorWeak = useSettingStore((s) => s.colorWeak);
  const language = useSettingStore((s) => s.language);
  const { themeAlgorithm } = useAppTheme();
  const grayMode = runtimeConfig.get().ui.grayMode;

  const antdLocale = useMemo(() => {
    return ANTD_LOCALE_MAP[language] || ANTD_LOCALE_MAP[DEFAULT_LOCALE];
  }, [language]);

  // 全局样式类（色弱 / 灰度）挂到 body，比 Layout 级作用更早
  useEffect(() => {
    document.body.classList.toggle('color-weak', !!colorWeak);
    document.body.classList.toggle('gray-mode', !!grayMode);
  }, [colorWeak, grayMode]);

  return (
    <HelmetProvider>
      <AppIntlProvider>
        <Helmet>
          <title>{system.name}</title>
        </Helmet>
        <ConfigProvider
          locale={antdLocale}
          theme={{
            algorithm: themeAlgorithm,
            token: { colorPrimary, colorInfo: colorPrimary },
            components: {
              Menu: {
                darkItemSelectedBg: colorPrimary,
              },
            },
          }}
        >
          <App>
            <ThemeTokenInjector>
              <StyledThemeProvider>{children}</StyledThemeProvider>
            </ThemeTokenInjector>
          </App>
        </ConfigProvider>
      </AppIntlProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
