export const withVirtualRoot = (data: any[]) => {
  return [
    {
      permissionId: '__root__',
      name: '顶级权限（无上级）',
      parentPermissionId: null,
    },
    ...data.map((item) => ({
      ...item,
      parentPermissionId:
        item.parentPermissionId === null ? '__root__' : item.parentPermissionId,
    })),
  ];
};

export const normalizeToBackend = (values: any) => {
  return {
    ...values,
    parentPermissionId:
      values.parentPermissionId === '__root__'
        ? null
        : values.parentPermissionId,
  };
};
