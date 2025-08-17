import {
  createConfig,
  deleteConfig,
  getConfig,
  listConfig,
  updateConfig,
} from '@/services/config';
import { message } from 'antd';
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

  // 加载配置列表
  const loadConfigs = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      const response = await listConfig(params);
      const data = response.data || [];
      setConfigs(data);
      return data;
    } catch (error) {
      message.error('加载配置列表失败');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取配置详情
  const getConfigDetail = useCallback(async (configId: string) => {
    try {
      setLoading(true);
      const response = await getConfig(configId);
      return response.data;
    } catch (error) {
      message.error('获取配置详情失败');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建配置
  const createConfigItem = useCallback(async (data: Partial<ConfigData>) => {
    try {
      setSubmitting(true);
      const response = await createConfig(data);
      const newConfig = response.data;
      setConfigs((prev) => [...prev, newConfig]);
      message.success('配置创建成功');
      return newConfig;
    } catch (error) {
      message.error('配置创建失败');
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // 更新配置
  const updateConfigItem = useCallback(
    async (configId: string, data: Partial<ConfigData>) => {
      try {
        setSubmitting(true);
        await updateConfig(configId, data);
        setConfigs((prev) =>
          prev.map((config) =>
            config.configId === configId ? { ...config, ...data } : config,
          ),
        );
        message.success('配置更新成功');
      } catch (error) {
        message.error('配置更新失败');
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  // 删除配置
  const deleteConfigItem = useCallback(async (configId: string) => {
    try {
      setSubmitting(true);
      await deleteConfig(configId);
      setConfigs((prev) =>
        prev.filter((config) => config.configId !== configId),
      );
      message.success('配置删除成功');
    } catch (error) {
      message.error('配置删除失败');
      throw error;
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

  return {
    // 状态
    configs,
    loading,
    submitting,

    // 操作方法
    loadConfigs,
    getConfigDetail,
    createConfigItem,
    updateConfigItem,
    deleteConfigItem,
    getConfigValue,
    getConfigsByGroup,
    getConfigsByType,
    getEnabledConfigs,
  };
};
