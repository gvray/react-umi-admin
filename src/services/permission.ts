import { request } from '@/utils/request';

export type PermissionType = 'MENU' | 'BUTTON' | 'API';

export interface MenuMeta {
  path?: string;
  icon?: string;
  hidden?: boolean;
  component?: string;
  sort?: number;
}

export interface PermissionItem {
  id?: number;
  permissionId: string;
  name: string;
  code: string;
  type: PermissionType;
  action: string;
  description?: string;
  parentPermissionId?: string | null;
  children?: PermissionItem[];
  menuMeta?: MenuMeta | null;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string | null;
  updatedById?: string | null;
}

export interface PermissionListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  type?: PermissionType;
  action?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface PermissionCreateParams {
  name: string;
  code: string;
  type: PermissionType;
  action: string;
  description?: string;
  parentPermissionId?: string | null;
  menuMeta?: MenuMeta;
}

export interface PermissionUpdateParams
  extends Partial<PermissionCreateParams> {
  permissionId: string;
}

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
