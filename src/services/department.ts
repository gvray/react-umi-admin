// 部门管理

import { request } from 'umi';

// 部门数据类型定义
export interface Department {
  departmentId: number;
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  parentName?: string;
  level: number;
  sort: number;
  managerId?: number;
  managerName?: string;
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
  address?: string;
  children?: Department[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  employeeCount?: number;
  positionCount?: number;
}

export interface DepartmentListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  parentId?: number;
  level?: number;
  managerId?: number;
  status?: 'active' | 'inactive';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface DepartmentCreateParams {
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  sort?: number;
  managerId?: number;
  status?: 'active' | 'inactive';
  phone?: string;
  email?: string;
  address?: string;
}

export interface DepartmentUpdateParams
  extends Partial<DepartmentCreateParams> {
  departmentId: number;
}

// CRUD API 服务函数

/**
 * 获取部门列表
 * @param params 查询参数
 * @param options 请求选项
 */
export async function listDepartment(
  params?: DepartmentListParams,
  options?: { [key: string]: any },
) {
  return request('/system/departments', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取单个部门详情
 * @param departmentId 部门ID
 * @param options 请求选项
 */
export async function getDepartment(
  departmentId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建新部门
 * @param values 部门数据
 * @param options 请求选项
 */
export async function createDepartment(
  values: DepartmentCreateParams,
  options?: { [key: string]: any },
) {
  return request('/system/departments', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

/**
 * 更新部门
 * @param values 更新数据
 * @param options 请求选项
 */
export async function updateDepartment(
  values: DepartmentUpdateParams,
  options?: { [key: string]: any },
) {
  const { departmentId, ...rest } = values;
  return request(`/system/departments/${departmentId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

/**
 * 删除部门
 * @param departmentId 部门ID
 * @param options 请求选项
 */
export async function deleteDepartment(
  departmentId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/**
 * 批量删除部门
 * @param departmentIds 部门ID数组
 * @param options 请求选项
 */
export async function batchDeleteDepartments(
  departmentIds: number[],
  options?: { [key: string]: any },
) {
  return request('/system/departments/batch-delete', {
    method: 'POST',
    data: { ids: departmentIds },
    ...(options || {}),
  });
}

/**
 * 更新部门状态
 * @param departmentId 部门ID
 * @param status 新状态
 * @param options 请求选项
 */
export async function updateDepartmentStatus(
  departmentId: number,
  status: 'active' | 'inactive',
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}/status`, {
    method: 'PATCH',
    data: { status },
    ...(options || {}),
  });
}

/**
 * 获取部门树结构
 * @param options 请求选项
 */
export async function getDepartmentTree(
  params?: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request('/system/departments/tree', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/**
 * 获取部门下的员工列表
 * @param departmentId 部门ID
 * @param options 请求选项
 */
export async function getDepartmentEmployees(
  departmentId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}/employees`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取部门下的职位列表
 * @param departmentId 部门ID
 * @param options 请求选项
 */
export async function getDepartmentPositions(
  departmentId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}/positions`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 移动部门到新的父部门
 * @param departmentId 部门ID
 * @param parentId 新父部门ID
 * @param options 请求选项
 */
export async function moveDepartment(
  departmentId: number,
  parentId: number | null,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}/move`, {
    method: 'PATCH',
    data: { parentId },
    ...(options || {}),
  });
}

/**
 * 更新部门排序
 * @param departmentId 部门ID
 * @param sort 排序值
 * @param options 请求选项
 */
export async function updateDepartmentSort(
  departmentId: number,
  sort: number,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}/sort`, {
    method: 'PATCH',
    data: { sort },
    ...(options || {}),
  });
}

/**
 * 设置部门主管
 * @param departmentId 部门ID
 * @param managerId 主管用户ID
 * @param options 请求选项
 */
export async function setDepartmentManager(
  departmentId: number,
  managerId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${departmentId}/manager`, {
    method: 'PATCH',
    data: { managerId },
    ...(options || {}),
  });
}

/**
 * 获取部门统计信息
 * @param options 请求选项
 */
export async function getDepartmentStats(options?: { [key: string]: any }) {
  return request('/system/departments/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 搜索部门
 * @param keyword 搜索关键词
 * @param options 请求选项
 */
export async function searchDepartments(
  keyword: string,
  options?: { [key: string]: any },
) {
  return request('/system/departments/search', {
    method: 'GET',
    params: { keyword },
    ...(options || {}),
  });
}

/**
 * 获取子部门列表
 * @param parentId 父部门ID
 * @param options 请求选项
 */
export async function getChildDepartments(
  parentId: number,
  options?: { [key: string]: any },
) {
  return request(`/system/departments/${parentId}/children`, {
    method: 'GET',
    ...(options || {}),
  });
}
