import { request } from 'umi';

// 资源数据类型定义
export interface Resource {
  id: number;
  name: string;
  type: string;
  url?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tags?: string[];
  size?: number;
  mimeType?: string;
}

export interface ResourceListParams {
  current?: number;
  pageSize?: number;
  name?: string;
  type?: string;
  status?: 'active' | 'inactive';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface ResourceCreateParams {
  name: string;
  type: string;
  url?: string;
  description?: string;
  status?: 'active' | 'inactive';
  tags?: string[];
}

export interface ResourceUpdateParams extends Partial<ResourceCreateParams> {
  id: number;
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
  return request('/resources/tree', {
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
  return request('/resources/menus', {
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
  resourceId: number,
  options?: { [key: string]: any },
) {
  return request(`/resources/${resourceId}`, {
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
  return request('/resources', {
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
  const { id, ...rest } = values;
  return request(`/resources/${id}`, {
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
  resourceId: number,
  options?: { [key: string]: any },
) {
  return request(`/resources/${resourceId}`, {
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
  return request('/resources/batch-delete', {
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

  return request('/resources/upload', {
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
  return request(`/resources/${resourceId}/status`, {
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
  return request('/resources/stats', {
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
  return request('/resources/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}
