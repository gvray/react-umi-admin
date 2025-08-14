import { listPermission } from '@/services/permission';
import { assignRolePermissions, getRole } from '@/services/role';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useAuthPermission = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 获取权限列表
  const fetchPermissions = useCallback(async () => {
    try {
      const res = await listPermission();
      setPermissions(res.data);
    } catch (error) {
      message.error('获取权限列表失败');
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
      message.error('获取角色详情失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化数据
  const initializeData = useCallback(
    async (roleId?: string) => {
      if (!roleId) return;

      await Promise.all([fetchPermissions(), fetchRoleDetail(roleId)]);
    },
    [fetchPermissions, fetchRoleDetail],
  );

  // 提交权限分配
  const submitPermissionAssignment = useCallback(
    async (values: any) => {
      try {
        setSubmitting(true);
        await assignRolePermissions(values.roleId, values.permissionIds);
        message.success('权限分配成功');

        // 刷新角色数据
        if (values.roleId) {
          await fetchRoleDetail(values.roleId);
        }

        return true;
      } catch (error) {
        message.error('权限分配失败');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoleDetail],
  );

  return {
    // 状态
    permissions,
    selectedRole,
    loading,
    submitting,

    // 方法
    fetchPermissions,
    fetchRoleDetail,
    initializeData,
    submitPermissionAssignment,
  };
};
