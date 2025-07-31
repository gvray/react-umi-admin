import { request } from 'umi';

export async function listUser(params: any, options?: { [key: string]: any }) {
  return request('/users', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function deleteUser(
  userId: number,
  options?: { [key: string]: any },
) {
  return request(`/users/${userId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function addUser(values: any, options?: { [key: string]: any }) {
  return request('/users', {
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
  return request(`/users/${userId}`, {
    method: 'PATCH',
    data: rest,
    ...(options || {}),
  });
}

export async function getUser(
  userId: number,
  options?: { [key: string]: any },
) {
  return request(`/users/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
