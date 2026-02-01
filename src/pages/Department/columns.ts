export const getDepartmentColumns = (): any[] => {
  return [
    {
      title: '部门名称',
      dataIndex: 'name',
      fixed: 'left',
      advancedSearch: {
        type: 'INPUT',
      },
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
      advancedSearch: {
        type: 'SELECT',
        value: [
          { label: '停用', value: 0 },
          { label: '正常', value: 1 },
        ],
      },
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 140,
      advancedSearch: {
        type: 'DATE_RANGE',
      },
    },
  ];
};
