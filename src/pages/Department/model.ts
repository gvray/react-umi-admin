import { ROOT_PARENT_ID } from '@/constants';
import {
  deleteDepartment,
  getDepartment,
  getDepartmentTree,
  listDepartment,
} from '@/services/department';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useDepartmentModel = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 高级搜索参数
  const paramsRef = useRef<Record<string, any>>({});
  const getDepartments = async (params?: Record<string, any>) => {
    return getDepartmentTree(params);
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

  return {
    loading,
    submitting,
    paramsRef,
    getDetail,
    deleteItem,
    getDepartments,
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
        setData([
          {
            departmentId: ROOT_PARENT_ID,
            name: '顶级部门',
            description: '顶级部门',
          },
          ...res.data.items,
        ]);
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
