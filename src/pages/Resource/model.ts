import { getResourceTree, listResources } from '@/services/resource';
import { useEffect, useRef, useState } from 'react';

export const useResourceModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
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
  useEffect(() => {
    getResourceList({});
  }, []);
  return {
    data,
    loading,
    reload: getResourceList,
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
