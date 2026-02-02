import {
  deleteResource,
  getResource,
  getResourceTree,
  listResources,
} from '@/services/resource';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const paramsRef = useRef<Record<string, any>>({});
  const getResourceList = async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      const res = await getResourceTree({
        ...paramsRef.current,
        ...params,
      });
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const getTreeList = useCallback(async (params?: any) => {
    return getResourceTree({
      ...paramsRef.current,
      ...params,
    });
  }, []);
  const getDetail = useCallback(async (resourceId: string) => {
    setLoading(true);
    try {
      const res: any = await getResource(resourceId);
      return res.data ?? res;
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
  useEffect(() => {
    getResourceList({});
  }, []);
  return {
    data,
    loading,
    submitting,
    reload: getResourceList,
    showSearch,
    setShowSearch,
    paramsRef,
    getTreeList,
    getDetail,
    deleteItem,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  console.log('open', open);
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
