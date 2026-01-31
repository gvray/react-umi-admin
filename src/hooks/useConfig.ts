import { useConfig } from '@/pages/Config/model';
import { useCallback, useEffect, useState } from 'react';

// 配置管理hooks（已移除自动加载逻辑，保留其余工具hooks）

// 根据键获取配置值的hook
export const useConfigValue = (key: string) => {
  const { configs, getConfigValue } = useConfig();
  const [value, setValue] = useState<string | undefined>();

  useEffect(() => {
    const configValue = getConfigValue(key);
    setValue(configValue);
  }, [key, configs, getConfigValue]);

  return value;
};

// 根据分组获取配置的hook
export const useConfigsByGroup = (group: string) => {
  const { configs, getConfigsByGroup } = useConfig();
  const [groupConfigs, setGroupConfigs] = useState<any[]>([]);

  useEffect(() => {
    const configs = getConfigsByGroup(group);
    setGroupConfigs(configs);
  }, [group, configs, getConfigsByGroup]);

  return groupConfigs;
};

// 根据类型获取配置的hook
export const useConfigsByType = (type: string) => {
  const { configs, getConfigsByType } = useConfig();
  const [typeConfigs, setTypeConfigs] = useState<any[]>([]);

  useEffect(() => {
    const configs = getConfigsByType(type);
    setTypeConfigs(configs);
  }, [type, configs, getConfigsByType]);

  return typeConfigs;
};

// 获取启用配置的hook
export const useEnabledConfigs = () => {
  const { configs, getEnabledConfigs } = useConfig();
  const [enabledConfigs, setEnabledConfigs] = useState<any[]>([]);

  useEffect(() => {
    const configs = getEnabledConfigs();
    setEnabledConfigs(configs);
  }, [configs, getEnabledConfigs]);

  return enabledConfigs;
};

// 配置缓存hook
export const useConfigCache = () => {
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  const getCachedValue = useCallback(
    (key: string) => {
      return cache.get(key);
    },
    [cache],
  );

  const setCachedValue = useCallback((key: string, value: any) => {
    setCache((prev) => new Map(prev).set(key, value));
  }, []);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const removeCachedValue = useCallback((key: string) => {
    setCache((prev) => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  return {
    getCachedValue,
    setCachedValue,
    clearCache,
    removeCachedValue,
  };
};

// 配置验证hook
export const useConfigValidation = () => {
  const validateConfigKey = useCallback((key: string) => {
    const pattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    return pattern.test(key);
  }, []);

  const validateConfigValue = useCallback((value: string, type: string) => {
    switch (type) {
      case 'number':
        return !isNaN(Number(value));
      case 'boolean':
        return value === 'true' || value === 'false';
      case 'json':
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  }, []);

  const validateConfigName = useCallback((name: string) => {
    return name.length > 0 && name.length <= 100;
  }, []);

  return {
    validateConfigKey,
    validateConfigValue,
    validateConfigName,
  };
};
