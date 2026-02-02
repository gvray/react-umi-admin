import { request } from 'umi';

// 资源数据类型定义
export interface Resource {
  resourceId: number;
  name: string;
  type: 'directory' | 'menu';
  path?: string;
  icon?: string;
  component?: string;
  parentId?: number;
  parentName?: string;
  level: number;
  sort: number;
  description?: string;
  status: 'active' | 'inactive';
  hidden?: boolean;
  children?: Resource[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}
export interface ResourceMeta {
  resourceId: number;
  name: string;
  type: 'directory' | 'menu';
  parentId: number | null;
  children?: ResourceMeta[];
  path?: string;
  icon?: string;
  component?: string;
  sort?: number;
  level?: number;
  [key: string]: any;
}

export interface ResourceListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  type?: 'directory' | 'menu';
  parentId?: number;
  level?: number;
  status?: 'active' | 'inactive';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface ResourceCreateParams {
  name: string;
  type: 'directory' | 'menu';
  path?: string;
  icon?: string;
  component?: string;
  parentId?: number;
  sort?: number;
  description?: string;
  status?: 'active' | 'inactive';
  hidden?: boolean;
}

export interface ResourceUpdateParams extends Partial<ResourceCreateParams> {
  resourceId: number;
}

// CRUD API 服务函数

/**
 * 获取资源列表
 * @param params 查询参数
 * @param options 请求选项
 */
export async function listResources(
  params?: ResourceListParams,
  options?: { [key: string]: any },
) {
  return request('/system/resources', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getResourceTree(
  params?: ResourceListParams,
  options?: { [key: string]: any },
) {
  return request('/system/resources/tree', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取菜单列表
 * @param params 查询参数
 * @param options 请求选项
 */
export async function getMenus(
  params?: ResourceListParams,
  options?: { [key: string]: any },
) {
  return request('/system/resources/menus', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取单个资源详情
 * @param resourceId 资源ID
 * @param options 请求选项
 */
export async function getResource(
  resourceId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/resources/${resourceId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建新资源
 * @param values 资源数据
 * @param options 请求选项
 */
export async function createResource(
  values: ResourceCreateParams,
  options?: { [key: string]: any },
) {
  return request('/system/resources', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * 更新资源
 * @param values 更新数据
 * @param options 请求选项
 */
export async function updateResource(
  values: ResourceUpdateParams,
  options?: { [key: string]: any },
) {
  const { resourceId, ...rest } = values;
  return request(`/system/resources/${resourceId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

/**
 * 删除资源
 * @param resourceId 资源ID
 * @param options 请求选项
 */
export async function deleteResource(
  resourceId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/resources/${resourceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 批量删除资源
 * @param resourceIds 资源ID数组
 * @param options 请求选项
 */
export async function batchDeleteResources(
  resourceIds: number[],
  options?: { [key: string]: any },
) {
  return request('/system/resources/batch-delete', {
    method: 'POST',
    data: { ids: resourceIds },
    ...(options || {}),
  });
}

/**
 * 上传资源文件
 * @param file 文件对象
 * @param options 请求选项
 */
export async function uploadResource(
  file: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/system/resources/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}

/**
 * 更新资源状态
 * @param resourceId 资源ID
 * @param status 新状态
 * @param options 请求选项
 */
export async function updateResourceStatus(
  resourceId: number,
  status: 'active' | 'inactive',
  options?: { [key: string]: any },
) {
  return request(`/system/resources/${resourceId}/status`, {
    method: 'PATCH',
    data: { status },
    ...(options || {}),
  });
}

/**
 * 获取资源统计信息
 * @param options 请求选项
 */
export async function getResourceStats(options?: { [key: string]: any }) {
  return request('/system/resources/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 搜索资源
 * @param keyword 搜索关键词
 * @param options 请求选项
 */
export async function searchResources(
  keyword: string,
  options?: { [key: string]: any },
) {
  return request('/system/resources/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}
