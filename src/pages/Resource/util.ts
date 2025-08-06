export const withVirtualRoot = (data: any[]) => {
  return [
    {
      resourceId: '__root__',
      name: '顶级资源（无上级）',
      parentResourceId: null,
    },
    ...data.map((item) => ({
      ...item,
      parentResourceId:
        item.parentResourceId === null ? '__root__' : item.parentResourceId,
    })),
  ];
};

export const normalizeToBackend = (values: any) => {
  return {
    ...values,
    parentResourceId:
      values.parentResourceId === '__root__' ? null : values.parentResourceId,
  };
};
