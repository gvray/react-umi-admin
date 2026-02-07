import { request } from '@gvray/request';

/** 获取登录日志列表 */
export function listLoginLog(params?: API.LoginLogsFindAllParams) {
  return request<API.Response<API.PaginatedResponse<API.LoginLogResponseDto>>>(
    '/system/login-logs',
    {
      method: 'GET',
      params,
    },
  );
}

/** 获取登录日志统计 */
export function getLoginLogStats(params?: API.LoginLogsGetStatsParams) {
  return request<API.Response<Record<string, unknown>>>(
    '/system/login-logs/stats',
    {
      method: 'GET',
      params,
    },
  );
}

/** 批量删除登录日志 */
export function batchDeleteLoginLogs(data: API.BatchDeleteLoginLogsDto) {
  return request<API.Response<void>>('/system/login-logs/batch-delete', {
    method: 'POST',
    data,
  });
}

/** 清理登录日志 */
export function clearLoginLog(data?: API.CleanLoginLogsDto) {
  return request<API.Response<void>>('/system/login-logs/clear', {
    method: 'DELETE',
    data,
  });
}
