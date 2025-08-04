import { getPermissionTree } from '@/services/permission';
import { listResources } from '@/services/resource';
import { useEffect, useState } from 'react';

export const useResourceModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getPermissionList = async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      const res = await getPermissionTree(params);
      if (res.data) {
        setData(res.data.tree);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPermissionList({});
  }, []);
  return {
    data,
    loading,
    reload: getPermissionList,
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
      getResourceList();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getResourceList,
  };
};
