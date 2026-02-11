import { IRequestOptions, request } from '@gvray/request';

/** 获取当前用户信息 */
export function queryProfile(options?: IRequestOptions) {
  return request<API.Response<API.CurrentUserResponseDto>>('/profile', {
    method: 'GET',
    ...options,
  });
}
