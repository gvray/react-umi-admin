import { request } from '@gvray/request';

export async function listUser(params?: any, options?: { [key: string]: any }) {
  return request('/system/users', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function deleteUser(
  userId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/users/${userId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function addUser(values: any, options?: { [key: string]: any }) {
  return request('/system/users', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

export async function updateUser(
  values: any,
  options?: { [key: string]: any },
) {
  const { userId, ...rest } = values;
  return request(`/system/users/${userId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

export async function getUser(
  userId: string,
  options?: { [key: string]: any },
) {
  return request(`/system/users/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateUserRole(
  userId: string,
  data: any,
  options?: { [key: string]: any },
) {
  return request(`/system/users/${userId}/roles`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
