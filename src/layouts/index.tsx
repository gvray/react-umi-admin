import AppWatermark from '@/components/AppWatermark';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/components/Icon/init';
import NavigationProgress from '@/components/NavigationProgress';
import { useRouteMeta } from '@/hooks';
import { RouteMetaProvider } from '@/providers';
import { useSettingStore } from '@/stores';
import { runtimeConfig } from '@/utils/runtime-config';
import { Layout } from 'antd';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { Outlet, styled } from 'umi';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import AppViewport from './components/AppViewport';
import SideNav from './components/SideNav';

const AppLayout = styled(Layout)`
  height: 100%;
`;

/**
 * 后台布局：仅负责 UI 壳子（SideNav + Header + Content + Footer）。
 *
 * 全局 Provider（Theme、Config、Intl、Helmet、App 上下文等）已全部上提到
 * src/providers/AppProviders.tsx，通过 rootContainer 注入，覆盖所有页面。
 */
export default function BaseLayout() {
  const { system } = runtimeConfig.get();
  const {
    sidebarCollapsed,
    sidebarTheme,
    showLogo,
    fixedHeader,
    showFooter,
    colorWeak,
  } = useSettingStore();
  const grayMode = runtimeConfig.get().ui.grayMode;
  const meta = useRouteMeta();
  const routeTitle = meta.title ?? '';

  const documentTitle = routeTitle
    ? `${routeTitle} - ${system.name}`
    : system.name;

  const layoutClassName = classNames({
    'color-weak': colorWeak,
    'gray-mode': grayMode,
  });

  return (
    <RouteMetaProvider meta={meta}>
      <Helmet>
        <title>{documentTitle}</title>
      </Helmet>
      <AppLayout className={layoutClassName}>
        <SideNav
          collapsed={sidebarCollapsed}
          sidebarTheme={sidebarTheme}
          showLogo={showLogo}
        />
        <AppViewport>
          <NavigationProgress />
          <AppHeader headerFixed={fixedHeader} />

          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
          <AppFooter
            visible={showFooter}
            text={system.footerText}
            copyright={system.copyright}
            icp={system.icp}
          />
          <AppWatermark />
        </AppViewport>
      </AppLayout>
    </RouteMetaProvider>
  );
}
