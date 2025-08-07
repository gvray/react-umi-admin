import { getDepartmentTree, listDepartment } from '@/services/department';
import { useEffect, useState } from 'react';

export const useDepartmentModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getDepartments = async (params?: Record<string, any>) => {
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
    getDepartments({});
  }, []);
  return {
    data,
    loading,
    reload: getDepartments,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  console.log('open', open);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getDepartments = async () => {
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
      getDepartments();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getDepartments,
  };
};
