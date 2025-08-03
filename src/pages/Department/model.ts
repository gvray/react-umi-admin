import { getDepartmentTree, listDepartment } from '@/services/department';
import { useEffect, useState } from 'react';

export const useDepartmentModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getResourceList = async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      const res = await getDepartmentTree(params);
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
  };
};

export const useUpdataFormModel = (open: boolean) => {
  console.log('open', open);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getResourceList = async () => {
    try {
      setLoading(true);
      const res = await listDepartment();
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
