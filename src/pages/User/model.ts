import { queryDepartmentList } from '@/services/department';
import { queryPositionList } from '@/services/position';
import { queryRoleList } from '@/services/role';
import { deleteUser, getUserById, queryUserList } from '@/services/user';
import { useCallback, useEffect, useState } from 'react';

const useUpdateForm = (open: boolean) => {
  const [roleList, setRoleList] = useState<API.RoleResponseDto[]>([]);
  const [positionList, setPositionList] = useState<API.PositionResponseDto[]>(
    [],
  );
  const [departmentList, setDepartmentList] = useState<
    API.DepartmentResponseDto[]
  >([]);

  const getDepartments = async () => {
    try {
      const res = await queryDepartmentList();
      if (res.data?.items) {
        setDepartmentList(res.data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRoles = async () => {
    try {
      const res = await queryRoleList();
      if (res.data?.items) {
        setRoleList(res.data.items);
      }
    } catch (error) {}
  };

  const getPositions = async () => {
    try {
      const res = await queryPositionList();
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
  const getList = useCallback(async (params?: API.UsersFindAllParams) => {
    return queryUserList(params);
  }, []);
  const getDetail = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const { data } = await getUserById(userId);
      return data;
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
