import { LOGIN_PATH, WHITE_LIST } from '@/constants';
import {
  createLoginRedirect,
  isSafeRedirect,
  normalizeRedirect,
} from '@gvray/adminkit';
import { history } from 'umi';
import { destroyAuthModal } from './authModal';
import { tokenManager } from './token';

/**
 * 跳转到登录页（纯跳转动作）：清凭证 + 销毁弹窗 + 跳转。
 * 不判断是否已过期，调用方自行确定"确实该去 login"。
 */
export function redirectToLogin() {
  // 清除本地凭证，避免旧 token 被带到登录后的请求中
  tokenManager.clearTokens();
  // 销毁可能残留的 401 弹窗
  destroyAuthModal();

  const { pathname, search } = history.location;
  // 如果当前已在白名单页面（如登录、注册），则不执行重定向
  if (WHITE_LIST.includes(pathname)) return;

  const redirect = normalizeRedirect(pathname + search);
  if (!isSafeRedirect(redirect, { denyList: WHITE_LIST })) return;

  // 清除可能存在的旧 redirectPath
  sessionStorage.removeItem('redirectPath');
  history.push(createLoginRedirect(LOGIN_PATH, redirect));
}
