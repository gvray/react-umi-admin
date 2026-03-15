import { ErrorShowType } from '@gvray/request';

export type ErrorType = 'BusinessError' | 'ResponseError' | 'RequestError';

// 后端约定的业务错误结构
export interface BizErrorDetails {
  status?: number;
  code?: number;
  message?: string;
  path?: string;
  success?: boolean;
  timestamp?: string;
  data?: any;
  showType?: ErrorShowType; // 可对应前端 ErrorShowType
  rawRequest?: any; // 原始请求对象
  rawResponse?: any; // 原始响应对象
  [key: string]: any; // 允许扩展其他字段
}

// 业务错误类
export class BizError extends Error {
  public readonly details: BizErrorDetails;

  constructor(details: BizErrorDetails) {
    super(details.message || '业务异常');
    this.name = 'BusinessError';
    this.details = details;
  }
}

// 响应错误类（Axios response 非 2xx）
export class ResponseError extends Error {
  public readonly details: any;

  constructor(message: string, response: any) {
    super(message);
    this.name = 'ResponseError';
    this.details = response;
  }
}

// 请求错误类（Axios request 发起失败）
export class RequestError extends Error {
  public readonly details: any;

  constructor(message: string, request: any) {
    super(message);
    this.name = 'RequestError';
    this.details = request;
  }
}

// 辅助函数：统一抛业务错误
export const throwBizError = (details: BizErrorDetails): never => {
  throw new BizError(details);
};

export const wrapToBizError = (error: any): BizError => {
  if (error instanceof BizError) return error;

  if (error?.response) {
    const res = error.response.data;

    return new BizError({
      status: error.response.status,
      code: res?.code,
      message: res?.message || error.message,
      data: res?.data,
      showType: res?.showType,
      path: res?.path,
      timestamp: res?.timestamp,
      rawRequest: error.config,
      rawResponse: error.response,
    });
  }

  if (error?.request) {
    return new BizError({
      message: '系统没有响应，请稍后重试',
      showType: ErrorShowType.ERROR_MESSAGE,
      rawRequest: error.request,
    });
  }

  return new BizError({
    message: error?.message || '未知异常',
    showType: ErrorShowType.ERROR_MESSAGE,
  });
};
