import { request } from '@gvray/request';

/** 获取缓存健康状态 */
export function queryCacheHealth() {
  return request<API.Response<boolean>>('/system/monitors/cache-health', {
    method: 'GET',
  });
}

/** 获取缓存统计信息 */
export function queryCacheStats() {
  return request<API.Response<API.CacheStatsDto>>(
    '/system/monitors/cache-stats',
    {
      method: 'GET',
    },
  );
}

/** 获取缓存键列表 */
export function queryCacheKeys(params?: API.MonitorGetCacheKeysParams) {
  return request<API.Response<API.CacheKeyListResponseDto>>(
    '/system/monitors/cache-keys',
    {
      method: 'GET',
      params,
    },
  );
}

/** 清理缓存 */
export function clearCache(params?: API.MonitorClearCacheParams) {
  return request<API.Response<API.CacheClearResultDto>>(
    '/system/monitors/cache-clear',
    {
      method: 'DELETE',
      params,
    },
  );
}
