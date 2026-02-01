import {
  deleteDepartment,
  getDepartment,
  getDepartmentTree,
  listDepartment,
} from '@/services/department';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useDepartmentModel = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
  const getDetail = useCallback(async (departmentId: string) => {
    setLoading(true);
    try {
      const res: any = await getDepartment(departmentId);
      return res.data ?? res;
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteItem = useCallback(async (departmentId: string) => {
    setSubmitting(true);
    try {
      await deleteDepartment(departmentId);
    } finally {
      setSubmitting(false);
    }
  }, []);
  useEffect(() => {
    getDepartments({
      ...paramsRef.current,
    });
  }, []);
  const getTreeList = useCallback(async (params?: any) => {
    return getDepartmentTree({
      ...paramsRef.current,
      ...params,
    });
  }, []);
  return {
    data,
    loading,
    submitting,
    reload: getDepartments,
    showSearch,
    setShowSearch,
    paramsRef,
    getDetail,
    deleteItem,
    getTreeList,
  };
};

export const useUpdataFormModel = (open: boolean) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getDepartments = async () => {
    try {
      setLoading(true);
      const res = await listDepartment();
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
      getDepartments();
    }
  }, [open]);
  return {
    data,
    loading,
    reload: getDepartments,
  };
};
