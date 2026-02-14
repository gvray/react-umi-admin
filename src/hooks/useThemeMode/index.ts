import { usePreferences } from '@/stores';
import { useMemo } from 'react';

const useThemeMode = () => {
  const { themeMode } = usePreferences();
  const mode = useMemo(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return themeMode;
  }, [themeMode]);
  return mode;
};

export default useThemeMode;
