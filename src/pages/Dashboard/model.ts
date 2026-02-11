import {
  queryDashboardOverview,
  queryLoginTrend,
  queryRoleDistribution,
} from '@/services/dashboard';
import { useCallback, useEffect, useState } from 'react';

export interface ActivityLog {
  time: string;
  user: string;
  action: string;
  status: string;
  ip: string;
}

export const useDashboard = () => {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(
    null,
  );
  const [roleDistribution, setRoleDistribution] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loginData, setLoginData] = useState<{ date: string; value: number }[]>(
    [],
  );
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const fetchOverview = useCallback(async () => {
    const res = await queryDashboardOverview();
    if (res.data) {
      setOverview(res.data);
    }
  }, []);

  const fetchRoleDistribution = useCallback(async () => {
    const res = await queryRoleDistribution();
    if (res.data) {
      setRoleDistribution(res.data);
    }
  }, []);

  const fetchLoginTrend = useCallback(async () => {
    const res = await queryLoginTrend();
    if (res.data) {
      setLoginData(res.data as unknown as { date: string; value: number }[]);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchRoleDistribution(),
      fetchLoginTrend(),
    ]);
  }, [fetchOverview, fetchRoleDistribution, fetchLoginTrend]);

  useEffect(() => {
    setLogs([
      {
        time: '2025-10-13 09:21',
        user: 'admin',
        action: '删除角色',
        status: '成功',
        ip: '192.168.1.5',
      },
      {
        time: '2025-10-13 09:20',
        user: 'user1',
        action: '登录系统',
        status: '成功',
        ip: '192.168.1.23',
      },
      {
        time: '2025-10-13 09:18',
        user: 'admin',
        action: '新增用户 zhangsan',
        status: '成功',
        ip: '192.168.1.5',
      },
      {
        time: '2025-10-13 09:15',
        user: 'user2',
        action: '修改权限配置',
        status: '失败',
        ip: '192.168.1.8',
      },
      {
        time: '2025-10-13 09:10',
        user: 'admin',
        action: '更新系统配置',
        status: '成功',
        ip: '192.168.1.5',
      },
      {
        time: '2025-10-13 09:05',
        user: 'user3',
        action: '登录系统',
        status: '成功',
        ip: '10.0.0.12',
      },
    ]);
  }, []);

  return {
    overview,
    roleDistribution,
    loginData,
    logs,
    fetchDashboardData,
  };
};
