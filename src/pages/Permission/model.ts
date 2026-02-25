import {
  deletePermission,
  getPermissionById,
  queryPermissionParentList,
  queryPermissionTree,
} from '@/services/permission';

import { useCallback, useEffect, useState } from 'react';

export const usePermissionModel = () => {
  const fetchPermissionTree = useCallback(
    async (params?: API.PermissionsGetTreeParams) => {
      return queryPermissionTree(params);
    },
    [],
  );
  const fetchPermissionDetail = useCallback(async (permissionId: string) => {
    const { data } = await getPermissionById(permissionId);
    return data;
  }, []);
  const removePermission = useCallback(async (permissionId: string) => {
    await deletePermission(permissionId);
  }, []);

  return {
    fetchPermissionTree,
    fetchPermissionDetail,
    removePermission,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<API.PermissionResponseDto[]>([]);
  const fetchPermissionTree = async () => {
    try {
      const res = await queryPermissionParentList();
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (open) {
      fetchPermissionTree();
    }
  }, [open]);
  return {
    data,
    reload: fetchPermissionTree,
  };
};
