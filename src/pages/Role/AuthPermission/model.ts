import { listPermission } from '@/services/permission';
import { assignRolePermissions, getRole } from '@/services/role';
import { logger } from '@/utils';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export const useAuthPermission = () => {
  const [permissions, setPermissions] = useState<API.PermissionResponseDto[]>(
    [],
  );
  const [selectedRole, setSelectedRole] = useState<API.RoleResponseDto | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await listPermission();
      if (res.data?.items?.length) {
        setPermissions(res.data.items);
      }
    } catch (error) {
      message.error('获取权限列表失败');
    }
  }, []);

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

  const initializeData = useCallback(
    async (roleId?: string) => {
      if (!roleId) return;
      await Promise.all([fetchPermissions(), fetchRoleDetail(roleId)]);
    },
    [fetchPermissions, fetchRoleDetail],
  );

  const submitPermissionAssignment = useCallback(
    async (values: { roleId: string; permissionIds: string[] }) => {
      try {
        setSubmitting(true);
        await assignRolePermissions(values.roleId, {
          permissionIds: values.permissionIds,
        });
        message.success('权限分配成功');
        if (values.roleId) {
          await fetchRoleDetail(values.roleId);
        }
        return true;
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`权限分配失败：${msg}`);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchRoleDetail],
  );

  return {
    permissions,
    selectedRole,
    loading,
    submitting,
    fetchPermissions,
    fetchRoleDetail,
    initializeData,
    submitPermissionAssignment,
  };
};
