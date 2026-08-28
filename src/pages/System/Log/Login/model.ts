import {
  batchDeleteLoginLogs,
  clearLoginLog,
  queryLoginLogList,
} from '@/services/loginLog';
import { useCallback, useState } from 'react';

export const useLoginLog = () => {
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

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
    selectedRows,
    setSelectedRows,
  };
};
