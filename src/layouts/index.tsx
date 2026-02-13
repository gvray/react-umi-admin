import AppBreadcrumb from '@/components/AppBreadcrumb';
import AppWatermark from '@/components/AppWatermark';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAppTheme, useRouteTitle } from '@/hooks';
import useThemeColor from '@/hooks/useThemeColor';
import { logout } from '@/services/auth';
import { useAppStore, useAuthStore } from '@/stores';
import {
  Avatar,
  ConfigProvider,
  Dropdown,
  Layout,
  MenuProps,
  Space,
  message,
} from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import storetify from 'storetify';
import { Outlet, SelectLang, history, styled } from 'umi';
import SideMenu from './components/SideMenu';
import ThemeSetting from './components/ThemeSetting';

const { Header, Content } = Layout;

const HeaderBox = styled.div`
  height: 64px;
  padding: 0 12px 0 0;
  /* background: #fff; */
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
`;

const HeaderRight = styled.div`
  float: right;
`;

const HeaderAction = styled.div`
  cursor: pointer;
  padding: 0 12px;
  display: inline-block;
  transition: all 0.3s;
  height: 100%;
`;

export default function BaseLayout() {
  const { profile, clearAuth } = useAuthStore();
  const { serverConfig, colorPrimary, sider, header, content, accessibility } =
    useAppStore();

  const themeColor = useThemeColor();
  const routeTitle = useRouteTitle();
  const documentTitle = routeTitle
    ? `${routeTitle} - ${serverConfig.system.name}`
    : serverConfig.system.name;

  const handleLogout = async () => {
    try {
      const msg = await logout();
      message.success(msg.message);
      storetify.remove(__APP_API_TOKEN_KEY__);
      clearAuth();
      history.push('/login');
    } catch (error) {}
  };

  const handleDropdownMenuClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      default:
        history.push('/' + key);
        break;
    }
  };

  const { themeAlgorithm } = useAppTheme();

  const items: MenuProps['items'] = [
    {
      label: '个人中心',
      key: 'profile',
    },
    {
      label: '退出登录',
      key: 'logout',
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{documentTitle}</title>
      </Helmet>
      <ConfigProvider
        theme={{
          algorithm: themeAlgorithm,
          token: { colorPrimary },
        }}
      >
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
            theme={sider.theme}
            width={sider.width}
            collapsedWidth={sider.collapsedWidth}
            showLogo={sider.showLogo}
          />
          <Layout>
            <Header
              style={{
                padding: 0,
                background: themeColor.bgColor,
                position: header.fixed ? 'sticky' : 'relative',
                top: 0,
                zIndex: 100,
              }}
            >
              <HeaderBox>
                <HeaderRight>
                  <Space size={2} wrap>
                    <ThemeSetting />
                    <SelectLang />
                    <Dropdown
                      menu={{ items, onClick: handleDropdownMenuClick }}
                    >
                      <HeaderAction>
                        <Avatar
                          src={
                            <img
                              src={
                                profile?.avatar ||
                                'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay'
                              }
                              alt="avatar"
                            />
                          }
                        />
                        <span style={{ marginLeft: 8 }}>
                          {profile?.nickname || profile?.username}
                        </span>
                      </HeaderAction>
                    </Dropdown>
                  </Space>
                </HeaderRight>
              </HeaderBox>
            </Header>
            <Content
              style={{
                height: header.fixed ? 'calc(100vh - 64px)' : 'auto',
                minHeight: header.fixed ? undefined : 'calc(100vh - 64px)',
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
      </ConfigProvider>
    </HelmetProvider>
  );
}
