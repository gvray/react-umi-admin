import { useAppTheme } from '@/hooks';
import useThemeColor from '@/hooks/useThemeColor';
import { logout } from '@/services/auth';
import { useThemeStore } from '@/stores';
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
} from 'antd';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import storetify from 'storetify';
import { Outlet, SelectLang, history, styled, useModel } from 'umi';
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
  const { initialState, setInitialState } = useModel('@@initialState');
  const [collapsed, setCollapsed] = useState(false);

  const themeColor = useThemeColor();
  const { token: themeToken } = useThemeStore();

  const handleLogout = async () => {
    try {
      const msg = await logout();
      message.success(msg.message);
      // 退出登陆 清空状态
      storetify.remove(__APP_API_TOKEN_KEY__);
      flushSync(() => {
        setInitialState(
          (s) =>
            ({
              ...s,
              profile: undefined,
            } as any),
        );
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
    <ConfigProvider
      theme={{
        algorithm: themeAlgorithm,
        token: themeToken,
      }}
    >
      <Layout>
        <SideMenu collapsed={collapsed} />
        <Layout>
          <Header style={{ padding: 0, background: themeColor.bgColor }}>
            <HeaderBox>
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
              <HeaderRight>
                <Space size={2} wrap>
                  <ThemeSetting />
                  <SelectLang />
                  <Dropdown menu={{ items, onClick: handleDropdownMenuClick }}>
                    <HeaderAction>
                      <Avatar
                        src={
                          <img
                            src={
                              initialState?.profile?.avatar ||
                              'https://api.dicebear.com/9.x/bottts/svg?seed=GavinRay'
                            }
                            alt="avatar"
                          />
                        }
                      />
                      <span style={{ marginLeft: 8 }}>
                        {initialState?.profile?.nickname ||
                          initialState?.profile?.username}
                      </span>
                    </HeaderAction>
                  </Dropdown>
                </Space>
              </HeaderRight>
            </HeaderBox>
          </Header>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
