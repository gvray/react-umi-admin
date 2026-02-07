import { request } from '@gvray/request';

// 字典类型相关接口
export interface DictionaryType {
  id: number;
  typeId: string;
  code: string;
  name: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  items?: DictionaryItem[];
  createdById?: string;
  updatedById?: string;
  createdAt: string;
  updatedAt: string;
}

// 字典项相关接口
export interface DictionaryItem {
  id: number;
  itemId: string;
  typeId: string;
  code: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  status: number;
  sort: number;
  remark?: string;
  createdById?: string;
  updatedById?: string;
  createdAt: string;
  updatedAt: string;
}

// 字典类型列表
export const listDictionaryType = (params?: any) => {
  return request('/system/dictionaries/types', {
    method: 'GET',
    params,
  });
};

// 获取字典类型详情
export const getDictionaryType = (typeId: string) => {
  return request(`/system/dictionaries/types/${typeId}`, {
    method: 'GET',
  });
};

// 创建字典类型
export const createDictionaryType = (data: Partial<DictionaryType>) => {
  return request('/system/dictionaries/types', {
    method: 'POST',
    data,
  });
};

// 更新字典类型
export const updateDictionaryType = (
  typeId: string,
  data: Partial<DictionaryType>,
) => {
  return request(`/system/dictionaries/types/${typeId}`, {
    method: 'PATCH',
    data,
  });
};

// 删除字典类型
export const deleteDictionaryType = (typeId: string) => {
  return request(`/system/dictionaries/types/${typeId}`, {
    method: 'DELETE',
  });
};

// 字典项列表
export const listDictionaryItem = (typeCode: string, params?: any) => {
  return request('/system/dictionaries/items', {
    method: 'GET',
    params: {
      ...params,
      typeCode,
    },
  });
};

// 获取字典项详情
export const getDictionaryItem = (itemId: string) => {
  return request(`/system/dictionaries/items/${itemId}`, {
    method: 'GET',
  });
};

// 创建字典项
export const createDictionaryItem = (data: Partial<DictionaryItem>) => {
  return request('/system/dictionaries/items', {
    method: 'POST',
    data,
  });
};

// 更新字典项
export const updateDictionaryItem = (
  itemId: string,
  data: Partial<DictionaryItem>,
) => {
  return request(`/system/dictionaries/items/${itemId}`, {
    method: 'PATCH',
    data,
  });
};

// 删除字典项
export const deleteDictionaryItem = (itemId: string) => {
  return request(`/system/dictionaries/items/${itemId}`, {
    method: 'DELETE',
  });
};

// 批量获取字典项
export const getDictionaryTypesBatch = (typeCodes: string) => {
  return request(`/system/dictionaries/types/batch`, {
    method: 'GET',
    params: {
      typeCodes,
    },
  });
};
