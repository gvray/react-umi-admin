import { assignRoleUsers, getRole } from '@/services/role';
import { listUser } from '@/services/user';
import { logger } from '@/utils';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useAuthUser = (roleId?: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await listUser();
      if (data && data.items) {
        setUsers(data.items);
      }
    } catch (error) {
      //   message.error('获取用户列表失败');
    }
  }, []);

  // 获取角色详情
  const fetchRoleDetail = useCallback(async (roleId: string) => {
    try {
      setLoading(true);
      const res = await getRole(roleId);
      setSelectedRole(res.data);
      return res.data;
    } catch (error) {
      //   message.error('获取角色详情失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化数据
  const initializeData = useCallback(
    async (roleId?: string) => {
      if (!roleId) return;

      await Promise.all([fetchUsers(), fetchRoleDetail(roleId)]);
    },
    [fetchUsers, fetchRoleDetail],
  );

  // 提交用户分配
  const submitUserAssignment = useCallback(
    async (values: any) => {
      if (!roleId) return;
      try {
        setSubmitting(true);
        await assignRoleUsers(roleId, values.userIds);
        message.success('用户分配成功');

        // 刷新角色数据
        await fetchRoleDetail(roleId);

        return true;
      } catch (error) {
        logger.error(`分配角色用户失败：${error}`);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoleDetail],
  );

  return {
    // 状态
    users,
    selectedRole,
    loading,
    submitting,

    // 方法
    fetchUsers,
    fetchRoleDetail,
    initializeData,
    submitUserAssignment,
  };
};
