// 权限管理

import { request } from 'umi';

// 权限数据类型定义
export interface Permission {
  permissionId: number;
  name: string;
  code: string;
  type:
    | 'view'
    | 'create'
    | 'update'
    | 'delete'
    | 'export'
    | 'import'
    | 'approve'
    | 'reject';
  description?: string;
  resourceId: number; // 关联的菜单资源ID
  resourceName?: string; // 关联的菜单资源名称
  sort: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface PermissionListParams {
  current?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  type?:
    | 'view'
    | 'create'
    | 'update'
    | 'delete'
    | 'export'
    | 'import'
    | 'approve'
    | 'reject';
  resourceId?: number;
  status?: 'active' | 'inactive';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface PermissionCreateParams {
  name: string;
  code: string;
  type:
    | 'view'
    | 'create'
    | 'update'
    | 'delete'
    | 'export'
    | 'import'
    | 'approve'
    | 'reject';
  description?: string;
  resourceId: number;
  sort?: number;
  status?: 'active' | 'inactive';
}

export interface PermissionUpdateParams
  extends Partial<PermissionCreateParams> {
  permissionId: number;
}

// CRUD API 服务函数

/**
 * 获取权限列表
 * @param params 查询参数
 * @param options 请求选项
 */
export async function listPermission(
  params?: PermissionListParams,
  options?: { [key: string]: any },
) {
  return request('/system/permissions', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取权限树
 * @param options 请求选项
 */
export async function getPermissionTree(
  params?: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request('/system/permissions/tree', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取单个权限详情
 * @param permissionId 权限ID
 * @param options 请求选项
 */
export async function getPermission(
  permissionId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/permissions/${permissionId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建新权限
 * @param values 权限数据
 * @param options 请求选项
 */
export async function createPermission(
  values: PermissionCreateParams,
  options?: { [key: string]: any },
) {
  return request('/system/permissions', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * 更新权限
 * @param values 更新数据
 * @param options 请求选项
 */
export async function updatePermission(
  values: PermissionUpdateParams,
  options?: { [key: string]: any },
) {
  const { permissionId, ...rest } = values;
  return request(`/system/permissions/${permissionId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

/**
 * 删除权限
 * @param permissionId 权限ID
 * @param options 请求选项
 */
export async function deletePermission(
  permissionId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/permissions/${permissionId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 批量删除权限
 * @param permissionIds 权限ID数组
 * @param options 请求选项
 */
export async function batchDeletePermissions(
  permissionIds: number[],
  options?: { [key: string]: any },
) {
  return request('/system/permissions/batch-delete', {
    method: 'POST',
    data: { ids: permissionIds },
    ...(options || {}),
  });
}

/**
 * 更新权限状态
 * @param permissionId 权限ID
 * @param status 新状态
 * @param options 请求选项
 */
export async function updatePermissionStatus(
  permissionId: number,
  status: 'active' | 'inactive',
  options?: { [key: string]: any },
) {
  return request(`/system/permissions/${permissionId}/status`, {
    method: 'PATCH',
    data: { status },
    ...(options || {}),
  });
}

/**
 * 按资源获取权限列表
 * @param resourceId 资源ID
 * @param options 请求选项
 */
export async function getPermissionsByResource(
  resourceId: number,
  options?: { [key: string]: any },
) {
  return request(`/resources/${resourceId}/system/permissions`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取权限分组（按资源分组）
 * @param options 请求选项
 */
export async function getPermissionGroups(options?: { [key: string]: any }) {
  return request('/system/permissions/groups', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 移动权限到新的资源
 * @param permissionId 权限ID
 * @param resourceId 新资源ID
 * @param options 请求选项
 */
export async function movePermissionToResource(
  permissionId: number,
  resourceId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/permissions/${permissionId}/move`, {
    method: 'PATCH',
    data: { resourceId },
    ...(options || {}),
  });
}

/**
 * 更新权限排序
 * @param permissionId 权限ID
 * @param sort 排序值
 * @param options 请求选项
 */
export async function updatePermissionSort(
  permissionId: number,
  sort: number,
  options?: { [key: string]: any },
) {
  return request(`/system/permissions/${permissionId}/sort`, {
    method: 'PATCH',
    data: { sort },
    ...(options || {}),
  });
}

/**
 * 获取用户权限
 * @param userId 用户ID
 * @param options 请求选项
 */
export async function getUserPermissions(
  userId: number,
  options?: { [key: string]: any },
) {
  return request(`/users/${userId}/system/permissions`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取角色权限
 * @param roleId 角色ID
 * @param options 请求选项
 */
export async function getRolePermissions(
  roleId: number,
  options?: { [key: string]: any },
) {
  return request(`/roles/${roleId}/system/permissions`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 分配角色权限
 * @param roleId 角色ID
 * @param permissionIds 权限ID数组
 * @param options 请求选项
 */
export async function assignRolePermissions(
  roleId: number,
  permissionIds: number[],
  options?: { [key: string]: any },
) {
  return request(`/roles/${roleId}/system/permissions`, {
    method: 'PUT',
    data: { permissionIds },
    ...(options || {}),
  });
}

/**
 * 检查权限
 * @param permissionCode 权限码
 * @param options 请求选项
 */
export async function checkPermission(
  permissionCode: string,
  options?: { [key: string]: any },
) {
  return request('/system/permissions/check', {
    method: 'POST',
    data: { permissionCode },
    ...(options || {}),
  });
}

/**
 * 批量检查权限
 * @param permissionCodes 权限码数组
 * @param options 请求选项
 */
export async function checkPermissions(
  permissionCodes: string[],
  options?: { [key: string]: any },
) {
  return request('/system/permissions/batch-check', {
    method: 'POST',
    data: { permissionCodes },
    ...(options || {}),
  });
}

/**
 * 获取权限统计信息
 * @param options 请求选项
 */
export async function getPermissionStats(options?: { [key: string]: any }) {
  return request('/system/permissions/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 搜索权限
 * @param keyword 搜索关键词
 * @param options 请求选项
 */
export async function searchPermissions(
  keyword: string,
  options?: { [key: string]: any },
) {
  return request('/system/permissions/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}

/**
 * 批量创建资源的标准权限
 * @param resourceId 资源ID
 * @param permissionTypes 权限类型数组
 * @param options 请求选项
 */
export async function createStandardPermissions(
  resourceId: number,
  permissionTypes: ('view' | 'create' | 'update' | 'delete')[],
  options?: { [key: string]: any },
) {
  return request('/system/permissions/batch-create', {
    method: 'POST',
    data: { resourceId, permissionTypes },
    ...(options || {}),
  });
}
