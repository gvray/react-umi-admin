import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { ColumnProps } from 'antd/es/table';

interface OperationLogColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

export const getOperationLogColumns = (): OperationLogColumnProps<
  Record<string, unknown>,
  Record<string, string | number>
>[] => {
  return [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '成功', value: 1 },
          { label: '失败', value: 0 },
        ],
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
