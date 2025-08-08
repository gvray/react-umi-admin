import { errorConfig } from '@/requestErrorConfig';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// 基础请求选项接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  requestInterceptors?: any[];
  responseInterceptors?: any[];
  getResponse?: boolean;
}

// 带响应选项的请求选项
interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true;
}

// 不带响应选项的请求选项
interface IRequestOptionsWithoutResponse extends IRequestOptions {
  getResponse: false;
}

// 请求函数重载类型
interface IRequest {
  <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<
    AxiosResponse<T>
  >;
  <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, opts?: IRequestOptions): Promise<T>; // getResponse 默认是 false，因此不提供该参数时，只返回 data
  <T = any>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

// 错误类型
type RequestError = AxiosError | Error;

// 错误处理器
interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void;
}

// 请求配置接口
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler;
    errorThrower?: (res: T) => void;
  };
  requestInterceptors?: any[];
  responseInterceptors?: any[];
}

let requestInstance: AxiosInstance;
const config: any = {
  timeout: __APP_API_TIMEOUT__,
  baseURL: __APP_API_URL__,
  ...errorConfig,
};

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  requestInstance = axios.create(config);

  config?.requestInterceptors?.forEach((interceptor: any) => {
    if (Array.isArray(interceptor)) {
      requestInstance.interceptors.request.use(async (config: any) => {
        const { url } = config;
        if (interceptor[0].length === 2) {
          const { url: newUrl, options } = await interceptor[0](
            url || '',
            config,
          );
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      requestInstance.interceptors.request.use(async (config: any) => {
        const { url } = config;
        if (interceptor.length === 2) {
          const { url: newUrl, options } = await interceptor(url || '', config);
          return { ...options, url: newUrl };
        }
        return interceptor(config);
      });
    }
  });

  config?.responseInterceptors?.forEach((interceptor: any) => {
    if (Array.isArray(interceptor)) {
      requestInstance.interceptors.response.use(interceptor[0], interceptor[1]);
    } else {
      requestInstance.interceptors.response.use(interceptor);
    }
  });

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  requestInstance.interceptors.response.use((response) => {
    const { data } = response;
    if (data?.success === false && config?.errorConfig?.errorThrower) {
      config.errorConfig.errorThrower(data);
    }
    return response;
  });

  return requestInstance;
};

const request = (url: string, opts: IRequestOptions = { method: 'GET' }) => {
  const requestInstance = getRequestInstance();
  const {
    getResponse = false,
    requestInterceptors,
    responseInterceptors,
  } = opts;

  const requestInterceptorsToEject = requestInterceptors?.map(
    (interceptor: any) => {
      if (Array.isArray(interceptor)) {
        return requestInstance.interceptors.request.use(async (config: any) => {
          const { url } = config;
          if (interceptor[0].length === 2) {
            const { url: newUrl, options } = await interceptor[0](
              url || '',
              config,
            );
            return { ...options, url: newUrl };
          }
          return interceptor[0](config);
        }, interceptor[1]);
      } else {
        return requestInstance.interceptors.request.use(async (config: any) => {
          const { url } = config;
          if (interceptor.length === 2) {
            const { url: newUrl, options } = await interceptor(
              url || '',
              config,
            );
            return { ...options, url: newUrl };
          }
          return interceptor(config);
        });
      }
    },
  );

  const responseInterceptorsToEject = responseInterceptors?.map(
    (interceptor: any) => {
      if (Array.isArray(interceptor)) {
        return requestInstance.interceptors.response.use(
          interceptor[0],
          interceptor[1],
        );
      } else {
        return requestInstance.interceptors.response.use(interceptor);
      }
    },
  );

  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        resolve(getResponse ? res : res.data);
      })
      .catch((error) => {
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        try {
          const handler = config?.errorConfig?.errorHandler;
          if (handler) {
            handler(error, opts);
          }
        } catch (e) {
          reject(e);
        }
        reject(error);
      });
  });
};

export { getRequestInstance, request };
export type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  IRequest as Request,
  RequestError,
  IRequestOptions as RequestOptions,
};
