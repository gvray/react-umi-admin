import { useThemeStore } from '@/stores';
import { startSystemThemeWatcher, stopSystemThemeWatcher } from '@/utils/theme';
import { theme } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const useAppTheme = () => {
  const { themeMode } = useThemeStore();
  const [systemTheme, setSystemTheme] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const themeAlgorithm = useMemo(() => {
    if (themeMode === 'dark') {
      return theme.darkAlgorithm;
    } else if (themeMode === 'system') {
      if (systemTheme === 'dark') {
        return theme.darkAlgorithm;
      }
    }
    return theme.defaultAlgorithm;
  }, [themeMode, systemTheme]);

  useEffect(() => {
    if (themeMode === 'system') {
      startSystemThemeWatcher(setSystemTheme);
    }
    return () => {
      stopSystemThemeWatcher();
    };
  }, [themeMode]);

  return { themeAlgorithm };
};

export default useAppTheme;
