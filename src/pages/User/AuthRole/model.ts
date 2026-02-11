import { queryRoleList } from '@/services/role';
import { assignUserRoles, getUserById } from '@/services/user';
import { useCallback, useState } from 'react';

export const useAuthRole = (userId?: string) => {
  const [roles, setRoles] = useState<API.RoleResponseDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<API.UserResponseDto | null>(
    null,
  );

  // 获取角色列表
  const fetchRoleList = useCallback(async () => {
    const res = await queryRoleList();
    if (res.data?.items?.length) {
      setRoles(res.data.items);
    }
  }, []);

  // 获取用户详情
  const fetchUserDetail = useCallback(async (userId: string) => {
    const res = await getUserById(userId);
    setSelectedUser(res.data);
    return res.data;
  }, []);

  // 初始化数据
  const initializeData = useCallback(
    async (userId?: string) => {
      if (!userId) return;
      await Promise.all([fetchRoleList(), fetchUserDetail(userId)]);
    },
    [fetchRoleList, fetchUserDetail],
  );

  // 提交角色分配
  const submitUserRoles = useCallback(
    async (values: API.AssignRolesDto) => {
      if (!userId) return false;
      await assignUserRoles(userId, values);
      await fetchUserDetail(userId);
      return true;
    },
    [userId, fetchUserDetail],
  );

  return {
    roles,
    selectedUser,
    fetchRoleList,
    fetchUserDetail,
    initializeData,
    submitUserRoles,
  };
};
