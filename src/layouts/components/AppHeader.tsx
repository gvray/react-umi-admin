import { useFeedback } from '@/hooks';
import { logout } from '@/services/auth';
import { useAuthStore, usePreferences } from '@/stores';
import { logger } from '@/utils';
import { Avatar, Dropdown, Layout, MenuProps, Space } from 'antd';
import storetify from 'storetify';
import { SelectLang, history } from 'umi';
import ThemeSetting from './ThemeSetting';

const { Header } = Layout;

interface AppHeaderProps {
  themeColor: {
    bgColor: string;
  };
  headerFixed: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ themeColor, headerFixed }) => {
  const { profile, clearAuth } = useAuthStore();
  const { colorPrimary } = usePreferences();
  const { message } = useFeedback();

  const handleLogout = async () => {
    try {
      const res: API.Response<void> = await logout();
      message.success(res.message);
      storetify.remove(__APP_API_TOKEN_KEY__);
      clearAuth();
      history.push('/login');
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDropdownMenuClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        history.push('/profile');
        break;
      default:
        break;
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人中心',
    },
    {
      key: 'logout',
      label: '退出登录',
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        background: themeColor.bgColor,
        position: headerFixed ? 'sticky' : 'relative',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 24,
        }}
      >
        <Space size={2} wrap>
          <ThemeSetting />
          <SelectLang />
          <Dropdown
            menu={{ items, onClick: handleDropdownMenuClick }}
            placement="bottomRight"
          >
            <Avatar
              src={profile?.avatar || undefined}
              alt={profile?.username}
              style={{
                cursor: 'pointer',
                backgroundColor: !profile?.avatar ? colorPrimary : undefined,
              }}
            >
              {!profile?.avatar
                ? profile?.nickname?.[0] || profile?.username?.[0]
                : null}
            </Avatar>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
