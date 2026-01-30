import {
  clearLoginLog,
  deleteLoginLog,
  exportLoginLog,
  getLoginLogList,
} from '@/services/loginLog';
import { useCallback, useState } from 'react';

/**
 * 登录日志业务逻辑Hook
 */
export const useLoginLog = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  // 获取登录日志列表 方便以后扩展 不然不需要warp getLoginLogList
  const getLoginLogData = useCallback((params?: any) => {
    return getLoginLogList(params);
  }, []);

  // 导出登录日志
  const exportLog = useCallback(async () => {
    setExporting(true);
    try {
      await exportLoginLog();
    } finally {
      setExporting(false);
    }
  }, []);

  // 删除选中的登录日志
  const deleteLogs = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteLoginLog(selectedRows);
    } finally {
      setDeleting(false);
    }
  }, [selectedRows]);

  // 清理登录日志
  const clearLogs = useCallback(async () => {
    setClearing(true);
    try {
      await clearLoginLog();
    } finally {
      setClearing(false);
    }
  }, []);

  // 处理选择变化
  const selectionChange = useCallback((selectedRows: string[]) => {
    setSelectedRows(selectedRows);
  }, []);

  return {
    // 状态
    deleting,
    exporting,
    clearing,
    selectedRows,

    // 操作方法
    getLoginLogData,
    exportLog,
    deleteLogs,
    clearLogs,
    selectionChange,
  };
};
