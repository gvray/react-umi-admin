import { themeLabels, themes } from '@/themeConfig';
import { logger } from '@/utils';
import React, { useState } from 'react';
import store from 'storetify';
import ThemeColor from './ThemeColor';
import styles from './index.less';

interface ThemeSettingProps {
  colorList?: {
    key: string;
    color: string;
    title?: string;
  }[];
  themeKey?: string;
  onChange?: (themeKey: string) => void;
}

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
    <div
      className={styles.themeBox}
      onMouseEnter={() => {
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsVisible(false);
      }}
    >
      <span className={styles.bar}>主题</span>
      {isVisible && (
        <div className={styles.box}>
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
    </div>
  );
};

export default ThemeSetting;
