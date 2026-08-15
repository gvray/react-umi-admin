import { Icon } from '@/components';
import type { ThemeMode } from '@/constants/theme';
import { updateProfileSettings } from '@/services/profile';
import { useSettingStore } from '@/stores';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { styled } from 'umi';

const ICON_MAP: Record<ThemeMode, React.ReactNode> = {
  light: <Icon name="gvray-theme-light" size={18} />,
  dark: <Icon name="gvray-theme-dark" size={18} />,
  system: <Icon name="gvray-theme-system" size={18} />,
};

const THEME_MODE_INTL_KEYS: Record<ThemeMode, string> = {
  light: 'theme.mode.light',
  dark: 'theme.mode.dark',
  system: 'theme.mode.system',
};

const Trigger = styled.div`
  cursor: pointer;
  min-width: 28px;
  height: 28px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 14px;
`;

const ThemeModeSwitch: React.FC = () => {
  const intl = useIntl();
  const theme = useSettingStore((s) => s.theme);
  const setTheme = useSettingStore((s) => s.setTheme);

  const items: MenuProps['items'] = (
    Object.entries(THEME_MODE_INTL_KEYS) as [ThemeMode, string][]
  ).map(([key, id]) => ({
    key,
    label: intl.formatMessage({ id }),
    icon: ICON_MAP[key],
  }));

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    const mode = key as ThemeMode;
    setTheme(mode);
    updateProfileSettings({ theme: mode }).catch(() => {});
  };

  return (
    <Dropdown
      menu={{ items, selectedKeys: [theme], onClick: handleClick }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Trigger>
        {ICON_MAP[theme]}
        <span>{intl.formatMessage({ id: THEME_MODE_INTL_KEYS[theme] })}</span>
      </Trigger>
    </Dropdown>
  );
};

export default ThemeModeSwitch;
