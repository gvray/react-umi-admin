import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { ColumnProps } from 'antd/es/table';

export interface DictionaryItemData {
  itemId: string;
  typeCode: string;
  value: string;
  label: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryItemColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

export const getDictionaryItemColumns = (): DictionaryItemColumnProps<
  DictionaryItemData,
  Record<string, string | number>
>[] => {
  return [
    {
      title: '字典项ID',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 120,
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      key: 'label',
      width: 120,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '字典值',
      dataIndex: 'value',
      key: 'value',
      width: 100,
      advancedSearch: { type: 'INPUT' },
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
    },
  ];
};
