import { queryPermissionFlat } from '@/services/permission';
import { assignRolePermissions, getRoleById } from '@/services/role';
import { useCallback, useState } from 'react';

export const useAuthPermission = () => {
  const [permissions, setPermissions] = useState<API.PermissionResponseDto[]>(
    [],
  );
  const [selectedRole, setSelectedRole] = useState<API.RoleResponseDto | null>(
    null,
  );

  const fetchPermissionList = useCallback(async () => {
    try {
      const res = await queryPermissionFlat({ mine: true });
      if (res.data?.length) {
        setPermissions(res.data);
      }
    } catch {
      // 全局 errorHandler 已提示
    }
  }, []);

  const fetchRoleDetail = useCallback(async (roleId: string) => {
    try {
      const res = await getRoleById(roleId);
      setSelectedRole(res.data);
      return res.data;
    } catch {
      // 全局 errorHandler 已提示
      setSelectedRole(null);
    }
  }, []);

  const initializeData = useCallback(
    async (roleId?: string) => {
      if (!roleId) return;
      await Promise.all([fetchPermissionList(), fetchRoleDetail(roleId)]);
    },
    [fetchPermissionList, fetchRoleDetail],
  );

  const submitRolePermissions = useCallback(
    async (values: { roleId: string; permissionIds: string[] }) => {
      await assignRolePermissions(values.roleId, {
        permissionIds: values.permissionIds,
      });
      if (values.roleId) {
        await fetchRoleDetail(values.roleId);
      }
      return true;
    },
    [fetchRoleDetail],
  );

  return {
    permissions,
    selectedRole,
    fetchPermissionList,
    fetchRoleDetail,
    initializeData,
    submitRolePermissions,
  };
};
