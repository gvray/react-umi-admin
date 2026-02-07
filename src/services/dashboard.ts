import { request } from '@gvray/request';

/** 获取仪表盘概览数据 */
export function getDashboardOverview() {
  return request<API.Response<Record<string, unknown>>>('/dashboard/overview', {
    method: 'GET',
  });
}

/** 获取角色分布统计 */
export function getRoleDistribution() {
  return request<API.Response<Record<string, unknown>>>(
    '/dashboard/role-distribution',
    {
      method: 'GET',
    },
  );
}

/** 获取登录趋势数据 */
export function getLoginTrend() {
  return request<API.Response<Record<string, unknown>>>(
    '/dashboard/login-trend',
    {
      method: 'GET',
    },
  );
}
