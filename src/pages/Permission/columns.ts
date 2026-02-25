import type { TableProColumnsType } from '@/components/TablePro';

export const getPermissionColumns =
  (): TableProColumnsType<API.PermissionResponseDto> => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        advancedSearch: {
          type: 'INPUT',
        },
      },
      {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
        width: 80,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        advancedSearch: {
          type: 'SELECT',
        },
        width: 120,
      },
      {
        title: '操作类型',
        dataIndex: 'action',
        key: 'action',
        advancedSearch: {
          type: 'SELECT',
        },
        width: 120,
      },
      {
        title: '权限点',
        dataIndex: 'code',
        key: 'code',
        advancedSearch: {
          type: 'INPUT',
        },
        width: 220,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 160,
        advancedSearch: {
          type: 'DATE_RANGE',
        },
      },
    ];
  };
