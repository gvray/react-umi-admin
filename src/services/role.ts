// 角色管理

import { request } from 'umi';

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
  current?: number;
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
  return request('/roles', {
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
  roleId: number,
  options?: { [key: string]: any },
) {
  return request(`/roles/${roleId}`, {
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
  return request('/roles', {
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
  return request(`/roles/${roleId}`, {
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
  roleId: number,
  options?: { [key: string]: any },
) {
  return request(`/roles/${roleId}`, {
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
  return request('/roles/batch-delete', {
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
  return request(`/roles/${roleId}/status`, {
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
  permissions: string[],
  options?: { [key: string]: any },
) {
  return request(`/roles/${roleId}/permissions`, {
    method: 'PUT',
    data: { permissions },
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
  return request(`/roles/${roleId}/permissions`, {
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
  return request(`/roles/${roleId}/users`, {
    method: 'GET',
    ...(options || {}),
  });
}
