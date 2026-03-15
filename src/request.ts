import { createClient } from '@gvray/request';
import { httpConfig } from './httpConfig';
import { tokenManager } from './utils';

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
    logging: true,
  },
});

// 导出客户端实例，确保模块被正确加载
export default client;
