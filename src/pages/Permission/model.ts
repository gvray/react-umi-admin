import {
  deletePermission,
  getPermissionById,
  queryPermissionTree,
} from '@/services/permission';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const paramsRef = useRef<Record<string, unknown>>({});
  const getPermissions = async (params?: API.PermissionsGetTreeParams) => {
    return queryPermissionTree(params);
  };
  const getDetail = useCallback(async (permissionId: string) => {
    setLoading(true);
    try {
      const { data } = await getPermissionById(permissionId);
      return data;
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
  const [data, setData] = useState<API.PermissionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const getTree = async () => {
    try {
      setLoading(true);
      const res = await queryPermissionTree();
      if (res.data) {
        setData(res.data);
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
