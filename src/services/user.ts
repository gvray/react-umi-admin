import { request } from 'umi';

export async function listUser(params: any, options?: { [key: string]: any }) {
  return request('/user/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function deleteUser(
  userId: number,
  options?: { [key: string]: any },
) {
  return request(`/user/${userId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function addUser(values: any, options?: { [key: string]: any }) {
  return request('/user', {
    method: 'POST',
    data: values,
    ...(options || {}),
  });
}

export async function updateUser(
  values: any,
  options?: { [key: string]: any },
) {
  return request('/user', {
    method: 'PUT',
    data: values,
    ...(options || {}),
  });
}

export async function getUser(
  userId: number,
  options?: { [key: string]: any },
) {
  return request(`/user/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
