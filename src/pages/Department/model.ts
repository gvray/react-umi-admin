import { getDepartmentTree, listDepartment } from '@/services/department';
import { useEffect, useRef, useState } from 'react';

export const useDepartmentModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);

  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const getDepartments = async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      const res = await getDepartmentTree({
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
    getDepartments({
      ...paramsRef.current,
    });
  }, []);
  return {
    data,
    loading,
    reload: getDepartments,
    showSearch,
    setShowSearch,
    paramsRef,
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
