import {
  createClient,
  ErrorConfig,
  IRequestInterceptorTuple,
  IResponseInterceptorTuple,
} from '@gvray/request';
import { errorConfig } from './requestErrorConfig';
// 新版request稳定后替换所有request
createClient({
  timeout: __APP_API_TIMEOUT__,
  baseURL: __APP_API_URL__,
  errorConfig: errorConfig.errorConfig as ErrorConfig,
  requestInterceptors:
    errorConfig.requestInterceptors as IRequestInterceptorTuple[],
  responseInterceptors:
    errorConfig.responseInterceptors as IResponseInterceptorTuple[],
});
