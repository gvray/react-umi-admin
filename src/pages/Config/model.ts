import {
  createConfig,
  deleteConfig,
  getConfig,
  listConfig,
  updateConfig,
} from '@/services/config';
import { useCallback, useState } from 'react';

export interface ConfigData {
  configId: string;
  key: string;
  value: string;
  name: string;
  description?: string;
  type: string;
  group: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export const useConfig = () => {
  const [configs, setConfigs] = useState<ConfigData[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ConfigData | null>(null);

  const getConfigList = useCallback((params?: any) => {
    return listConfig(params);
  }, []);

  // 获取配置详情
  const getConfigDetail = useCallback(async (configId: string) => {
    setLoading(true);
    try {
      const response: any = await getConfig(configId);
      return response.data;
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建配置
  const createConfigItem = useCallback(async (data: Partial<ConfigData>) => {
    setSubmitting(true);
    try {
      const response: any = await createConfig(data);
      const newConfig = response.data;
      setConfigs((prev) => [...prev, newConfig]);
      return newConfig;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // 更新配置
  const updateConfigItem = useCallback(
    async (configId: string, data: Partial<ConfigData>) => {
      setSubmitting(true);
      await updateConfig(configId, data);
      setConfigs((prev) =>
        prev.map((config) =>
          config.configId === configId ? { ...config, ...data } : config,
        ),
      );
      setSubmitting(false);
    },
    [],
  );

  // 删除配置
  const deleteConfigItem = useCallback(async (configId: string) => {
    setSubmitting(true);
    try {
      await deleteConfig(configId);
      setConfigs((prev) =>
        prev.filter((config) => config.configId !== configId),
      );
    } finally {
      setSubmitting(false);
    }
  }, []);

  // 根据键获取配置值
  const getConfigValue = useCallback(
    (key: string) => {
      const config = configs.find((c) => c.key === key);
      return config?.value;
    },
    [configs],
  );

  // 根据分组获取配置
  const getConfigsByGroup = useCallback(
    (group: string) => {
      return configs.filter((config) => config.group === group);
    },
    [configs],
  );

  // 根据类型获取配置
  const getConfigsByType = useCallback(
    (type: string) => {
      return configs.filter((config) => config.type === type);
    },
    [configs],
  );

  // 获取启用的配置
  const getEnabledConfigs = useCallback(() => {
    return configs.filter((config) => config.status === 1);
  }, [configs]);

  const viewDetail = useCallback(async (configId: string) => {
    setViewVisible(true);
    setLoading(true);
    try {
      const response: any = await getConfig(configId);
      setCurrentConfig(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setViewVisible(false);
    setCurrentConfig(null);
  }, []);

  return {
    // 状态
    configs,
    loading,
    submitting,
    viewVisible,
    currentConfig,

    // 操作方法
    getConfigList,
    getConfigDetail,
    createConfigItem,
    updateConfigItem,
    deleteConfigItem,
    getConfigValue,
    getConfigsByGroup,
    getConfigsByType,
    getEnabledConfigs,
    viewDetail,
    closeDetail,
  };
};
