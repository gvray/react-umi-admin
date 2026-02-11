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
  const fetchProfile = async () => {
    try {
      // skipErrorHandler 跳过信息提示
      const msg = await queryProfile({ skipErrorHandler: true });
      return msg.data;
    } catch (error) {
      // 清除登录状态并跳转登录页
      storetify.remove(__APP_API_TOKEN_KEY__);
      history.push(loginPath);
    }
  };
  logger.info(`App 初始化完成`);
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const profile = await fetchProfile();
    return {
      fetchProfile,
      profile,
    };
  }
  return {
    fetchProfile,
  };
}
