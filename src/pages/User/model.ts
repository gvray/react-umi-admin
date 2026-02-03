import { listDepartment } from '@/services/department';
import { listPosition } from '@/services/position';
import { listRole } from '@/services/role';
import { deleteUser, getUser, listUser } from '@/services/user';
import { useCallback, useEffect, useState } from 'react';
interface ListResp<T> {
  data?: {
    items?: T[];
  };
}

const useUpdateForm = (open: boolean) => {
  const [roleList, setRoleList] = useState<any[]>([]);
  const [positionList, setPositionList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);

  const getDepartments = async () => {
    try {
      const res = await listDepartment();
      if (res.data && res.data.items) {
        setDepartmentList(res.data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRoles = async () => {
    try {
      const res = await listRole();
      if (res.data) {
        setRoleList(res.data);
      }
    } catch (error) {}
  };

  const getPositions = async () => {
    try {
      const res = (await listPosition()) as ListResp<any>;
      if (res.data?.items) {
        setPositionList(res.data.items);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (open) {
      getRoles();
      getDepartments();
      getPositions();
    }
  }, [open]);

  return {
    roleList,
    departmentList,
    positionList,
  };
};
export default useUpdateForm;

export const useUserModel = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const getList = useCallback(async (params?: any) => {
    return listUser(params);
  }, []);
  const getDetail = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const res = (await getUser(userId)) as any;
      return res?.data ?? res;
    } finally {
      setLoading(false);
    }
  }, []);
  const deleteItem = useCallback(async (userId: string) => {
    setSubmitting(true);
    try {
      await deleteUser(userId);
    } finally {
      setSubmitting(false);
    }
  }, []);
  return {
    loading,
    submitting,
    getList,
    getDetail,
    deleteItem,
  };
};
