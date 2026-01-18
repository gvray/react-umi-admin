import { request } from '@gvray/request';

// 职位数据类型定义
export interface Position {
  positionId: number;
  name: string;
  code: string;
  description?: string;
  level: number;
  departmentId?: number;
  departmentName?: string;
  status: 'active' | 'inactive';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements?: string[];
  responsibilities?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  employeeCount?: number;
}

export interface PositionListParams {
  current?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  departmentId?: number;
  level?: number;
  status?: 'active' | 'inactive';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface PositionCreateParams {
  name: string;
  code: string;
  description?: string;
  level: number;
  departmentId?: number;
  status?: 'active' | 'inactive';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements?: string[];
  responsibilities?: string[];
}

export interface PositionUpdateParams extends Partial<PositionCreateParams> {
  positionId: number;
}

// CRUD API 服务函数

/**
 * 获取职位列表
 * @param params 查询参数
 * @param options 请求选项
 */
export async function listPosition(
  params?: PositionListParams,
  options?: { [key: string]: any },
) {
  return request('/system/positions', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取单个职位详情
 * @param positionId 职位ID
 * @param options 请求选项
 */
export async function getPosition(
  positionId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/positions/${positionId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建新职位
 * @param values 职位数据
 * @param options 请求选项
 */
export async function createPosition(
  values: PositionCreateParams,
  options?: { [key: string]: any },
) {
  return request('/system/positions', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * 更新职位
 * @param values 更新数据
 * @param options 请求选项
 */
export async function updatePosition(
  values: PositionUpdateParams,
  options?: { [key: string]: any },
) {
  const { positionId, ...rest } = values;
  return request(`/system/positions/${positionId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

/**
 * 删除职位
 * @param positionId 职位ID
 * @param options 请求选项
 */
export async function deletePosition(
  positionId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/positions/${positionId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 批量删除职位
 * @param positionIds 职位ID数组
 * @param options 请求选项
 */
export async function batchDeletePositions(
  positionIds: number[],
  options?: { [key: string]: any },
) {
  return request('/system/positions/batch-delete', {
    method: 'POST',
    data: { ids: positionIds },
    ...(options || {}),
  });
}

/**
 * 更新职位状态
 * @param positionId 职位ID
 * @param status 新状态
 * @param options 请求选项
 */
export async function updatePositionStatus(
  positionId: number,
  status: 'active' | 'inactive',
  options?: { [key: string]: any },
) {
  return request(`/system/positions/${positionId}/status`, {
    method: 'PATCH',
    data: { status },
    ...(options || {}),
  });
}

/**
 * 获取职位下的员工列表
 * @param positionId 职位ID
 * @param options 请求选项
 */
export async function getPositionEmployees(
  positionId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/positions/${positionId}/employees`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 按部门获取职位列表
 * @param departmentId 部门ID
 * @param options 请求选项
 */
export async function getPositionsByDepartment(
  departmentId: number,
  options?: { [key: string]: any },
) {
  return request(`/departments/${departmentId}/system/positions`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取职位统计信息
 * @param options 请求选项
 */
export async function getPositionStats(options?: { [key: string]: any }) {
  return request('/system/positions/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 搜索职位
 * @param keyword 搜索关键词
 * @param options 请求选项
 */
export async function searchPositions(
  keyword: string,
  options?: { [key: string]: any },
) {
  return request('/system/positions/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}

/**
 * 获取职位层级树
 * @param options 请求选项
 */
export async function getPositionTree(options?: { [key: string]: any }) {
  return request('/system/positions/tree', {
    method: 'GET',
    ...(options || {}),
  });
}
