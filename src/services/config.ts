import { request } from '@gvray/request';

// 配置接口
export interface Config {
  configId: string;
  key: string;
  value: string;
  name: string;
  description?: string;
  type: string;
  group: string;
  status: number;
  sort: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

// 配置列表
export const listConfig = (params?: any) => {
  return request('/system/configs', {
    method: 'GET',
    params,
  });
};

// 获取配置详情
export const getConfig = (configId: string) => {
  return request(`/system/configs/${configId}`, {
    method: 'GET',
  });
};

// 创建配置
export const createConfig = (data: Partial<Config>) => {
  return request('/system/configs', {
    method: 'POST',
    data,
  });
};

// 更新配置
export const updateConfig = (configId: string, data: Partial<Config>) => {
  return request(`/system/configs/${configId}`, {
    method: 'PATCH',
    data,
  });
};

// 删除配置
export const deleteConfig = (configId: string) => {
  return request(`/system/configs/${configId}`, {
    method: 'DELETE',
  });
};

// 根据键获取配置值
export const getConfigByKey = (key: string) => {
  return request(`/system/configs/key/${key}`, {
    method: 'GET',
  });
};

// 批量更新配置
export const batchUpdateConfig = (data: { key: string; value: string }[]) => {
  return request('/system/configs/batch', {
    method: 'PUT',
    data,
  });
};
