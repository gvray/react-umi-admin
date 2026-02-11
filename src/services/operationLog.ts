import { request } from '@gvray/request';

/** 获取操作日志列表 */
export function queryOperationLogList(
  params?: API.OperationLogsFindManyParams,
) {
  return request<API.Response<API.PaginatedResponse<Record<string, unknown>>>>(
    '/system/operation-logs',
    {
      method: 'GET',
      params,
    },
  );
}

/** 获取操作日志详情 */
export function getOperationLogById(logId: string) {
  return request<API.Response<Record<string, unknown>>>(
    `/system/operation-logs/${logId}`,
    {
      method: 'GET',
    },
  );
}

/** 批量删除操作日志 */
export function batchDeleteOperationLogs(
  data: API.BatchDeleteOperationLogsDto,
) {
  return request<API.Response<void>>('/system/operation-logs/batch-delete', {
    method: 'POST',
    data,
  });
}

/** 清理操作日志 */
export function clearOperationLog(data?: API.CleanOperationLogsDto) {
  return request<API.Response<void>>('/system/operation-logs/clear', {
    method: 'DELETE',
    data,
  });
}
