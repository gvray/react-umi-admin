import { ROOT_PARENT_ID } from '@/constants';
import {
  deleteResource,
  getResource,
  getResourceTree,
  listResources,
} from '@/services/resource';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const paramsRef = useRef<Record<string, unknown>>({});
  const getResources = async (params?: Record<string, unknown>) => {
    return getResourceTree(params);
  };
  const getDetail = useCallback(async (resourceId: string) => {
    setLoading(true);
    try {
      const { data } = await getResource(resourceId);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteItem = useCallback(async (resourceId: string) => {
    setSubmitting(true);
    try {
      await deleteResource(resourceId);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    loading,
    submitting,
    showSearch,
    setShowSearch,
    paramsRef,
    getResources,
    getDetail,
    deleteItem,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const getResources = async () => {
    try {
      setLoading(true);
      const res = await listResources();
      if (res.data && Array.isArray(res.data)) {
        setData([
          {
            resourceId: ROOT_PARENT_ID,
            name: '顶级资源',
            description: '顶级资源',
          },
          ...res.data,
        ]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getResources();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getResources,
  };
};
