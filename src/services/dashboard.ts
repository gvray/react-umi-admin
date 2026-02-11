import { request } from '@gvray/request';

/** 查询仪表盘概览数据 */
export function queryDashboardOverview() {
  return request<API.Response<Record<string, unknown>>>('/dashboard/overview', {
    method: 'GET',
  });
}

/** 查询角色分布统计 */
export function queryRoleDistribution() {
  return request<API.Response<Record<string, unknown>>>(
    '/dashboard/role-distribution',
    { method: 'GET' },
  );
}

/** 查询登录趋势数据 */
export function queryLoginTrend() {
  return request<API.Response<Record<string, unknown>>>(
    '/dashboard/login-trend',
    { method: 'GET' },
  );
}
