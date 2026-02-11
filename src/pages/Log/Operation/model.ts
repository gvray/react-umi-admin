import {
  batchDeleteOperationLogs,
  clearOperationLog,
  getOperationLogById,
  queryOperationLogList,
} from '@/services/operationLog';
import { useCallback } from 'react';

export const useOperationLog = () => {
  const fetchOperationLogList = useCallback(
    async (params?: API.OperationLogsFindManyParams) => {
      return queryOperationLogList(params);
    },
    [],
  );

  const fetchOperationLogDetail = useCallback(async (id: number) => {
    const { data } = await getOperationLogById(String(id));
    return data;
  }, []);

  const batchRemoveOperationLogs = useCallback(async (ids: string[]) => {
    await batchDeleteOperationLogs({ ids });
  }, []);

  const clearOperationLogs = useCallback(async () => {
    await clearOperationLog();
  }, []);

  return {
    fetchOperationLogList,
    fetchOperationLogDetail,
    batchRemoveOperationLogs,
    clearOperationLogs,
  };
};
