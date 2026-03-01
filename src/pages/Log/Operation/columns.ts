import type { TableProColumnsType } from '@/components/TablePro';

export const getOperationLogColumns =
  (): TableProColumnsType<API.LoginLogResponseDto> => {
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
