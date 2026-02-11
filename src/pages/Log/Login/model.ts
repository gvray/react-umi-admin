import {
  batchDeleteLoginLogs,
  clearLoginLog,
  queryLoginLogList,
} from '@/services/loginLog';
import { useCallback } from 'react';

export const useLoginLog = () => {
  const fetchLoginLogList = useCallback(
    (params?: API.LoginLogsFindAllParams) => {
      return queryLoginLogList(params);
    },
    [],
  );

  const batchRemoveLoginLogs = useCallback(async (ids: number[]) => {
    await batchDeleteLoginLogs({ ids });
  }, []);

  const clearLoginLogs = useCallback(async () => {
    await clearLoginLog();
  }, []);

  return {
    fetchLoginLogList,
    batchRemoveLoginLogs,
    clearLoginLogs,
  };
};
