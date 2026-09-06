import { isString } from '@gvray/eskit';
import { createClient } from '@gvray/request';
import { httpConfig } from './httpConfig';
import { refreshToken } from './services/auth';
import { tokenManager } from './utils';
import { wrapToBizError } from './utils/errors';

// 创建并初始化请求客户端
const client = createClient({
  timeout: __APP_API_TIMEOUT__,
  baseURL: __APP_API_URL__,
  errorConfig: httpConfig.errorConfig,
  requestInterceptors: httpConfig.requestInterceptors,
  responseInterceptors: httpConfig.responseInterceptors,
  preset: {
    bearerAuth: {
      getToken: () => Promise.resolve(tokenManager.getAccessToken()),
    },
    requestAuthRefresh: {
      getToken: () => Promise.resolve(tokenManager.getAccessToken()), // null = expired
      refreshToken: async () => {
        const token = tokenManager.getRefreshToken();
        if (!token) {
          return null; // 无 refresh token，无法刷新，需重新登录
        }
        try {
          const res = await refreshToken({ refreshToken: token });
          const {
            access_token,
            refresh_token,
            access_token_expires_in,
            refresh_token_expires_in,
          } = res.data;
          tokenManager.setRefreshToken(refresh_token, refresh_token_expires_in);
          return { access_token, access_token_expires_in };
        } catch (error) {
          // refresh token 失效时清除凭证，使后续 isAuthenticated() 返回 false，
          // 让 handle401Unauthorized 走"直接跳转登录"而非"弹窗"分支，
          // 避免弹窗弹出后被并发跳转销毁而出现闪现。仅对 401 清理，保留网络抖动等场景的凭证。
          if (wrapToBizError(error).details?.status === 401) {
            tokenManager.clearTokens();
          }
          throw error;
        }
      },
      setToken: (token) => {
        if (isString(token)) {
          return; // 无法刷新，需重新登录
        }
        tokenManager.setAccessToken(
          token.access_token,
          token.access_token_expires_in,
        );
      },
      exclude: ['/auth/login', '/auth/refresh', '/system/notices/unread/count'], // 排除不需要刷新 token 的接口
    },
    logging: __APP_LOGGING_ENABLED__, // 请求日志开关，生产环境默认关闭
  },
});

// 导出客户端实例，确保模块被正确加载
export default client;
