import { queryRoleOptions } from '@/services/role';
import { assignUserRoles, getUserById } from '@/services/user';
import { useCallback, useState } from 'react';

export const useAuthRole = (userId?: string) => {
  const [roles, setRoles] = useState<API.RoleResponseDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<API.UserResponseDto | null>(
    null,
  );

  const fetchRoleList = useCallback(async () => {
    try {
      const res = await queryRoleOptions();
      if (res.data) {
        setRoles(res.data);
      }
    } catch {
      // 全局 errorHandler 已提示
    }
  }, []);

  const fetchUserDetail = useCallback(async (userId: string) => {
    try {
      const res = await getUserById(userId);
      setSelectedUser(res.data);
      return res.data;
    } catch {
      // 全局 errorHandler 已提示
      setSelectedUser(null);
    }
  }, []);

  const initializeData = useCallback(
    async (userId?: string) => {
      if (!userId) return;
      await Promise.all([fetchRoleList(), fetchUserDetail(userId)]);
    },
    [fetchRoleList, fetchUserDetail],
  );

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
