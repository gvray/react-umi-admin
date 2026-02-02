export const getRoleColumns = (): any[] => {
  return [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      key: 'roleId',
      width: 120,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      advancedSearch: { type: 'INPUT' },
      width: 180,
    },
    {
      title: '角色标识',
      dataIndex: 'roleKey',
      key: 'roleKey',
      advancedSearch: { type: 'INPUT' },
      width: 180,
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '停用', value: 0 },
          { label: '正常', value: 1 },
          { label: '审核中', value: 2 },
          { label: '封禁', value: 3 },
        ],
      },
      width: 120,
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
