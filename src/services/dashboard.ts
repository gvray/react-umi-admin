import { request } from 'umi';

// 数据类型定义
export interface DashboardStats {
  totalUsers: number;
  dailyUsers: number;
  totalViews: number;
  dailyViews: number;
  totalOrders: number;
  conversionRate: string;
  totalRevenue: number;
  revenueGrowth: number;
  systemLoad: number;
  apiResponseTime: number;
  activeConnections: number;
  errorRate: string;
}

export interface TrendData {
  time: string;
  value: number;
  type?: string;
}

export interface RankData {
  name: string;
  value: number;
  percentage: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface RealtimeData {
  timestamp: string;
  activeUsers: number;
  requests: number;
  errors: number;
}

export interface SalesData {
  month: string;
  sales: number;
  target: number;
}

export interface HotSearchData {
  keyword: string;
  count: number;
  trend: 'up' | 'down';
  change: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

// API 服务函数
export async function getDashboardStats(): Promise<{ data: DashboardStats }> {
  return request('/dashboard/stats');
}

export async function getTrendData(
  days?: number,
): Promise<{ data: TrendData[] }> {
  return request('/dashboard/trend', {
    params: { days },
  });
}

export async function getRankData(): Promise<{ data: RankData[] }> {
  return request('/dashboard/rank');
}

export async function getSystemMetrics(): Promise<{ data: SystemMetrics }> {
  return request('/dashboard/system');
}

export async function getRealtimeData(): Promise<{ data: RealtimeData[] }> {
  return request('/dashboard/realtime');
}

export async function getSalesData(): Promise<{ data: SalesData[] }> {
  return request('/dashboard/sales');
}

export async function getHotSearchData(): Promise<{ data: HotSearchData[] }> {
  return request('/dashboard/hot-search');
}

export async function getCategoryData(): Promise<{ data: CategoryData[] }> {
  return request('/dashboard/category');
}
