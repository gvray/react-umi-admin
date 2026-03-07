import AppBreadcrumb from '@/components/AppBreadcrumb';
import AppWatermark from '@/components/AppWatermark';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RouteMetaProvider } from '@/contexts/routeMeta';
import { useAppTheme, useRouteMeta } from '@/hooks';
import useThemeColor from '@/hooks/useThemeColor';
import useThemeMode from '@/hooks/useThemeMode';
import { useAppStore, usePreferences } from '@/stores';
import { App, ConfigProvider, Layout } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'umi';
import AppHeader from './components/AppHeader';
import SideMenu from './components/SideMenu';
import ThemeTokenInjector from './components/ThemeTokenInjector';

const { Content } = Layout;

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
              <Layout
                className={[
                  accessibility.colorWeak ? 'color-weak' : '',
                  accessibility.grayMode ? 'gray-mode' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <SideMenu
                  collapsed={sider.collapsed}
                  theme={effectiveSiderTheme}
                  width={sider.width}
                  collapsedWidth={sider.collapsedWidth}
                  showLogo={sider.showLogo}
                />
                <Layout>
                  <AppHeader
                    themeColor={themeColor}
                    headerFixed={header.fixed}
                  />
                  <Content
                    style={{
                      height: header.fixed ? 'calc(100vh - 64px)' : 'auto',
                      minHeight: header.fixed
                        ? undefined
                        : 'calc(100vh - 64px)',
                      overflow: 'auto',
                    }}
                  >
                    <AppBreadcrumb />
                    <AppWatermark>
                      <ErrorBoundary>
                        <Outlet />
                      </ErrorBoundary>
                    </AppWatermark>
                    {content.showFooter && (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px 0',
                          color: 'rgba(0, 0, 0, 0.45)',
                          fontSize: 14,
                        }}
                      >
                        {content.footerText}
                      </div>
                    )}
                  </Content>
                </Layout>
              </Layout>
            </ThemeTokenInjector>
          </App>
        </ConfigProvider>
      </HelmetProvider>
    </RouteMetaProvider>
  );
}
