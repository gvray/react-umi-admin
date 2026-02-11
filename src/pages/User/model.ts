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

  const fetchDepartmentList = async () => {
    try {
      const res = await queryDepartmentList();
      if (res.data?.items) {
        setDepartmentList(res.data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoleList = async () => {
    try {
      const res = await queryRoleList();
      if (res.data?.items) {
        setRoleList(res.data.items);
      }
    } catch (error) {}
  };

  const fetchPositionList = async () => {
    try {
      const res = await queryPositionList();
      if (res.data?.items) {
        setPositionList(res.data.items);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (open) {
      fetchRoleList();
      fetchDepartmentList();
      fetchPositionList();
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
  const fetchUserList = useCallback(async (params?: API.UsersFindAllParams) => {
    return queryUserList(params);
  }, []);
  const fetchUserDetail = useCallback(async (userId: string) => {
    const { data } = await getUserById(userId);
    return data;
  }, []);
  const removeUser = useCallback(async (userId: string) => {
    await deleteUser(userId);
  }, []);
  return {
    fetchUserList,
    fetchUserDetail,
    removeUser,
  };
};
