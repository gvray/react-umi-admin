import {
  deletePermission,
  getPermission,
  getPermissionTree,
} from '@/services/permission';
import { listResources } from '@/services/resource';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const getPermissionList = async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      const res = await getPermissionTree({
        ...paramsRef.current,
        ...params,
      });
      if (res.data) {
        setData(res.data.tree);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const getTreeList = useCallback(async (params?: any) => {
    return getPermissionTree({
      ...paramsRef.current,
      ...params,
    });
  }, []);
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
  useEffect(() => {
    getPermissionList({
      ...paramsRef.current,
    });
  }, []);
  return {
    data,
    loading,
    submitting,
    reload: getPermissionList,
    paramsRef,
    getTreeList,
    getDetail,
    deleteItem,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getResourceList = async () => {
    try {
      setLoading(true);
      const res = await listResources();
      if (res.data && res.data.items && res.data.items.length > 0) {
        setData(res.data.items);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getResourceList();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getResourceList,
  };
};
