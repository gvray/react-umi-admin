import {
  CategoryData,
  DashboardStats,
  HotSearchData,
  RankData,
  RealtimeData,
  SalesData,
  SystemMetrics,
  TrendData,
  getCategoryData,
  getDashboardStats,
  getHotSearchData,
  getRankData,
  getRealtimeData,
  getSalesData,
  getSystemMetrics,
  getTrendData,
} from '@/services/dashboard';
import { useCallback, useEffect, useState } from 'react';

export interface DashboardModelState {
  stats: DashboardStats | null;
  trendData: TrendData[];
  rankData: RankData[];
  systemMetrics: SystemMetrics | null;
  realtimeData: RealtimeData[];
  salesData: SalesData[];
  hotSearchData: HotSearchData[];
  categoryData: CategoryData[];
  loading: boolean;
}

// Dashboard Hook
export const useDashboardModel = () => {
  const [state, setState] = useState<DashboardModelState>({
    stats: null,
    trendData: [],
    rankData: [],
    systemMetrics: null,
    realtimeData: [],
    salesData: [],
    hotSearchData: [],
    categoryData: [],
    loading: false,
  });

  // 加载所有数据
  const loadAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [
        statsRes,
        trendRes,
        rankRes,
        systemRes,
        realtimeRes,
        salesRes,
        hotSearchRes,
        categoryRes,
      ] = await Promise.all([
        getDashboardStats(),
        getTrendData(7),
        getRankData(),
        getSystemMetrics(),
        getRealtimeData(),
        getSalesData(),
        getHotSearchData(),
        getCategoryData(),
      ]);

      setState({
        stats: statsRes.data,
        trendData: trendRes.data,
        rankData: rankRes.data,
        systemMetrics: systemRes.data,
        realtimeData: realtimeRes.data,
        salesData: salesRes.data,
        hotSearchData: hotSearchRes.data,
        categoryData: categoryRes.data,
        loading: false,
      });
    } catch (error) {
      console.error('加载数据失败:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // 刷新数据
  const refreshData = useCallback(async () => {
    await loadAllData();
  }, [loadAllData]);

  // 实时数据更新
  useEffect(() => {
    // 初始加载
    loadAllData();

    // 定时更新实时数据
    const interval = setInterval(async () => {
      try {
        const [statsRes, systemRes, realtimeRes] = await Promise.all([
          getDashboardStats(),
          getSystemMetrics(),
          getRealtimeData(),
        ]);

        setState((prev) => ({
          ...prev,
          stats: statsRes.data,
          systemMetrics: systemRes.data,
          realtimeData: realtimeRes.data,
        }));
      } catch (error) {
        console.error('实时数据更新失败:', error);
      }
    }, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, [loadAllData]);

  return {
    ...state,
    refreshData,
  };
};

// 工具函数
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export const formatCurrency = (num: number): string => {
  return '¥' + num.toLocaleString();
};

export const getStatusColor = (
  value: number,
  thresholds: { warning: number; danger: number },
) => {
  if (value >= thresholds.danger) return '#ff4d4f';
  if (value >= thresholds.warning) return '#faad14';
  return '#52c41a';
};
