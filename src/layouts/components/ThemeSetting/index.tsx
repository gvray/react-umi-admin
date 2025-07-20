import { themeLabels, themes } from '@/themeConfig';
import { logger } from '@/utils';
import React, { useState } from 'react';
import store from 'storetify';
import { styled } from 'umi';
import ThemeColor from './ThemeColor';

interface ThemeSettingProps {
  colorList?: {
    key: string;
    color: string;
    title?: string;
  }[];
  themeKey?: string;
  onChange?: (themeKey: string) => void;
}

const ThemeSettingWrapper = styled.div`
  position: relative;
  width: 40px;
  text-align: center;
  .bar {
    cursor: pointer;
    font-weight: bold;
    height: 100%;
  }
  .box {
    position: absolute;
    padding: 8px 12px;
    list-style-type: none;
    background-color: #ffffff;
    background-clip: padding-box;
    border-radius: 8px;
    outline: none;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    top: 58px;
    right: 0px;
    z-index: 9;
  }
`;
const ThemeSetting: React.FC<ThemeSettingProps> = ({
  themeKey = 'default',
  onChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const themeSelectHandle = (theme: { key: string; color: string }) => {
    logger.info(`主题切换为：${themeLabels[theme.key]}`);
    onChange?.(theme.key);
    store('theme', theme.key);
  };

  return (
    <ThemeSettingWrapper
      onMouseEnter={() => {
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsVisible(false);
      }}
    >
      <span className="bar">主题</span>
      {isVisible && (
        <div className="box">
          <ThemeColor
            value={themeKey}
            colorList={Object.keys(themes).map((themeKey) => {
              return {
                key: themeKey,
                color: themes[themeKey].token?.colorPrimary as string,
                title: themeLabels[themeKey],
              };
            })}
            onChange={themeSelectHandle}
          />
        </div>
      )}
    </ThemeSettingWrapper>
  );
};

export default ThemeSetting;
