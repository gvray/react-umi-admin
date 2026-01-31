import { request } from '@/utils/request';

export interface OperationLogRecord {
  id: string;
  username: string;
  userId?: string;
  module?: string;
  action?: string;
  status: number; // 0/1 或其他业务定义
  path?: string;
  method?: string;
  ip?: string;
  location?: string;
  userAgent?: string;
  message?: string;
  createdAt?: string;
}

export interface OperationLogQueryParams {
  page?: number;
  pageSize?: number;
  username?: string;
  userId?: string;
  module?: string;
  action?: string;
  status?: number;
  path?: string;
  keyword?: string;
  createdAtStart?: string; // ISO 字符串
  createdAtEnd?: string; // ISO 字符串
}

export interface OperationLogListResponse {
  success: boolean;
  data: OperationLogRecord[];
  total: number;
  page: number;
  pageSize: number;
}

/** 分页查询操作日志 */
export async function getOperationLogs(
  params?: OperationLogQueryParams,
): Promise<OperationLogListResponse> {
  return request('/system/operation-logs', {
    method: 'GET',
    params,
  }) as Promise<OperationLogListResponse>;
}

/** 获取操作日志详情 */
export async function getOperationLogDetail(logId: string) {
  return request(`/system/operation-logs/${logId}`, {
    method: 'GET',
  });
}

/** 删除单条操作日志 */
export async function deleteOperationLog(id: number) {
  return request(`/system/operation-logs/${id}`, {
    method: 'DELETE',
  });
}

/** 批量删除操作日志 */
export async function deleteOperationLogs(ids: number[]) {
  return request('/system/operation-logs/batch-delete', {
    method: 'POST',
    data: { ids },
  });
}

/** 清理操作日志（可选按时间） */
export async function cleanOperationLogs(before?: string) {
  return request('/system/operation-logs', {
    method: 'DELETE',
    params: before ? { before } : undefined,
  });
}
