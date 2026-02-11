import {
  batchDeleteLoginLogs,
  clearLoginLog,
  queryLoginLogList,
} from '@/services/loginLog';
import { useCallback, useState } from 'react';

export const useLoginLog = () => {
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const getLoginLogData = useCallback((params?: API.LoginLogsFindAllParams) => {
    return queryLoginLogList(params);
  }, []);

  const deleteLogs = useCallback(async () => {
    setDeleting(true);
    try {
      await batchDeleteLoginLogs({ ids: selectedRows as number[] });
      setSelectedRows([]);
    } finally {
      setDeleting(false);
    }
  }, [selectedRows]);

  const clearLogs = useCallback(async () => {
    setClearing(true);
    try {
      await clearLoginLog();
    } finally {
      setClearing(false);
    }
  }, []);

  const selectionChange = useCallback((selectedRows: React.Key[]) => {
    setSelectedRows(selectedRows);
  }, []);

  return {
    deleting,
    clearing,
    selectedRows,
    getLoginLogData,
    deleteLogs,
    clearLogs,
    selectionChange,
  };
};
