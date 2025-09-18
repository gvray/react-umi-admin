import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import {
  clearLoginLog,
  exportLoginLog,
  getLoginLogList,
  type LoginLogRecord,
} from '@/services/loginLog';
import { message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { useCallback, useState } from 'react';

interface LoginLogColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

/**
 * 登录日志业务逻辑Hook
 */
export const useLoginLog = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  // 获取登录日志列表
  const getLoginLogData = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      const response = await getLoginLogList(params);
      return response;
    } catch (error) {
      message.error('获取登录日志失败');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 导出登录日志
  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      await exportLoginLog();
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
      throw error;
    } finally {
      setExporting(false);
    }
  }, []);

  // 清理登录日志
  const handleClear = useCallback(async () => {
    try {
      setClearing(true);
      await clearLoginLog();
      message.success('清理成功');
    } catch (error) {
      message.error('清理失败');
      throw error;
    } finally {
      setClearing(false);
    }
  }, []);

  return {
    // 状态
    loading,
    exporting,
    clearing,

    // 操作方法
    getLoginLogData,
    handleExport,
    handleClear,
  };
};

/**
 * 登录日志表格列配置
 */
export const getLoginLogColumns = (): LoginLogColumnProps<
  LoginLogRecord,
  Record<string, string | number>
>[] => {
  return [
    { title: '访问编号', dataIndex: 'id', key: 'id' },
    {
      title: '登陆账号',
      dataIndex: 'account',
      key: 'account',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '登录地点',
      dataIndex: 'location',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '成功', value: 1 },
          { label: '失败', value: 2 },
        ],
      },
    },
    {
      title: '登录类型',
      dataIndex: 'loginType',
    },
    {
      title: '操作信息',
      dataIndex: 'failReason',
      render: (reason: string) => reason || '登陆成功',
    },
    {
      title: '登录时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      advancedSearch: {
        type: 'TIME_RANGE',
      },
    },
  ];
};
