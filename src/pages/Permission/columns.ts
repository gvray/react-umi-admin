import type { TableProColumnsType } from '@/components/TablePro';
import type { PermissionTreeNode } from './model';

export const getPermissionColumns = (
  formatMessage: (descriptor: { id: string }) => string,
): TableProColumnsType<PermissionTreeNode> => {
  return [
    {
      title: formatMessage({ id: 'permission.column.name' }),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 240,
      ellipsis: { showTitle: false },
    },
    {
      title: formatMessage({ id: 'permission.column.code' }),
      dataIndex: 'code',
      key: 'code',
      width: 150,
      ellipsis: { showTitle: false },
    },
    {
      title: formatMessage({ id: 'permission.column.description' }),
      dataIndex: 'description',
      key: 'description',
      ellipsis: { showTitle: false },
    },
    {
      title: formatMessage({ id: 'permission.column.origin' }),
      dataIndex: 'origin',
      key: 'origin',
      width: 90,
    },
    {
      title: formatMessage({ id: 'permission.column.updatedAt' }),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
    },
  ];
};
