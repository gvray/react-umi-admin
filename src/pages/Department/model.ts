import { ROOT_PARENT_ID } from '@/constants';
import {
  deleteDepartment,
  getDepartmentById,
  queryDepartmentList,
  queryDepartmentTree,
} from '@/services/department';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useDepartmentModel = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const paramsRef = useRef<Record<string, unknown>>({});
  const getDepartments = async (params?: API.DepartmentsGetTreeParams) => {
    return queryDepartmentTree(params);
  };
  const getDetail = useCallback(async (departmentId: string) => {
    setLoading(true);
    try {
      const { data } = await getDepartmentById(departmentId);
      return data;
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
  const [data, setData] = useState<API.DepartmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const getDepartments = async () => {
    try {
      setLoading(true);
      const res = await queryDepartmentList();
      if (res.data?.items?.length) {
        setData([
          {
            departmentId: ROOT_PARENT_ID,
            name: '顶级部门',
            description: '顶级部门',
          } as API.DepartmentResponseDto,
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
