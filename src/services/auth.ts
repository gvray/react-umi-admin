import { request } from '@gvray/request';

/** 登录接口 POST /login */
export async function login(body: any, options?: { [key: string]: any }) {
  return request('/auth/login', {
    method: 'POST',
    data: body,
    ...(options || { skipAuthHandler: true }),
  });
}

/** 退出登录接口 POST /logout */
export async function logout(options?: { [key: string]: any }) {
  return request('/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /currentUser */
export async function profile(options?: { [key: string]: any }) {
  return request('/auth/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取菜单
export async function getMenus(options?: { [key: string]: any }) {
  return request('/auth/menus', {
    method: 'GET',
    ...(options || {}),
  });
}
