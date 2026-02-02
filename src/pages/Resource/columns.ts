export const getResourceColumns = (): any[] => {
  return [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      advancedSearch: {
        type: 'INPUT',
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '资源路径',
      dataIndex: 'path',
      key: 'path',
      advancedSearch: {
        type: 'INPUT',
      },
      width: 220,
    },
    {
      title: '资源权限',
      dataIndex: 'code',
      key: 'code',
      advancedSearch: {
        type: 'INPUT',
      },
      width: 200,
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
