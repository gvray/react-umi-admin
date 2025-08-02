import { listResources } from '@/services/resource';
import { useEffect, useState } from 'react';

export const useResourceModel = () => {
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
    getResourceList();
  }, []);
  return {
    data,
    loading,
    reload: getResourceList,
  };
};
