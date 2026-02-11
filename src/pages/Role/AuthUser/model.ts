import { assignRoleUsers, getRoleById } from '@/services/role';
import { queryUserList } from '@/services/user';
import { useCallback, useState } from 'react';

export const useAuthUser = (roleId?: string) => {
  const [users, setUsers] = useState<API.UserResponseDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<API.RoleResponseDto | null>(
    null,
  );

  const fetchUserList = useCallback(async () => {
    const { data } = await queryUserList();
    if (data?.items) {
      setUsers(data.items);
    }
  }, []);

  const fetchRoleDetail = useCallback(async (roleId: string) => {
    const res = await getRoleById(roleId);
    setSelectedRole(res.data);
    return res.data;
  }, []);

  const initializeData = useCallback(
    async (roleId?: string) => {
      if (!roleId) return;
      await Promise.all([fetchUserList(), fetchRoleDetail(roleId)]);
    },
    [fetchUserList, fetchRoleDetail],
  );

  const submitRoleUsers = useCallback(
    async (values: { userIds: string[] }) => {
      if (!roleId) return false;
      await assignRoleUsers(roleId, { userIds: values.userIds });
      await fetchRoleDetail(roleId);
      return true;
    },
    [roleId, fetchRoleDetail],
  );

  return {
    users,
    selectedRole,
    fetchUserList,
    fetchRoleDetail,
    initializeData,
    submitRoleUsers,
  };
};
