import { request } from '@gvray/request';

/** 获取权限列表 */
export function queryPermissionList(params?: API.PermissionsFindAllParams) {
  return request<
    API.Response<API.PaginatedResponse<API.PermissionResponseDto>>
  >('/system/permissions', {
    method: 'GET',
    params,
  });
}

/** 获取权限树 */
export function queryPermissionTree(params?: API.PermissionsGetTreeParams) {
  return request<API.Response<API.PermissionResponseDto[]>>(
    '/system/permissions/tree',
    {
      method: 'GET',
      params,
    },
  );
}

/** 获取权限详情 */
export function getPermissionById(permissionId: string) {
  return request<API.Response<API.PermissionResponseDto>>(
    `/system/permissions/${permissionId}`,
    {
      method: 'GET',
    },
  );
}

/** 创建权限 */
export function createPermission(data: API.CreatePermissionDto) {
  return request<API.Response<API.PermissionResponseDto>>(
    '/system/permissions',
    {
      method: 'POST',
      data,
    },
  );
}

/** 更新权限 */
export function updatePermission(
  permissionId: string,
  data: API.UpdatePermissionDto,
) {
  return request<API.Response<API.PermissionResponseDto>>(
    `/system/permissions/${permissionId}`,
    {
      method: 'PATCH',
      data,
    },
  );
}

/** 删除权限 */
export function deletePermission(permissionId: string) {
  return request<API.Response<void>>(`/system/permissions/${permissionId}`, {
    method: 'DELETE',
  });
}

/** 批量删除权限 */
export function batchDeletePermissions(data: API.BatchDeletePermissionsDto) {
  return request<API.Response<void>>('/system/permissions/batch-delete', {
    method: 'POST',
    data,
  });
}
