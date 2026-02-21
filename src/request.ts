import { createClient } from '@gvray/request';
import { httpConfig } from './httpConfig';

createClient({
  timeout: __APP_API_TIMEOUT__,
  baseURL: __APP_API_URL__,
  errorConfig: httpConfig.errorConfig,
  requestInterceptors: httpConfig.requestInterceptors,
  responseInterceptors: httpConfig.responseInterceptors,
});
