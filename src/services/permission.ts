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

/** 获取权限平铺列表（前端组装权限树）
 * @param params.mine true 表示只返回当前用户拥有的权限
 */
export function queryPermissionFlat(params?: { mine?: boolean }) {
  return request<API.Response<API.PermissionResponseDto[]>>(
    '/system/permissions/flat',
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

/** 扫描并同步权限 */
export function scanPermissions() {
  return request<API.Response<void>>('/system/permissions/scan', {
    method: 'POST',
  });
}
