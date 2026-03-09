import { createClient } from '@gvray/request';
import { httpConfig } from './httpConfig';
import { tokenManager } from './utils';

createClient({
  timeout: __APP_API_TIMEOUT__,
  baseURL: __APP_API_URL__,
  errorConfig: httpConfig.errorConfig,
  requestInterceptors: httpConfig.requestInterceptors,
  responseInterceptors: httpConfig.responseInterceptors,
  preset: {
    bearerAuth: {
      getToken: () => Promise.resolve(tokenManager.getAccessToken()),
    },
  },
});
