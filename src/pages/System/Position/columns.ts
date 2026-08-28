import type { TableProColumnsType } from '@/components/TablePro';

export const getPositionColumns =
  (): TableProColumnsType<API.PositionResponseDto> => {
    return [
      {
        title: '岗位编号',
        dataIndex: 'positionId',
        key: 'positionId',
        width: 120,
      },
      {
        title: '岗位编码',
        dataIndex: 'code',
        key: 'code',
        advancedSearch: { type: 'INPUT' },
        width: 160,
      },
      {
        title: '岗位名称',
        dataIndex: 'name',
        key: 'name',
        advancedSearch: { type: 'INPUT' },
        width: 180,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        advancedSearch: {
          type: 'SELECT',
        },
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
