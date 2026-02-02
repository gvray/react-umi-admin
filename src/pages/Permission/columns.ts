export const getPermissionColumns = (): any[] => {
  return [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      advancedSearch: {
        type: 'INPUT',
      },
    },
    {
      title: '权限类型',
      dataIndex: 'action',
      key: 'action',
      width: 120,
    },
    {
      title: '权限点',
      dataIndex: 'code',
      key: 'code',
      advancedSearch: {
        type: 'INPUT',
      },
      width: 220,
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
