import { Icon } from '@/components';
import { ColorPrimary, PRIMARY_COLOR_INTL_KEYS } from '@/constants';
import { updateProfileSettings } from '@/services/profile';
import { useSettingStore } from '@/stores';
import { Popover } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { styled } from 'umi';
import ThemeColor from './ThemeColor';

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

interface ThemeSettingProps {
  onChange?: (theme: { label: string; color: string }) => void;
}

const ThemeSetting: React.FC<ThemeSettingProps> = ({ onChange }) => {
  const intl = useIntl();
  const { colorPrimary } = useSettingStore();
  const setColorPrimary = useSettingStore((s) => s.setColorPrimary);

  const themeSelectHandle = (selected: { label: string; color: string }) => {
    setColorPrimary(selected.color as ColorPrimary);
    updateProfileSettings({ colorPrimary: selected.color }).catch(() => {
      // silent
    });
    onChange?.(selected);
  };

  const colorList = (
    Object.entries(PRIMARY_COLOR_INTL_KEYS) as [ColorPrimary, string][]
  ).map(([color, id]) => ({ color, label: intl.formatMessage({ id }) }));

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      arrow={false}
      styles={{ body: { padding: '8px 12px' } }}
      content={
        <ThemeColor
          value={colorPrimary}
          colorList={colorList}
          onChange={themeSelectHandle}
        />
      }
    >
      <Trigger>
        <Icon name="gvray-theme-primary" size={18} />
        <span>{intl.formatMessage({ id: 'theme.setting.title' })}</span>
      </Trigger>
    </Popover>
  );
};

export default ThemeSetting;
