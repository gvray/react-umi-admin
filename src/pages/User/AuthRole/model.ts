import { queryRoleList } from '@/services/role';
import { assignUserRoles, getUserById } from '@/services/user';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useAuthRole = (userId?: string) => {
  const [roles, setRoles] = useState<API.RoleResponseDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<API.UserResponseDto | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 获取角色列表
  const fetchRoles = useCallback(async () => {
    try {
      const res = await queryRoleList();
      if (res.data?.items?.length) {
        setRoles(res.data.items);
      }
    } catch (error) {}
  }, []);

  // 获取用户详情
  const fetchUserDetail = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const res = await getUserById(userId);
      setSelectedUser(res.data);
      return res.data;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化数据
  const initializeData = useCallback(
    async (userId?: string) => {
      if (!userId) return;
      await Promise.all([fetchRoles(), fetchUserDetail(userId)]);
    },
    [fetchRoles, fetchUserDetail],
  );

  // 提交角色分配
  const submitRoleAssignment = useCallback(
    async (values: API.AssignRolesDto) => {
      if (!userId) return;
      try {
        setSubmitting(true);
        await assignUserRoles(userId, values);
        message.success('角色分配成功');
        await fetchUserDetail(userId);
        return true;
      } catch (error) {
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [userId, fetchUserDetail],
  );

  return {
    roles,
    selectedUser,
    loading,
    submitting,
    fetchRoles,
    fetchUserDetail,
    initializeData,
    submitRoleAssignment,
  };
};
