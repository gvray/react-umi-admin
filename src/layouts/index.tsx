import AppWatermark from '@/components/AppWatermark';
import ErrorBoundary from '@/components/ErrorBoundary';
import NavigationProgress from '@/components/NavigationProgress';
import { RouteMetaProvider } from '@/contexts/routeMeta';
import { useAppTheme, useRouteMeta } from '@/hooks';
import useThemeColor from '@/hooks/useThemeColor';
import useThemeMode from '@/hooks/useThemeMode';
import { useAppStore, usePreferences } from '@/stores';
import { App, ConfigProvider, Layout } from 'antd';
import classNames from 'classnames';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet, styled } from 'umi';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import AppViewport from './components/AppViewport';
import SideNav from './components/SideNav';
import ThemeTokenInjector from './components/ThemeTokenInjector';

const AppLayout = styled(Layout)`
  height: 100%;
`;

export default function BaseLayout() {
  const serverConfig = useAppStore((s) => s.serverConfig);
  const { colorPrimary, sider, header, content, accessibility } =
    usePreferences();
  const themeColor = useThemeColor();
  const meta = useRouteMeta();
  const routeTitle = meta.title ?? '';
  const { themeAlgorithm } = useAppTheme();
  const effectiveThemeMode = useThemeMode();

  // 暗色模式下强制 sidebar dark，浅色模式下尊重用户偏好
  const effectiveSiderTheme =
    effectiveThemeMode === 'dark' ? 'dark' : sider.theme;

  const documentTitle = routeTitle
    ? `${routeTitle} - ${serverConfig.system.name}`
    : serverConfig.system.name;

  const layoutClassName = classNames({
    'color-weak': accessibility.colorWeak,
    'gray-mode': accessibility.grayMode,
  });

  return (
    <RouteMetaProvider meta={meta}>
      <HelmetProvider>
        <Helmet>
          <title>{documentTitle}</title>
        </Helmet>
        <ConfigProvider
          theme={{
            algorithm: themeAlgorithm,
            token: { colorPrimary },
            components: {
              Menu: {
                darkItemSelectedBg: colorPrimary,
              },
            },
          }}
        >
          <App>
            <ThemeTokenInjector>
              <AppLayout className={layoutClassName}>
                <SideNav
                  collapsed={sider.collapsed}
                  theme={effectiveSiderTheme}
                  width={sider.width}
                  collapsedWidth={sider.collapsedWidth}
                  showLogo={sider.showLogo}
                />
                <AppViewport>
                  <NavigationProgress />
                  <AppHeader
                    themeColor={themeColor}
                    headerFixed={header.fixed}
                  />

                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                  <AppFooter
                    visible={content.showFooter}
                    text={content.footerText}
                  />
                  <AppWatermark />
                </AppViewport>
              </AppLayout>
            </ThemeTokenInjector>
          </App>
        </ConfigProvider>
      </HelmetProvider>
    </RouteMetaProvider>
  );
}
