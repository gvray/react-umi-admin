import { assignRoleUsers, getRole } from '@/services/role';
import { listUser } from '@/services/user';
import { logger } from '@/utils';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useAuthUser = (roleId?: string) => {
  const [users, setUsers] = useState<API.UserResponseDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<API.RoleResponseDto | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await listUser();
      if (data?.items) {
        setUsers(data.items);
      }
    } catch (error) {}
  }, []);

  const fetchRoleDetail = useCallback(async (roleId: string) => {
    try {
      setLoading(true);
      const res = await getRole(roleId);
      setSelectedRole(res.data);
      return res.data;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeData = useCallback(
    async (roleId?: string) => {
      if (!roleId) return;
      await Promise.all([fetchUsers(), fetchRoleDetail(roleId)]);
    },
    [fetchUsers, fetchRoleDetail],
  );

  const submitUserAssignment = useCallback(
    async (values: { userIds: string[] }) => {
      if (!roleId) return;
      try {
        setSubmitting(true);
        await assignRoleUsers(roleId, { userIds: values.userIds });
        message.success('用户分配成功');
        await fetchRoleDetail(roleId);
        return true;
      } catch (error) {
        logger.error(`分配角色用户失败：${error}`);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [roleId, fetchRoleDetail],
  );

  return {
    users,
    selectedRole,
    loading,
    submitting,
    fetchUsers,
    fetchRoleDetail,
    initializeData,
    submitUserAssignment,
  };
};
