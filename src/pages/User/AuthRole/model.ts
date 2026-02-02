import { listRole } from '@/services/role';
import { getUser, updateUserRole } from '@/services/user';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useAuthRole = (userId?: string) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 获取角色列表
  const fetchRoles = useCallback(async () => {
    try {
      const res = await listRole();
      if (res.data && res.data.items && res.data.items.length > 0) {
        setRoles(res.data.items);
      }
    } catch (error) {}
  }, []);

  // 获取用户详情
  const fetchUserDetail = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const res = await getUser(userId);
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
    async (values: any) => {
      if (!userId) return;
      try {
        setSubmitting(true);
        await updateUserRole(userId, {
          ...values,
        });
        message.success('角色分配成功');

        // 刷新用户数据
        if (values.userId) {
          await fetchUserDetail(values.userId);
        }

        return true;
      } catch (error) {
        // message.error('角色分配失败');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchUserDetail],
  );

  return {
    // 状态
    roles,
    selectedUser,
    loading,
    submitting,

    // 方法
    fetchRoles,
    fetchUserDetail,
    initializeData,
    submitRoleAssignment,
  };
};
