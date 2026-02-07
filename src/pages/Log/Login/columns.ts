import { AdvancedSearchItem } from '@/components/TablePro/components/AdvancedSearchForm';
import { ColumnProps } from 'antd/es/table';
interface LoginLogColumnProps<T, U> extends ColumnProps<T> {
  advancedSearch?: AdvancedSearchItem<U>;
}
/**
 * 登录日志表格列配置
 */
export const getLoginLogColumns = (): LoginLogColumnProps<
  API.LoginLogResponseDto,
  Record<string, string | number>
>[] => {
  return [
    { title: '访问编号', dataIndex: 'id', key: 'id' },
    {
      title: '登陆账号',
      dataIndex: 'account',
      key: 'account',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      advancedSearch: { type: 'INPUT' },
    },
    {
      title: '登录地点',
      dataIndex: 'location',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '成功', value: 1 },
          { label: '失败', value: 2 },
        ],
      },
    },
    {
      title: '登录类型',
      dataIndex: 'loginType',
    },
    {
      title: '操作信息',
      dataIndex: 'failReason',
      render: (reason: string) => reason || '登陆成功',
    },
    {
      title: '登录时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
