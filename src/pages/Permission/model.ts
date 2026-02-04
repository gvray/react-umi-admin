import {
  deletePermission,
  getPermission,
  getPermissionTree,
} from '@/services/permission';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const getPermissions = async (params?: Record<string, any>) => {
    return getPermissionTree(params);
  };
  const getDetail = useCallback(async (permissionId: string) => {
    setLoading(true);
    try {
      const res: any = await getPermission(permissionId);
      return res.data ?? res;
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteItem = useCallback(async (permissionId: string) => {
    setSubmitting(true);
    try {
      await deletePermission(permissionId);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    loading,
    submitting,
    paramsRef,
    getPermissions,
    getDetail,
    deleteItem,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getTree = async () => {
    try {
      setLoading(true);
      const res = (await getPermissionTree()) as any;
      if (res?.data) {
        setData(res.data.tree || res.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getTree();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getTree,
  };
};
