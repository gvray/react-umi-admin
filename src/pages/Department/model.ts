import { getDepartmentTree, listDepartment } from '@/services/department';
import { useEffect, useState } from 'react';

export const useDepartmentModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getDepartmentList = async (params?: Record<string, any>) => {
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
    getDepartmentList({});
  }, []);
  return {
    data,
    loading,
    reload: getDepartmentList,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  console.log('open', open);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getDepartmentList = async () => {
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
      getDepartmentList();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getDepartmentList,
  };
};
