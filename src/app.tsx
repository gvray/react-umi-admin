import { resolveServerConfig } from '@/constants/settings';
import { queryMenus } from '@/services/auth';
import { getRuntimeConfig } from '@/services/config';
import { queryProfile } from '@/services/profile';
import { useAppStore, useAuthStore } from '@/stores';
import storetify from 'storetify';
import { history } from 'umi';
import { logger } from './utils';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * 应用启动时的数据获取入口，获取完后分发到各 Store。
 * UI 层不直接消费 initialState，统一通过 Store 读取。
 *
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 */
export async function getInitialState() {
  let runtimeConfig: Record<string, unknown> | undefined;
  let profile: API.CurrentUserResponseDto | undefined;
  let menus: API.MenuResponseDto[] | undefined;

  // 获取运行时配置（无需登录）
  try {
    const res = await getRuntimeConfig();
    runtimeConfig = res.data;
  } catch (error) {
    logger.error(error);
  }

  // 已登录时并行获取用户信息和菜单
  if (storetify.has(__APP_API_TOKEN_KEY__)) {
    try {
      const [profileRes, menusRes] = await Promise.all([
        queryProfile({ skipErrorHandler: true }),
        queryMenus(),
      ]);
      profile = profileRes.data;
      menus = menusRes.data;
      // 在login页面刷新 这里应该跳转到首页
      if (history.location.pathname === loginPath) {
        history.push('/');
      }
    } catch (error) {
      storetify.remove(__APP_API_TOKEN_KEY__);
      history.push(loginPath);
    }
  }

  // 服务端配置 → AppStore
  useAppStore.getState().setServerConfig(resolveServerConfig(runtimeConfig));

  // 认证数据 → 分发到 AuthStore
  if (profile) {
    useAuthStore.getState().setAuth(profile, menus);
  }

  logger.info('App 初始化完成');
  return {};
}
