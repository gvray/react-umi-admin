import { getPermissionTree } from '@/services/permission';
import { listResources } from '@/services/resource';
import { useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);

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
  useEffect(() => {
    getPermissionList({
      ...paramsRef.current,
    });
  }, []);
  return {
    data,
    loading,
    reload: getPermissionList,
    showSearch,
    setShowSearch,
    paramsRef,
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
