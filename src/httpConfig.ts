import { logger } from '@/utils';
import { ErrorShowType, HttpConfig, HttpRequestOptions } from '@gvray/request';
import { Modal, message as msg, notification } from 'antd';
import { history } from 'umi';

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  code?: number;
  message?: string;
  showType?: ErrorShowType;
}

// 防止多次弹出 401 对话框
let isShowingAuthModal = false;

export const httpConfig: HttpConfig = {
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
              // 这里接住了报错不走默认的错误处理
              logger.warn(error);
          }
        }
      } else if (error.response) {
        const res = error.response.data;
        const status = error.response.status;
        const message = res?.message || error.response.statusText;
        // 401 未授权 - 登录状态过期
        if (status === 401) {
          // 防止多个 401 请求同时弹出多个对话框
          if (!isShowingAuthModal) {
            isShowingAuthModal = true;
            Modal.confirm({
              title: '系统提示',
              content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
              okText: '重新登录',
              cancelText: '取消',
              onOk: () => {
                // 保存当前位置，登录后跳回
                const currentPath =
                  history.location.pathname + history.location.search;
                // 如果当前已经在登录页，直接跳转到登录页，不带 redirect 参数
                if (history.location.pathname === '/login') {
                  history.push('/login');
                } else {
                  history.push(
                    `/login?redirect=${encodeURIComponent(currentPath)}`,
                  );
                }
                isShowingAuthModal = false;
              },
              onCancel: () => {
                isShowingAuthModal = false;
              },
            });
          }
        } else {
          // 其他 Axios 错误
          // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
          logger.error(`${message}`);
        }
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
    (config: HttpRequestOptions) => {
      // 已经内置http logger 根据自己的业务做相应处理
      // logger.info(`API请求路径：${config.url}`);
      return config;
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
