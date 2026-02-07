import { logger } from '@/utils';
import type { RequestConfig, RequestOptions } from '@gvray/request';
import { message as msg, notification } from 'antd';
import storetify from 'storetify';
// 这里 umi request插件的错误处理方案， 可以在这里做自己的改动，但我不打算使用 完将完全暴露request到utils中

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  code?: number;
  message?: string;
  showType?: ErrorShowType;
}

export const errorConfig: RequestConfig = {
  errorConfig: {
    // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
    errorThrower: (res) => {
      const { success, data, code, message, showType } =
        res as unknown as ResponseStructure;

      if (!success) {
        const error: any = new Error(message);
        error.name = 'BizError';
        error.info = { code, message, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 接受 axios 的错误。
    // 接受 errorThrower 抛出的错误。
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { message, code } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              msg.warning(message);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              msg.error(message);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: message,
                message: code,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              msg.error(message);
              logger.error(error);
          }
        }
      } else if (error.response) {
        const res = error.response.data;
        const message = res?.message || error.response.statusText;
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        msg.error(`${message}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        msg.error('系统没有响应，请稍后重试');
      } else {
        // 发送请求时出了点问题
        msg.error('请求错误，请稍后重试');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const { headers = {}, url, skipAuth, ...restConfig } = config;
      logger.info(`API请求路径：${url}`);
      if (!skipAuth) {
        headers.Authorization = `Bearer ${storetify(__APP_API_TOKEN_KEY__)}`;
      }
      return { url, ...restConfig, headers: { ...headers } };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截200-299的响应数据，进行个性化处理,这里比 errorThrower 那拦截器早执行
      const { data } = response as unknown as ResponseStructure;
      if (data?.success === false) {
        logger.warn('服务判定错误');
      }
      return response;
    },
  ],
};
