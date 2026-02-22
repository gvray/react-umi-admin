import type { TableProColumnsType } from '@/components/TablePro';

export const getUserColumns = (): TableProColumnsType<API.UserResponseDto> => {
  return [
    {
      title: '用户编号',
      dataIndex: 'userId',
      key: 'userId',
      width: 120,
    },
    {
      title: '登陆账号',
      dataIndex: 'username',
      key: 'username',
      advancedSearch: { type: 'INPUT' },
      width: 180,
    },
    {
      title: '用户名称',
      dataIndex: 'nickname',
      key: 'nickname',
      advancedSearch: { type: 'INPUT' },
      width: 180,
    },
    {
      title: '手机号码',
      key: 'phone',
      dataIndex: 'phone',
      advancedSearch: { type: 'INPUT' },
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
      },
      width: 120,
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
