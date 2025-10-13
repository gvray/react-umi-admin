import {
  getDashboardOverview,
  getRoleDistribution,
} from '@/services/dashboard';
import { useCallback, useEffect, useState } from 'react';

export const useDashboard = () => {
  const [overview, setOverview] = useState<any>(null);
  const [roleDistribution, setRoleDistribution] = useState<any>(null);
  const [loginData, setLoginData] = useState<number[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const fetchOverview = useCallback(async () => {
    try {
      const res = await getDashboardOverview();
      if (res.data) {
        setOverview(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchRoleDistribution = useCallback(async () => {
    try {
      const res = await getRoleDistribution();
      if (res.data) {
        setRoleDistribution(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchRoleDistribution();
  }, [fetchOverview, fetchRoleDistribution]);

  // 模拟加载数据
  useEffect(() => {
    setLoginData([50, 120, 150, 80, 70, 110, 130]);
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
        action: '登录',
        status: '成功',
        ip: '192.168.1.23',
      },
      {
        time: '2025-10-13 09:15',
        user: 'user2',
        action: '修改权限',
        status: '失败',
        ip: '192.168.1.8',
      },
    ]);
  }, []);

  return {
    overview,
    roleDistribution,
    loginData,
    logs,
  };
};
