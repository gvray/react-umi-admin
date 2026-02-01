import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { ColumnProps } from 'antd/es/table';

export interface DictionaryTypeData {
  typeId: string;
  code: string;
  name: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  items?: any[];
  createdAt: string;
  updatedAt: string;
}

interface DictionaryColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}

export const getDictionaryColumns = (): DictionaryColumnProps<
  DictionaryTypeData,
  Record<string, string | number>
>[] => {
  return [
    {
      title: '字典编号',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 100,
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '字典类型',
      dataIndex: 'code',
      key: 'code',
      width: 150,
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
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
