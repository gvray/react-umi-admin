import {
  batchDeleteOperationLogs,
  clearOperationLog,
  getOperationLog,
  listOperationLog,
} from '@/services/operationLog';
import { useCallback, useState } from 'react';

export const useOperationLog = () => {
  const [loading, setLoading] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  const getOperationLogData = useCallback(
    async (params?: API.OperationLogsFindManyParams) => {
      setLoading(true);
      try {
        return await listOperationLog(params);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const batchDeleteLogs = useCallback(async (ids: string[]) => {
    setBatchDeleting(true);
    try {
      await batchDeleteOperationLogs({ ids });
      setSelectedRowKeys([]);
    } finally {
      setBatchDeleting(false);
    }
  }, []);

  const cleanLogs = useCallback(async () => {
    setCleaning(true);
    try {
      await clearOperationLog();
    } finally {
      setCleaning(false);
    }
  }, []);

  const selectionChange = useCallback((keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  }, []);

  const viewDetail = useCallback(async (id: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const { data } = await getOperationLog(String(id));
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetail(null);
  }, []);

  return {
    loading,
    batchDeleting,
    cleaning,
    selectedRowKeys,
    detailOpen,
    detailLoading,
    detail,
    getOperationLogData,
    batchDeleteLogs,
    cleanLogs,
    selectionChange,
    viewDetail,
    closeDetail,
  };
};
