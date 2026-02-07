import { request } from '@gvray/request';

// 角色数据类型定义
export interface Role {
  roleId: number;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  permissions?: string[];
  userCount?: number;
}

export interface RoleListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  status?: 'active' | 'inactive';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface RoleCreateParams {
  name: string;
  code: string;
  description?: string;
  status?: 'active' | 'inactive';
  permissions?: string[];
}

export interface RoleUpdateParams extends Partial<RoleCreateParams> {
  roleId: number;
}

// CRUD API 服务函数

/**
 * 获取角色列表
 * @param params 查询参数
 * @param options 请求选项
 */
export async function listRole(
  params?: RoleListParams,
  options?: { [key: string]: any },
) {
  return request('/system/roles', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取单个角色详情
 * @param roleId 角色ID
 * @param options 请求选项
 */
export async function getRole(
  roleId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建新角色
 * @param values 角色数据
 * @param options 请求选项
 */
export async function addRole(
  values: RoleCreateParams,
  options?: { [key: string]: any },
) {
  return request('/system/roles', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * 更新角色
 * @param values 更新数据
 * @param options 请求选项
 */
export async function updateRole(
  values: RoleUpdateParams,
  options?: { [key: string]: any },
) {
  const { roleId, ...rest } = values;
  return request(`/system/roles/${roleId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

/**
 * 删除角色
 * @param roleId 角色ID
 * @param options 请求选项
 */
export async function deleteRole(
  roleId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 批量删除角色
 * @param roleIds 角色ID数组
 * @param options 请求选项
 */
export async function batchDeleteRoles(
  roleIds: number[],
  options?: { [key: string]: any },
) {
  return request('/system/roles/batch-delete', {
    method: 'POST',
    data: { ids: roleIds },
    ...(options || {}),
  });
}

/**
 * 更新角色状态
 * @param roleId 角色ID
 * @param status 新状态
 * @param options 请求选项
 */
export async function updateRoleStatus(
  roleId: number,
  status: 'active' | 'inactive',
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}/status`, {
    method: 'PATCH',
    data: { status },
    ...(options || {}),
  });
}

/**
 * 分配角色权限
 * @param roleId 角色ID
 * @param permissions 权限ID数组
 * @param options 请求选项
 */
export async function assignRolePermissions(
  roleId: number,
  permissionIds: string[],
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}/permissions`, {
    method: 'PUT',
    data: { permissionIds },
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
  return request(`/system/roles/${roleId}/permissions`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取角色下的用户列表
 * @param roleId 角色ID
 * @param options 请求选项
 */
export async function getRoleUsers(
  roleId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}/users`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 分配用户
export async function assignRoleUsers(
  roleId: string,
  users: string[],
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}/users`, {
    method: 'Put',
    data: { userIds: users },
    ...(options || {}),
  });
}

// 获取角色的数据权限
export async function getRoleDataScopes(
  roleId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}/data-scope`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 为角色分配数据权限（替换所有数据权限）
export async function assignRoleDataScopes(
  roleId: string,
  data: {
    dataScope: number;
    departments?: string[];
  },
  options?: { [key: string]: any },
) {
  return request(`/system/roles/${roleId}/data-scope`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
