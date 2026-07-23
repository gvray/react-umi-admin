import type { TableProColumnsType } from '@/components/TablePro';

/**
 * 在线用户表格列配置
 */
export const getOnlineUserColumns =
  (): TableProColumnsType<API.OnlineUserItemDto> => {
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
        width: 150,
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 150,
      },
      {
        title: '最后活跃',
        dataIndex: 'lastActiveAt',
        key: 'lastActiveAt',
        width: 170,
      },
      {
        title: '会话数',
        dataIndex: 'sessionCount',
        key: 'sessionCount',
        width: 80,
        align: 'center',
      },
    ];
  };
