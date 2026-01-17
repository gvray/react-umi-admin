import { request } from '@/utils/request';

export interface LoginLogRecord {
  id: string;
  username: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  status: 'success' | 'failed';
  message: string;
  loginTime: string;
}

export interface LoginLogQueryParams {
  current?: number;
  pageSize?: number;
  username?: string;
  ip?: string;
  status?: 'success' | 'failed';
}

export interface LoginLogListResponse {
  success: boolean;
  data: LoginLogRecord[];
  total: number;
  current: number;
  pageSize: number;
}

/**
 * 获取登录日志列表
 */
export async function getLoginLogList(
  params?: LoginLogQueryParams,
): Promise<LoginLogListResponse> {
  return request('/api/system/log/login', {
    method: 'GET',
    params,
  }) as Promise<LoginLogListResponse>;
}

/**
 * 导出登录日志
 */
export async function exportLoginLog(params?: LoginLogQueryParams) {
  return request('/api/system/log/login/export', {
    method: 'POST',
    data: params,
  });
}

/**
 * 清理登录日志
 */
export async function clearLoginLog() {
  return request('/api/system/log/login/clear', {
    method: 'DELETE',
  });
}
