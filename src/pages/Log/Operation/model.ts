import {
  cleanOperationLogs,
  deleteOperationLog,
  deleteOperationLogs,
  getOperationLogDetail,
  getOperationLogs,
} from '@/services/operationLog';
import { useCallback, useState } from 'react';

export const useOperationLog = () => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);

  const getOperationLogData = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await getOperationLogs(params);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLog = useCallback(async (id: number) => {
    setDeleting(true);
    try {
      await deleteOperationLog(id);
    } finally {
      setDeleting(false);
    }
  }, []);

  const batchDeleteLogs = useCallback(async (ids: number[]) => {
    setBatchDeleting(true);
    try {
      await deleteOperationLogs(ids);
      setSelectedRowKeys([]);
    } finally {
      setBatchDeleting(false);
    }
  }, []);

  const cleanLogs = useCallback(async () => {
    setCleaning(true);
    try {
      await cleanOperationLogs();
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
      const res: any = await getOperationLogDetail(String(id));
      setDetail(res?.data ?? res);
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
    deleting,
    batchDeleting,
    cleaning,
    selectedRowKeys,
    detailOpen,
    detailLoading,
    detail,
    getOperationLogData,
    deleteLog,
    batchDeleteLogs,
    cleanLogs,
    selectionChange,
    viewDetail,
    closeDetail,
  };
};
