import { mergeSettings } from '@/constants/settings';
import { queryMenus } from '@/services/auth';
import { getRuntimeConfig } from '@/services/config';
import { queryProfile } from '@/services/profile';
import storetify from 'storetify';
import { history } from 'umi';
import { logger } from './utils';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
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

  const fetchProfile = async () => {
    try {
      const res = await queryProfile({ skipErrorHandler: true });
      return res.data;
    } catch (error) {
      storetify.remove(__APP_API_TOKEN_KEY__);
      history.push(loginPath);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await queryMenus();
      return res.data;
    } catch (error) {
      logger.error(error);
    }
  };

  // 已登录时并行获取用户信息和菜单
  if (storetify.has(__APP_API_TOKEN_KEY__)) {
    [profile, menus] = await Promise.all([fetchProfile(), fetchMenus()]);
  }

  // 合并设置：常量 < runtimeConfig < profile.preferences
  const settings = mergeSettings(runtimeConfig, profile?.preferences);

  logger.info('App 初始化完成');
  return {
    fetchProfile,
    fetchMenus,
    settings,
    profile,
    menus,
  };
}
