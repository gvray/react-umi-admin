import {
  kickSession,
  kickUser,
  queryOnlineUserList,
  queryUserSessions,
} from '@/services/onlineUser';
import { useCallback, useState } from 'react';

export const useOnlineUserModel = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchOnlineUserList = useCallback((params?: Record<string, any>) => {
    const { username, ...rest } = params || {};
    return queryOnlineUserList({
      ...rest,
      ...(username ? { keyword: username } : {}),
    });
  }, []);

  const fetchUserSessions = useCallback(async (userId: string) => {
    const { data } = await queryUserSessions(userId);
    return data ?? [];
  }, []);

  const forceLogoutUser = useCallback(async (userId: string) => {
    await kickUser(userId);
  }, []);

  const forceLogoutSession = useCallback(
    async (userId: string, tokenHash: string) => {
      await kickSession(userId, tokenHash);
    },
    [],
  );

  return {
    fetchOnlineUserList,
    fetchUserSessions,
    forceLogoutUser,
    forceLogoutSession,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};
