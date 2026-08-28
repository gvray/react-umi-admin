import {
  deleteConfig,
  getConfigById,
  queryConfigList,
} from '@/services/config';
import { useCallback } from 'react';

export const useConfigModel = () => {
  const fetchConfigList = useCallback(
    (params?: API.ConfigsFindAllParams) => queryConfigList(params),
    [],
  );

  const fetchConfigDetail = useCallback(async (configId: string) => {
    const { data } = await getConfigById(configId);
    return data;
  }, []);

  const removeConfig = useCallback(async (configId: string) => {
    await deleteConfig(configId);
  }, []);

  return {
    fetchConfigList,
    fetchConfigDetail,
    removeConfig,
  };
};
