import { logout } from '@/services/login';
import { themes } from '@/themeConfig';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  MenuProps,
  Space,
  message,
  theme,
} from 'antd';
import { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import storetify from 'storetify';
import { Outlet, SelectLang, history, useModel } from 'umi';
import SideMenu from './components/SideMenu';
import ThemeSetting from './components/ThemeSetting';
import styles from './index.less';

const { Header, Content } = Layout;

export default function BaseLayout() {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return (storetify.get('theme') as string) || 'techBlue';
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    try {
      const msg = await logout();
      message.success(msg.message);
      // 退出登陆 清空状态
      storetify.remove(TOKEN_KEY);
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: undefined,
        }));
      });
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

  const handleThemeChange = useCallback((themeKey: string) => {
    setCurrentTheme(themeKey);
  }, []);

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
    <ConfigProvider theme={themes[currentTheme]}>
      <Layout>
        <SideMenu collapsed={collapsed} />
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className={styles.header}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <div className={styles.right}>
                <Space size={16} wrap>
                  <ThemeSetting
                    onChange={handleThemeChange}
                    themeKey={currentTheme}
                  />
                  <SelectLang />
                  <Dropdown menu={{ items, onClick: handleDropdownMenuClick }}>
                    <div className={styles.action}>
                      <Avatar
                        src={
                          <img
                            src={initialState?.currentUser.user.avatar}
                            alt="avatar"
                          />
                        }
                      />
                      <span style={{ marginLeft: 8 }}>
                        {initialState?.currentUser.user.name}
                      </span>
                    </div>
                  </Dropdown>
                </Space>
              </div>
            </div>
          </Header>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
