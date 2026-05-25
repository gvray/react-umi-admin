import { LOGIN_PATH, WHITE_LIST } from '@/constants';
import { history } from 'umi';

/**
 * 获取当前路径的编码后的跳转地址
 * 用于登录后跳回原页面
 */
export function getEncodedRedirectPath() {
  const { pathname, search } = history.location;
  return encodeURIComponent(pathname + search);
}

/**
 * 跳转到登录页并携带重定向参数
 */
export function redirectToLogin() {
  const { pathname } = history.location;
  // 如果当前已在白名单页面（如登录、注册），则不执行重定向
  if (WHITE_LIST.includes(pathname)) return;

  const redirect = getEncodedRedirectPath();
  // 清除可能存在的旧 redirectPath
  sessionStorage.removeItem('redirectPath');
  history.push(`${LOGIN_PATH}?redirect=${redirect}`);
}
