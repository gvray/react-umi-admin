import {
  createConfig,
  deleteConfig,
  getConfigById,
  queryConfigList,
  updateConfig,
} from '@/services/config';
import { useCallback, useState } from 'react';

export const useConfig = () => {
  const [configs, setConfigs] = useState<API.ConfigResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [currentConfig, setCurrentConfig] =
    useState<API.ConfigResponseDto | null>(null);

  const getConfigList = useCallback((params?: API.ConfigsFindAllParams) => {
    return queryConfigList(params);
  }, []);

  const getConfigDetail = useCallback(async (configId: string) => {
    setLoading(true);
    try {
      const { data } = await getConfigById(configId);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createConfigItem = useCallback(async (data: API.CreateConfigDto) => {
    setSubmitting(true);
    try {
      const res = await createConfig(data);
      const newConfig = res.data;
      setConfigs((prev) => [...prev, newConfig]);
      return newConfig;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateConfigItem = useCallback(
    async (configId: string, data: API.UpdateConfigDto) => {
      setSubmitting(true);
      try {
        await updateConfig(configId, data);
        setConfigs((prev) =>
          prev.map((config) =>
            config.configId === configId ? { ...config, ...data } : config,
          ),
        );
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

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

  const getConfigValue = useCallback(
    (key: string) => {
      const config = configs.find((c) => c.key === key);
      return config?.value;
    },
    [configs],
  );

  const getConfigsByGroup = useCallback(
    (group: string) => {
      return configs.filter((config) => config.group === group);
    },
    [configs],
  );

  const getConfigsByType = useCallback(
    (type: string) => {
      return configs.filter((config) => config.type === type);
    },
    [configs],
  );

  const getEnabledConfigs = useCallback(() => {
    return configs.filter((config) => config.status === 1);
  }, [configs]);

  const viewDetail = useCallback(async (configId: string) => {
    setViewVisible(true);
    setLoading(true);
    try {
      const { data } = await getConfigById(configId);
      setCurrentConfig(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setViewVisible(false);
    setCurrentConfig(null);
  }, []);

  return {
    configs,
    loading,
    submitting,
    viewVisible,
    currentConfig,
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
