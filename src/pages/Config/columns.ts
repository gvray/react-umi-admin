import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { ColumnProps } from 'antd/es/table';
import { CONFIG_GROUP_OPTIONS } from './constants';
import type { ConfigData } from './model';

interface ConfigColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

export const getConfigColumns = (): ConfigColumnProps<
  ConfigData,
  Record<string, string | number>
>[] => {
  return [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '配置键',
      dataIndex: 'key',
      key: 'key',
      width: 160,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '字符串', value: 'string' },
          { label: '数字', value: 'number' },
          { label: '布尔值', value: 'boolean' },
          { label: 'JSON', value: 'json' },
        ],
      },
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      width: 100,
      advancedSearch: {
        type: 'SELECT',
        value: CONFIG_GROUP_OPTIONS,
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
        value: [
          { label: '禁用', value: 0 },
          { label: '启用', value: 1 },
        ],
      },
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 140,
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
