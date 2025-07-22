import { Request, Response } from 'express';

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

// Mock 数据生成函数
const generateMockStats = (): DashboardStats => {
  const baseUsers = 15000;
  const baseViews = 89000;
  const baseOrders = 3200;
  const baseRevenue = 1280000;

  return {
    totalUsers: baseUsers + Math.floor(Math.random() * 1000),
    dailyUsers: 150 + Math.floor(Math.random() * 50),
    totalViews: baseViews + Math.floor(Math.random() * 5000),
    dailyViews: 2800 + Math.floor(Math.random() * 200),
    totalOrders: baseOrders + Math.floor(Math.random() * 100),
    conversionRate: (3.2 + Math.random() * 0.8).toFixed(1) + '%',
    totalRevenue: baseRevenue + Math.floor(Math.random() * 50000),
    revenueGrowth: Math.floor(Math.random() * 30) + 10,
    systemLoad: Math.floor(Math.random() * 30) + 60,
    apiResponseTime: Math.floor(Math.random() * 50) + 120,
    activeConnections: Math.floor(Math.random() * 500) + 1200,
    errorRate: (Math.random() * 0.5).toFixed(2) + '%',
  };
};

const generateTrendData = (days: number = 7): TrendData[] => {
  const data: TrendData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      time: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 2000,
    });
  }

  return data;
};

const generateRankData = (): RankData[] => {
  const stores = [
    '北京旗舰店',
    '上海中心店',
    '深圳科技园店',
    '广州天河店',
    '杭州西湖店',
    '成都春熙路店',
  ];
  return stores
    .map((name, index) => ({
      name,
      value: Math.floor(Math.random() * 50000) + 100000 - index * 5000,
      percentage: Math.floor(Math.random() * 20) + 80 - index * 3,
    }))
    .sort((a, b) => b.value - a.value);
};

const generateSystemMetrics = (): SystemMetrics => ({
  cpu: Math.floor(Math.random() * 30) + 45,
  memory: Math.floor(Math.random() * 25) + 60,
  disk: Math.floor(Math.random() * 20) + 35,
  network: Math.floor(Math.random() * 40) + 30,
});

const generateRealtimeData = (): RealtimeData[] => {
  const data: RealtimeData[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // 每分钟一个数据点
    data.push({
      timestamp: time.toISOString(),
      activeUsers: Math.floor(Math.random() * 200) + 800,
      requests: Math.floor(Math.random() * 500) + 1000,
      errors: Math.floor(Math.random() * 10) + 2,
    });
  }

  return data;
};

// 销售数据
const generateSalesData = () => {
  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];
  return months.map((month) => ({
    month,
    sales: Math.floor(Math.random() * 50000) + 100000,
    target: Math.floor(Math.random() * 30000) + 120000,
  }));
};

// 热门搜索数据
const generateHotSearchData = () => {
  const keywords = [
    '智能手机',
    '笔记本电脑',
    '无线耳机',
    '智能手表',
    '平板电脑',
    '游戏主机',
    '相机镜头',
    '智能音箱',
    '电动牙刷',
    '空气净化器',
  ];
  return keywords
    .map((keyword, index) => ({
      keyword,
      count: Math.floor(Math.random() * 5000) + 10000 - index * 500,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.floor(Math.random() * 20) + 5,
    }))
    .sort((a, b) => b.count - a.count);
};

// 类别占比数据
const generateCategoryData = () => {
  const categories = [
    { name: '电子产品', value: 35 },
    { name: '服装鞋帽', value: 25 },
    { name: '家居用品', value: 20 },
    { name: '美妆护肤', value: 12 },
    { name: '运动户外', value: 8 },
  ];
  return categories;
};

// API 接口定义
export default {
  // 获取仪表盘统计数据
  'GET /api/dashboard/stats': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateMockStats(),
        message: '获取统计数据成功',
      });
    }, 300); // 模拟网络延迟
  },

  // 获取趋势数据
  'GET /api/dashboard/trend': (req: Request, res: Response) => {
    const { days = 7 } = req.query;
    setTimeout(() => {
      res.json({
        success: true,
        data: generateTrendData(Number(days)),
        message: '获取趋势数据成功',
      });
    }, 200);
  },

  // 获取排行数据
  'GET /api/dashboard/rank': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateRankData(),
        message: '获取排行数据成功',
      });
    }, 200);
  },

  // 获取系统指标
  'GET /api/dashboard/system': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateSystemMetrics(),
        message: '获取系统指标成功',
      });
    }, 100);
  },

  // 获取实时数据
  'GET /api/dashboard/realtime': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateRealtimeData(),
        message: '获取实时数据成功',
      });
    }, 100);
  },

  // 获取销售数据
  'GET /api/dashboard/sales': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateSalesData(),
        message: '获取销售数据成功',
      });
    }, 200);
  },

  // 获取热门搜索
  'GET /api/dashboard/hot-search': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateHotSearchData(),
        message: '获取热门搜索成功',
      });
    }, 200);
  },

  // 获取类别数据
  'GET /api/dashboard/category': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({
        success: true,
        data: generateCategoryData(),
        message: '获取类别数据成功',
      });
    }, 200);
  },
};
