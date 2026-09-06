import { LOGIN_PATH } from '@/constants';
import { Modal } from 'antd';
import { history } from 'umi';
import { tokenManager } from './token';
import { redirectToLogin } from './url';

/**
 * 401 授权过期弹窗实例
 * 用于防止并发 401 请求重复弹窗，并支持在跳转登录页时主动销毁
 */
let authModalInstance: ReturnType<typeof Modal.confirm> | null = null;

/**
 * 销毁当前 401 弹窗并重置状态
 */
export const destroyAuthModal = () => {
  authModalInstance?.destroy();
  authModalInstance = null;
};

/**
 * 凭证失效的统一决策点：决定"直接跳 login"还是"弹窗让用户选去留"。
 *
 * 互斥原则：弹窗在时，后台触发的失效事件一律让位给弹窗（去重 return），
 * 仅用户在弹窗里点"重新登录"才走 redirectToLogin。
 *
 * - 在 login 页：清凭证销弹窗，不跳不弹
 * - 弹窗已在：去重，return
 * - 本地无有效凭证（refresh 已失败/未登录）：直接跳 login
 * - 本地还有凭证（用户正操作中）：弹窗让用户选
 */
export function handleAuthExpired() {
  // 已在 login 页，无需再跳；若弹窗残留则销毁
  if (history.location.pathname === LOGIN_PATH) {
    destroyAuthModal();
    return;
  }

  // 弹窗已展示：它是认证过期的主导交互，后台事件去重让位
  if (authModalInstance) return;

  // 本地无有效凭证：用户没在交互，直接跳 login，不弹
  if (!tokenManager.isAuthenticated()) {
    redirectToLogin();
    return;
  }

  // 本地凭证仍在：用户正在操作，弹窗让其选"重新登录 / 取消留下"
  authModalInstance = Modal.confirm({
    title: '系统提示',
    content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
    okText: '重新登录',
    cancelText: '取消',
    onOk: () => {
      redirectToLogin();
    },
    onCancel: () => {
      // 用户选择暂不登录，保留凭证继续停留当前页面
    },
    afterClose: () => {
      authModalInstance = null;
    },
  });
}
