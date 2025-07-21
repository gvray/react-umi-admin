import { getCurrentUser } from '@/services/user';
import storetify from 'storetify';
import { history } from 'umi';
import { errorConfig } from './requestErrorConfig';
import { logger } from './utils';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      // skipErrorHandler 跳过信息提示
      const msg = await getCurrentUser({ skipErrorHandler: true });
      return msg.data;
    } catch (error) {
      // 清除登录状态并跳转登录页
      storetify.remove(TOKEN_KEY);
      history.push(loginPath);
    }
  };
  logger.info(`App 初始化完成`);
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  return {
    fetchUserInfo,
  };
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  timeout: parseInt(TIMEOUT),
  baseURL: BASE_URL,
  ...errorConfig,
};
