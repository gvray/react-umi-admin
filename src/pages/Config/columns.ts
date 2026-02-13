import { CONFIG_STATUS_OPTIONS, CONFIG_TYPE_OPTIONS } from './constants';

export const getConfigColumns = (): any[] => {
  return [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '配置键',
      dataIndex: 'key',
      key: 'key',
      width: 180,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: CONFIG_TYPE_OPTIONS,
      },
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      width: 120,
      advancedSearch: {
        type: 'SELECT',
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: CONFIG_STATUS_OPTIONS,
      },
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 160,
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
