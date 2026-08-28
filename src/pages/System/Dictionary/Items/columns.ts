import type { TableProColumnsType } from '@/components/TablePro';

export const getDictionaryItemColumns =
  (): TableProColumnsType<API.DictionaryItemResponseDto> => {
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
