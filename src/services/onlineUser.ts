import { request } from '@gvray/request';

/** 获取在线用户列表 */
export function queryOnlineUserList(params?: API.OnlineUsersListParams) {
  return request<API.Response<API.PaginatedResponse<API.OnlineUserItemDto>>>(
    '/system/online-users',
    {
      method: 'GET',
      params,
    },
  );
}

/** 获取指定用户的会话列表 */
export function queryUserSessions(userId: string) {
  return request<API.Response<API.SessionDetailDto[]>>(
    `/system/online-users/${userId}/sessions`,
    {
      method: 'GET',
    },
  );
}

/** 强退用户（踢出所有会话） */
export function kickUser(userId: string) {
  return request<API.Response<void>>(`/system/online-users/${userId}/kick`, {
    method: 'POST',
  });
}

/** 强退指定会话 */
export function kickSession(userId: string, tokenHash: string) {
  return request<API.Response<void>>(
    `/system/online-users/${userId}/sessions/${tokenHash}/kick`,
    {
      method: 'POST',
    },
  );
}
