import {
  createConfig,
  deleteConfig,
  getConfigById,
  queryConfigList,
  updateConfig,
} from '@/services/config';
import { useCallback } from 'react';

export interface ConfigData {
  configId: string;
  key: string;
  value: string;
  name: string;
  description?: string;
  type: string;
  group: string;
  sort: number;
  status: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export const useConfig = () => {
  const fetchConfigList = useCallback((params?: API.ConfigsFindAllParams) => {
    return queryConfigList(params);
  }, []);

  const fetchConfigDetail = useCallback(async (configId: string) => {
    const { data } = await getConfigById(configId);
    return data;
  }, []);

  const submitConfig = useCallback(async (data: API.CreateConfigDto) => {
    const res = await createConfig(data);
    return res.data;
  }, []);

  const editConfig = useCallback(
    async (configId: string, data: API.UpdateConfigDto) => {
      await updateConfig(configId, data);
    },
    [],
  );

  const removeConfig = useCallback(async (configId: string) => {
    await deleteConfig(configId);
  }, []);

  return {
    fetchConfigList,
    fetchConfigDetail,
    submitConfig,
    editConfig,
    removeConfig,
  };
};
