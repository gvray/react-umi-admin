import type { TableProColumnsType } from '@/components/TablePro';

export const getNoticeColumns =
  (): TableProColumnsType<API.NoticeResponseDto> => {
    return [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 280,
        advancedSearch: { type: 'INPUT' },
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        advancedSearch: {
          type: 'SELECT',
        },
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
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width: 80,
      },
      {
        title: '创建时间',
        key: 'createdAt',
        dataIndex: 'createdAt',
        width: 160,
      },
    ];
  };
