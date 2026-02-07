import { request } from '@gvray/request';

/** 获取资源列表 */
export function listResources(params?: Record<string, unknown>) {
  return request<API.Response<Record<string, unknown>[]>>('/system/resources', {
    method: 'GET',
    params,
  });
}

/** 获取资源树 */
export function getResourceTree(params?: Record<string, unknown>) {
  return request<API.Response<Record<string, unknown>[]>>(
    '/system/resources/tree',
    {
      method: 'GET',
      params,
    },
  );
}

/** 获取菜单列表 */
export function getMenus(params?: Record<string, unknown>) {
  return request<API.Response<Record<string, unknown>[]>>(
    '/system/resources/menus',
    {
      method: 'GET',
      params,
    },
  );
}

/** 获取资源详情 */
export function getResource(resourceId: string) {
  return request<API.Response<Record<string, unknown>>>(
    `/system/resources/${resourceId}`,
    {
      method: 'GET',
    },
  );
}

/** 创建资源 */
export function createResource(data: Record<string, unknown>) {
  return request<API.Response<Record<string, unknown>>>('/system/resources', {
    method: 'POST',
    data,
  });
}

/** 更新资源 */
export function updateResource(
  resourceId: string,
  data: Record<string, unknown>,
) {
  return request<API.Response<Record<string, unknown>>>(
    `/system/resources/${resourceId}`,
    {
      method: 'PATCH',
      data,
    },
  );
}

/** 删除资源 */
export function deleteResource(resourceId: string) {
  return request<API.Response<void>>(`/system/resources/${resourceId}`, {
    method: 'DELETE',
  });
}

/** 批量删除资源 */
export function batchDeleteResources(data: { ids: string[] }) {
  return request<API.Response<void>>('/system/resources/batch-delete', {
    method: 'POST',
    data,
  });
}
