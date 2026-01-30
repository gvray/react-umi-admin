import { request } from '@/utils/request';

export interface LoginLogRecord {
  id: string;
  username: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  status: number;
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
  return request('/system/login-logs', {
    method: 'GET',
    params,
  }) as Promise<LoginLogListResponse>;
}

/**
 * 导出登录日志
 */
export async function exportLoginLog(params?: LoginLogQueryParams) {
  return request('/system/login-logs/export', {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除选中的登录日志
 */
export async function deleteLoginLog(ids: string[]) {
  return request('/system/login-logs/batch-delete', {
    method: 'POST',
    data: { ids },
  });
}

/**
 * 清理登录日志
 */
export async function clearLoginLog() {
  return request('/system/login-logs/clear', {
    method: 'DELETE',
  });
}
