import type { TableProColumnsType } from '@/components/TablePro';
import { Tooltip } from 'antd';

export const getOperationLogColumns = (): TableProColumnsType<
  Record<string, unknown>
> => {
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
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 80,
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '成功', value: 'success' },
          { label: '失败', value: 'failure' },
        ],
      },
    },
    {
      title: '资源',
      dataIndex: 'resource',
      key: 'resource',
      ellipsis: true,
      advancedSearch: { type: 'INPUT' },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
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
      width: 120,
      ellipsis: true,
    },
    {
      title: '耗时',
      dataIndex: 'latencyMs',
      key: 'latencyMs',
      width: 90,
      render: (v: number) => (v ? `${v} ms` : '-'),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
