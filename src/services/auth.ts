import { request } from '@gvray/request';

/** 用户登录 */
export function login(data: API.LoginDto) {
  return request<API.Response<{ access_token: string }>>('/auth/login', {
    method: 'POST',
    data,
    skipAuth: true,
  });
}

/** 退出登录 */
export function logout() {
  return request<API.Response<void>>('/auth/logout', {
    method: 'POST',
  });
}

/** 获取当前用户信息 */
export function profile() {
  return request<API.Response<API.CurrentUserResponseDto>>('/auth/profile', {
    method: 'GET',
  });
}

/** 获取当前用户菜单树 */
export function getMenus() {
  return request<API.Response<API.MenuResponseDto[]>>('/auth/menus', {
    method: 'GET',
  });
}
