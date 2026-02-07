import { getPermissionTree } from '@/services/permission';
import { deleteRole, getRole, listRole } from '@/services/role';
import { useCallback, useEffect, useState } from 'react';

export const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<API.PermissionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const getPermissions = async () => {
    try {
      setLoading(true);
      const res = await getPermissionTree();
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (open) {
      getPermissions();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getPermissions,
  };
};

export const useRoleModel = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const getList = useCallback(async (params?: API.RolesFindAllParams) => {
    return listRole(params);
  }, []);
  const getDetail = useCallback(async (roleId: string) => {
    setLoading(true);
    try {
      const { data } = await getRole(roleId);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteItem = useCallback(async (roleId: string) => {
    setSubmitting(true);
    try {
      await deleteRole(roleId);
    } finally {
      setSubmitting(false);
    }
  }, []);
  return {
    loading,
    submitting,
    getList,
    getDetail,
    deleteItem,
  };
};
