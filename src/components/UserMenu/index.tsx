import { useFeedback } from '@/hooks';
import { logout } from '@/services/auth';
import { useAuthStore, useSettingStore } from '@/stores';
import { logger, tokenManager } from '@/utils';
import { runtimeConfig } from '@/utils/runtime-config';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { history, styled } from 'umi';

const DEFAULT_AVATAR_URL = __APP_DEFAULT_AVATAR_URL__;

const UserAvatar = styled(Avatar)<{
  $backgroundColor?: string;
}>`
  cursor: pointer;
  margin-left: 6px;

  ${({ $backgroundColor }) =>
    $backgroundColor &&
    `
      background-color: ${$backgroundColor};
    `}
`;

const UserMenu: React.FC = () => {
  const { profile, clearAuth } = useAuthStore();
  const { colorPrimary } = useSettingStore();
  const { message } = useFeedback();

  const handleLogout = async () => {
    try {
      const res = await logout();

      message.success(res.message);

      tokenManager.clearTokens();
      clearAuth();

      history.push('/login');
    } catch (error) {
      logger.error(error);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'profile':
        history.push('/profile');
        break;

      case 'logout':
        await handleLogout();
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

  const userProfile = (profile as any)?.profile;
  const avatarSrc =
    userProfile?.avatar ||
    runtimeConfig.get().user.defaultAvatar ||
    DEFAULT_AVATAR_URL ||
    undefined;
  const avatarText =
    (userProfile?.nickname?.trim() || profile?.username)?.[0] ?? '?';

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <UserAvatar
        src={avatarSrc}
        alt={profile?.username}
        $backgroundColor={!avatarSrc ? colorPrimary : undefined}
        onError={() => false}
      >
        {avatarText}
      </UserAvatar>
    </Dropdown>
  );
};

export default UserMenu;
